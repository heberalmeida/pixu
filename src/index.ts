export { PixuCompressor } from './core/compressor';
export { compressBatch } from './core/batch';
export { compressStream } from './core/stream';
export { PluginManager } from './core/plugins';
export { getPresetOptions, applyPreset } from './utils/presets';
export { applyFilter } from './utils/filters';
export { validateImage, isValidImage } from './utils/validation';
export { analyzeImageContent, getSmartQuality } from './utils/smart-quality';
export { convertFormat, detectTransparency, shouldConvertToJPEG } from './utils/format-conversion';
export { optimizePNG } from './utils/png-optimization';
export { calculateSmartCrop } from './utils/smart-crop';
export { applyWatermark } from './utils/watermark';
export { analyzeImage, type ImageAnalysisResult } from './utils/image-analysis';
export { getOptimizationHints, estimateCompressionSavings } from './utils/optimization-hints';
export { generateResponsiveImages, generateSrcset, generateSizes } from './utils/lazy-loading';
export { analyzeColorSpace, normalizeToSRGB, supportsWideGamut } from './utils/color-space';
export { isProgressiveJPEG, supportsProgressiveJPEG } from './utils/progressive-jpeg';
export { AdvancedBatchProcessor } from './core/batch-advanced';
export { PerformanceMonitor, formatBytes, formatDuration } from './utils/performance-monitoring';
export { getMemoryInfo, shouldUseStreaming, calculateChunkSize } from './utils/memory-management';
export {
  canvasToPixu,
  isPixuSupported,
  PIXU_MIME_TYPE,
  PIXU_EXTENSION,
  estimatePixuCompression,
  normalizePixuFormat,
  detectPixuPayloadMime,
  isPixuBlob,
  pixuToDisplayBlob,
  createPixuObjectURL,
  loadPixuImage,
  createPreviewObjectURL,
  canvasToPix,
  isPixSupported,
  PIX_MIME_TYPE,
  PIX_EXTENSION,
  estimatePixCompression,
} from './utils/pixu-format';
export type { PixuPayloadMime } from './utils/pixu-format';
export { getOutputExtension, buildDownloadName, toDownloadableBlob, triggerBlobDownload, downloadImageAs, DOWNLOAD_IMAGE_FORMATS } from './utils/output-format';
export type { DownloadImageFormat } from './utils/output-format';
export type {
  CompressionOptions,
  CompressionResult,
  BatchCompressionOptions,
  StreamCompressionOptions,
  Plugin,
  SupportedFormat,
  ResizeMode,
  CompressionMode,
  CompressionStrategy,
  CompressionPreset,
  ImageFilter,
} from './types';

import { PixuCompressor } from './core/compressor';

const defaultInstance = new PixuCompressor();

export default defaultInstance;

export async function compress(
  file: File | Blob,
  options?: import('./types').CompressionOptions
): Promise<import('./types').CompressionResult> {
  return defaultInstance.compress(file, options);
}

