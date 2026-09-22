import type {
  CompressionOptions,
  CompressionResult,
  Plugin,
} from '../types';
import { isImageType, getImageExtension, createImageElement } from '../utils/image';
import { calculateDimensions, getSourceDimensions } from '../utils/resize';
import { getOrientationFromArrayBuffer, parseOrientation, stripExifFromArrayBuffer } from '../utils/exif';
import {
  shouldUseDualPass,
  applyNoiseReduction,
  applyColorWeighting,
  convertHdrToSdr,
} from '../utils/compression';
import { canvasToBlob, createCanvas, drawImageToCanvas } from '../utils/canvas';
import { PluginManager } from './plugins';
import { applyPreset } from '../utils/presets';
import { applyFilter } from '../utils/filters';
import { validateImage } from '../utils/validation';
import { analyzeImageContent, getSmartQuality } from '../utils/smart-quality';
import { detectTransparency, shouldConvertToJPEG } from '../utils/format-conversion';
import { optimizePNG } from '../utils/png-optimization';
import { calculateSmartCrop } from '../utils/smart-crop';
import { applyWatermark } from '../utils/watermark';
import { PerformanceMonitor } from '../utils/performance-monitoring';
import { canvasToPixu, PIXU_MIME_TYPE, isPixuSupported, normalizePixuFormat } from '../utils/pixu-format';

export class PixuCompressor {
  private plugins: PluginManager;
  private aborted = false;
  private isCompressing = false;

  constructor() {
    this.plugins = new PluginManager();
  }

  async compress(
    file: File | Blob,
    options: CompressionOptions = {}
  ): Promise<CompressionResult> {
    if (this.aborted) {
      throw new Error('Compression was aborted');
    }

    if (this.isCompressing) {
      throw new Error('Compression already in progress');
    }

    // Normalize file type for checking
    const fileType = file.type || '';
    const normalizedType = fileType.toLowerCase().replace(/^image\/jpg$/, 'image/jpeg');
    
    if (!isImageType(normalizedType)) {
      throw new Error('File must be an image');
    }

    // Apply preset if specified
    let finalOptions = options;
    if (options.preset) {
      finalOptions = applyPreset(options, options.preset);
    }

    // Validate image if requested
    if (finalOptions.validateImage) {
      const validation = await validateImage(file);
      if (!validation.isValid) {
        throw new Error(`Image validation failed: ${validation.errors.join(', ')}`);
      }
      if (validation.warnings.length > 0) {
        console.warn('Image validation warnings:', validation.warnings);
      }
    }

    this.isCompressing = true;
    try {
      // Run before compress plugins with protection
      let processedFile = file;
      try {
        processedFile = await this.plugins.runBeforeCompress(file, finalOptions);
      } catch (pluginError) {
        console.warn('Plugin beforeCompress error:', pluginError);
        // Continue with original file
      }
      
      const result = await this.performCompression(processedFile, finalOptions);
      
      // Run after compress plugins with protection
      let finalResult = result;
      try {
        finalResult = await this.plugins.runAfterCompress(result, finalOptions);
      } catch (pluginError) {
        console.warn('Plugin afterCompress error:', pluginError);
        // Continue with original result
      }
      
      return finalResult;
    } finally {
      this.isCompressing = false;
    }
  }

  private async performCompression(
    file: File | Blob,
    options: CompressionOptions
  ): Promise<CompressionResult> {
    if (this.aborted) {
      throw new Error('Compression was aborted');
    }

    const originalSize = file.size;
    const monitor = options.monitorPerformance 
      ? new PerformanceMonitor(originalSize)
      : null;
    let arrayBuffer: ArrayBuffer | null = null;
    let orientation = 1;
    
    // Normalize file type - jpg to jpeg
    let fileType = (file.type || 'image/jpeg').toLowerCase();
    if (fileType === 'image/jpg') {
      fileType = 'image/jpeg';
    }

    if (options.fixOrientation || options.stripMetadata) {
      try {
        arrayBuffer = await file.arrayBuffer();
        
        // Validate array buffer
        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
          throw new Error('Invalid image data');
        }
        
        if (options.fixOrientation) {
          try {
            orientation = getOrientationFromArrayBuffer(arrayBuffer);
            // Validate orientation value
            if (!orientation || orientation < 1 || orientation > 8) {
              orientation = 1;
            }
          } catch (exifError) {
            console.warn('Failed to read EXIF orientation, using default:', exifError);
            orientation = 1;
          }
        }
        
        if (options.stripMetadata) {
          try {
            arrayBuffer = stripExifFromArrayBuffer(arrayBuffer);
          } catch (stripError) {
            console.warn('Failed to strip EXIF, continuing with original:', stripError);
            // Continue with original arrayBuffer
          }
        }
      } catch (bufferError) {
        console.warn('Failed to process image buffer, continuing without EXIF processing:', bufferError);
        // Continue without EXIF processing
        arrayBuffer = null;
        orientation = 1;
      }
    }

    let imageUrl: string;
    if (arrayBuffer) {
      const blob = new Blob([arrayBuffer], { type: fileType });
      imageUrl = URL.createObjectURL(blob);
    } else {
      imageUrl = URL.createObjectURL(file);
    }

    try {
      const img = await createImageElement(imageUrl);
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      
      // Validate image dimensions
      if (!naturalWidth || !naturalHeight || naturalWidth <= 0 || naturalHeight <= 0) {
        throw new Error('Invalid image dimensions');
      }

      // Only calculate dimensions if resize options are explicitly set
      // Default behavior: preserve original dimensions
      const dimensions = calculateDimensions({
        naturalWidth,
        naturalHeight,
        maxWidth: options.maxWidth, // undefined if not set
        maxHeight: options.maxHeight, // undefined if not set
        minWidth: options.minWidth, // undefined if not set
        minHeight: options.minHeight, // undefined if not set
        width: options.width, // undefined if not set
        height: options.height, // undefined if not set
        mode: options.resize || 'none', // 'none' by default - no resizing
      });

      // Use already normalized fileType from above
      // Determine output format - simplified to avoid recursion
      let format: string = fileType;
      if (options.format && options.format !== 'auto') {
        format = options.format.toLowerCase();
        if (format === 'image/jpg') {
          format = 'image/jpeg';
        }
      } else if (options.format === 'auto') {
        // Smart format selection: prefer PIX for best compression
        if (isPixuSupported() && (fileType === 'image/jpeg' || fileType === 'image/png')) {
          format = PIXU_MIME_TYPE;
        } else if (fileType === 'image/jpeg' || fileType === 'image/png') {
          // Try WebP if supported, but don't check recursively
          try {
            if (typeof document !== 'undefined') {
              const testCanvas = document.createElement('canvas');
              testCanvas.width = 1;
              testCanvas.height = 1;
              const testDataURL = testCanvas.toDataURL('image/webp');
              if (testDataURL && testDataURL.indexOf('image/webp') === 5) {
                format = 'image/webp';
              } else {
                format = fileType;
              }
            } else {
              format = fileType;
            }
          } catch {
            format = fileType;
          }
        } else {
          format = fileType;
        }
      }

      // JPEG/WebP photos forced to PNG almost always grow — only keep PNG when
      // the source is already PNG or PNG optimization was explicitly requested.
      if (
        format === 'image/png' &&
        fileType !== 'image/png' &&
        !options.optimizePNG?.enabled
      ) {
        if (isPixuSupported()) {
          format = PIXU_MIME_TYPE;
        } else {
          format = fileType === 'image/jpeg' ? 'image/jpeg' : fileType;
        }
      }


      format = normalizePixuFormat(format);

      if (!format || (!isImageType(format) && format !== PIXU_MIME_TYPE)) {
        format = 'image/jpeg';
      }
      
      // Final normalization
      if (format === 'image/jpg') {
        format = 'image/jpeg';
      }

      // Determine quality — TECR context C (Smart Quality) defaults on for PIXU
      let quality: number = options.quality ?? 0.8;
      const useSmartQuality =
        options.enableSmartQuality === true ||
        (format === PIXU_MIME_TYPE && options.enableSmartQuality !== false);

      if (useSmartQuality) {
        try {
          const tempCanvas = createCanvas(naturalWidth, naturalHeight);
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.drawImage(img, 0, 0);
            const analysis = await analyzeImageContent(tempCanvas);
            if (options.quality == null) {
              quality = getSmartQuality(
                { ...options, enableSmartQuality: true },
                analysis
              );
            } else {
              quality = Math.min(
                options.quality,
                (options.quality + analysis.recommendedQuality) / 2
              );
            }
          }
        } catch (error) {
          console.warn('Smart quality analysis failed, using default:', error);
        }
      } else if (options.mode === 'adaptive' && !options.quality) {
        // Simple adaptive quality without recursion
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > 10) {
          quality = 0.7;
        } else if (sizeMB > 5) {
          quality = 0.75;
        } else if (sizeMB < 1) {
          quality = 0.85;
        } else {
          quality = 0.8;
        }
      }
      
      // Ensure quality is valid and not exactly 1.0
      // Quality 1.0 often results in no compression for JPEG/WebP
      // Limit to 0.99 to ensure compression is applied
      quality = Math.max(0.1, Math.min(0.99, quality));

      if (options.onProgress) {
        options.onProgress(0.3);
      }

      // Apply smart crop if requested (before creating final canvas)
      let cropArea = null;
      if (options.smartCrop?.enabled) {
        // Create temporary canvas to calculate crop
        const tempCanvas = createCanvas(naturalWidth, naturalHeight);
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0);
          cropArea = calculateSmartCrop(tempCanvas, {
            width: options.smartCrop.width,
            height: options.smartCrop.height,
            focus: options.smartCrop.focus,
          });
          // Update dimensions to crop size
          dimensions.width = cropArea.width;
          dimensions.height = cropArea.height;
        }
      }

      // Validate dimensions before creating canvas
      if (dimensions.width <= 0 || dimensions.height <= 0 || 
          !isFinite(dimensions.width) || !isFinite(dimensions.height)) {
        throw new Error('Invalid canvas dimensions');
      }
      
      // Limit maximum canvas size to prevent memory issues
      const MAX_CANVAS_SIZE = 16384; // 16K pixels
      if (dimensions.width > MAX_CANVAS_SIZE || dimensions.height > MAX_CANVAS_SIZE) {
        throw new Error(`Canvas dimensions too large (max ${MAX_CANVAS_SIZE}px)`);
      }
      
      const canvas = createCanvas(dimensions.width, dimensions.height);
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.fillStyle = format === 'image/jpeg' ? '#ffffff' : 'transparent';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      if (options.beforeProcess) {
        options.beforeProcess(ctx, canvas);
      }

      if (this.aborted) {
        throw new Error('Compression was aborted');
      }

      const orientationData = parseOrientation(orientation);
      const resizeMode = options.resize || 'none';
      
      let srcParams: { x: number; y: number; width: number; height: number } | undefined;
      if (resizeMode === 'cover' || resizeMode === 'contain') {
        srcParams = getSourceDimensions(
          naturalWidth,
          naturalHeight,
          dimensions.width,
          dimensions.height,
          resizeMode
        );
      }

      // Draw image with smart crop if enabled
      if (cropArea) {
        drawImageToCanvas(ctx, img, {
          srcX: cropArea.x,
          srcY: cropArea.y,
          srcWidth: cropArea.width,
          srcHeight: cropArea.height,
          destX: 0,
          destY: 0,
          destWidth: dimensions.width,
          destHeight: dimensions.height,
          rotate: orientationData.rotate,
          scaleX: orientationData.scaleX,
          scaleY: orientationData.scaleY,
        });
      } else {
        drawImageToCanvas(ctx, img, {
          srcX: srcParams?.x,
          srcY: srcParams?.y,
          srcWidth: srcParams?.width,
          srcHeight: srcParams?.height,
          destX: 0,
          destY: 0,
          destWidth: dimensions.width,
          destHeight: dimensions.height,
          rotate: orientationData.rotate,
          scaleX: orientationData.scaleX,
          scaleY: orientationData.scaleY,
        });
      }

      if (options.enableNoiseAware) {
        applyNoiseReduction(ctx, canvas);
      }

      if (options.enableColorWeighting) {
        applyColorWeighting(ctx, canvas);
      }

      if (options.enableHdrToSdr) {
        convertHdrToSdr(ctx, canvas);
      }

      // Optimize PNG if requested
      if (format === 'image/png' && options.optimizePNG?.enabled) {
        try {
          optimizePNG(canvas, {
            reduceColors: options.optimizePNG.reduceColors,
            maxColors: options.optimizePNG.maxColors,
            optimizeTransparency: options.optimizePNG.optimizeTransparency,
          });
        } catch (pngError) {
          console.warn('PNG optimization failed:', pngError);
        }
      }

      // Apply image filters if specified
      if (options.filters && options.filters.length > 0) {
        for (const filter of options.filters) {
          try {
            applyFilter(ctx, canvas, filter);
          } catch (filterError) {
            console.warn('Filter application failed:', filterError);
          }
        }
      }

      // Apply watermark if specified
      if (options.watermark) {
        try {
          applyWatermark(ctx, canvas, options.watermark);
        } catch (watermarkError) {
          console.warn('Watermark application failed:', watermarkError);
        }
      }

      // Check if format conversion is needed (after drawing to canvas)
      if (options.convertToJPEG && format !== 'image/jpeg') {
        try {
          const hasTransparency = await detectTransparency(canvas);
          if (shouldConvertToJPEG(format, hasTransparency, originalSize)) {
            // Convert to JPEG by filling with white background
            ctx.fillStyle = '#ffffff';
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
            format = 'image/jpeg';
          }
        } catch (convertError) {
          console.warn('Format conversion failed:', convertError);
        }
      }

      if (options.afterProcess) {
        options.afterProcess(ctx, canvas);
      }

      // Run plugins transform - with protection
      try {
        await this.plugins.runTransform(canvas, options);
      } catch (pluginError) {
        console.warn('Plugin transform error:', pluginError);
        // Continue without plugin transform
      }

      if (this.aborted) {
        throw new Error('Compression was aborted');
      }

      if (options.onProgress) {
        options.onProgress(0.8);
      }

      // Convert canvas to blob - with PIX format support
      let blob: Blob;
      const useDualPass = shouldUseDualPass(options) && options.mode === 'size' && options.targetSize;

      // Normalize format for PIXU (use format directly, already normalized above)
      const encodeFormat = format;

      if (useDualPass && options.targetSize) {
        if (encodeFormat === PIXU_MIME_TYPE) {
          // Use PIX for dual pass
          blob = await canvasToPixu(canvas, quality, { adaptive: true });
        } else {
          blob = await this.dualPassCompression(canvas, encodeFormat, quality, originalSize, options.targetSize);
        }
      } else {
        if (encodeFormat === PIXU_MIME_TYPE) {
          // Use PIX format with advanced compression
          blob = await canvasToPixu(canvas, quality, {
            progressive: options.enableProgressive !== false,
            adaptive: true,
            chromaSubsampling: '4:2:0',
          });
        } else {
          blob = await canvasToBlob(canvas, encodeFormat, quality);
        }
      }

      if (options.onProgress) {
        options.onProgress(1.0);
      }

      const fileName = file instanceof File ? file.name : 'image';
      const extension = getImageExtension(format);
      // Ensure format is normalized (jpeg not jpg)
      const finalFormat = format === 'image/jpg' ? 'image/jpeg' : format;
      const finalFile = new File([blob], fileName.replace(/\.[^.]+$/, extension), {
        type: finalFormat,
        lastModified: Date.now(),
      });

      const compressedSize = finalFile.size;

      const strict = options.strict !== false;
      let resultFile: File | Blob = finalFile;
      let resultCompressedSize = compressedSize;
      let resultFormat = finalFormat;
      let usedQuality = quality;

      const minWorthwhileRatio = 0.15;
      const wasResized =
        (options.width !== undefined && options.width !== naturalWidth) ||
        (options.height !== undefined && options.height !== naturalHeight) ||
        (options.maxWidth !== undefined && dimensions.width < naturalWidth) ||
        (options.maxHeight !== undefined && dimensions.height < naturalHeight) ||
        (options.minWidth !== undefined && dimensions.width > naturalWidth) ||
        (options.minHeight !== undefined && dimensions.height > naturalHeight) ||
        (options.resize && options.resize !== 'none');

      const savingsRatio = () => 1 - resultCompressedSize / originalSize;
      const needsMoreSavings =
        resultCompressedSize >= originalSize || savingsRatio() < minWorthwhileRatio;

      if (needsMoreSavings) {
        const qualities = [0.72, 0.62, 0.52, 0.42, 0.32, 0.25];
        // Prefer lossy formats when PNG (or any pick) grew past the source
        const formatsToTry = (
          resultFormat === 'image/png' || resultCompressedSize >= originalSize
            ? [PIXU_MIME_TYPE, 'image/webp', 'image/jpeg', resultFormat]
            : wasResized
              ? [resultFormat, 'image/webp', 'image/jpeg', PIXU_MIME_TYPE]
              : [PIXU_MIME_TYPE, 'image/webp', 'image/jpeg', resultFormat]
        ).filter((value, index, list) => list.indexOf(value) === index);

        for (const candidateFormat of formatsToTry) {
          for (const candidateQuality of qualities) {
            try {
              const candidateBlob =
                candidateFormat === PIXU_MIME_TYPE
                  ? await canvasToPixu(canvas, candidateQuality, { adaptive: true })
                  : await canvasToBlob(canvas, candidateFormat, candidateQuality);

              if (candidateBlob.size < resultCompressedSize) {
                const candidateExtension =
                  candidateFormat === PIXU_MIME_TYPE
                    ? '.pixu'
                    : candidateFormat === 'image/jpeg'
                      ? '.jpg'
                      : candidateFormat === 'image/webp'
                        ? '.webp'
                        : candidateFormat === 'image/png'
                          ? '.png'
                          : '.jpg';
                resultFile = new File(
                  [candidateBlob],
                  fileName.replace(/\.[^.]+$/, candidateExtension),
                  { type: candidateFormat, lastModified: Date.now() }
                );
                resultCompressedSize = candidateBlob.size;
                resultFormat = candidateFormat;
                usedQuality = candidateQuality;
              }

              if (savingsRatio() >= minWorthwhileRatio) {
                break;
              }
            } catch {
              // try next candidate
            }
          }
          if (savingsRatio() >= minWorthwhileRatio) {
            break;
          }
        }

        // Never fall back to the untouched source when the canvas was mutated
        // (watermark, filters, crop, etc.) — that would drop those effects.
        const canvasMutated =
          Boolean(options.watermark?.text?.trim()) ||
          Boolean(options.watermark?.image) ||
          Boolean(options.filters && options.filters.length > 0) ||
          Boolean(options.smartCrop?.enabled) ||
          Boolean(options.optimizePNG?.enabled);

        if (resultCompressedSize >= originalSize && strict && !canvasMutated) {
          resultFile = file instanceof File ? file : new File([file], fileName, { type: fileType });
          resultCompressedSize = originalSize;
          resultFormat = fileType;
          usedQuality = 1;
        }
      }

      const compressionRatio = Math.max(0, 1 - resultCompressedSize / originalSize);

      return {
        file: resultFile,
        originalSize,
        compressedSize: resultCompressedSize,
        compressionRatio,
        format: resultFormat,
        width: dimensions.width,
        height: dimensions.height,
        metadata: {
          hasExif: !options.stripMetadata && orientation > 1,
          orientation: orientation > 1 ? orientation : undefined,
          quality: usedQuality,
        },
      };
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  }

  private async dualPassCompression(
    canvas: HTMLCanvasElement,
    format: string,
    initialQuality: number,
    originalSize: number,
    targetSize: number
  ): Promise<Blob> {
    // Limit quality to 0.99 max to ensure compression
    let quality = Math.max(0.1, Math.min(0.99, initialQuality));
    let blob = await canvasToBlob(canvas, format, quality);
    let iterations = 0;
    const maxIterations = 10;

    while (blob.size > targetSize && iterations < maxIterations) {
      // Simple quality reduction without complex calculations
      const ratio = blob.size / targetSize;
      if (ratio > 2) {
        quality *= 0.7;
      } else if (ratio > 1.5) {
        quality *= 0.8;
      } else {
        quality *= 0.9;
      }
      
      quality = Math.max(0.1, Math.min(0.99, quality));
      blob = await canvasToBlob(canvas, format, quality);
      iterations++;
      
      // Safety check - if quality is at minimum, stop
      if (quality <= 0.1) {
        break;
      }
    }

    return blob;
  }

  abort(): void {
    this.aborted = true;
  }

  registerPlugin(plugin: Plugin): void {
    this.plugins.register(plugin);
  }

  unregisterPlugin(name: string): void {
    this.plugins.unregister(name);
  }
}

