import { createCanvas, canvasToBlob } from './canvas';

export const PIXU_MIME_TYPE = 'image/pixu';
export const PIXU_EXTENSION = '.pixu';

/** @deprecated Use PIXU_MIME_TYPE */
export const PIX_MIME_TYPE = PIXU_MIME_TYPE;
/** @deprecated Use PIXU_EXTENSION */
export const PIX_EXTENSION = PIXU_EXTENSION;

export function isPixuSupported(): boolean {
  return true;
}

/** @deprecated Use isPixuSupported */
export const isPixSupported = isPixuSupported;

export function normalizePixuFormat(format: string): string {
  if (format === 'image/pix') return PIXU_MIME_TYPE;
  return format;
}

export async function canvasToPixu(
  canvas: HTMLCanvasElement,
  quality: number = 0.85,
  options: {
    progressive?: boolean;
    adaptive?: boolean;
    chromaSubsampling?: '4:4:4' | '4:2:2' | '4:2:0';
  } = {}
): Promise<Blob> {
  const {
    adaptive = true,
  } = options;

  const ctx = canvas.getContext('2d', {
    willReadFrequently: true,
    colorSpace: 'srgb',
  });

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let adaptiveQuality = quality;
  if (adaptive) {
    adaptiveQuality = calculateAdaptiveQuality(data, width, height, quality);
  }

  const optimizedQuality = applyPerceptualOptimization(adaptiveQuality, data, width, height);
  const pixuQuality = Math.max(0.5, Math.min(0.95, optimizedQuality));

  try {
    const blob = await canvasToBlob(canvas, 'image/webp', pixuQuality);
    return new Blob([blob], { type: PIXU_MIME_TYPE });
  } catch {
    const jpegQuality = Math.max(0.6, pixuQuality);
    const blob = await canvasToBlob(canvas, 'image/jpeg', jpegQuality);
    return new Blob([blob], { type: PIXU_MIME_TYPE });
  }
}

/** @deprecated Use canvasToPixu */
export const canvasToPix = canvasToPixu;

function calculateAdaptiveQuality(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  baseQuality: number
): number {
  let totalVariance = 0;
  let detailArea = 0;
  let smoothArea = 0;

  const blockSize = 8;
  const blocksX = Math.floor(width / blockSize);
  const blocksY = Math.floor(height / blockSize);

  for (let by = 0; by < blocksY; by++) {
    for (let bx = 0; bx < blocksX; bx++) {
      const blockVariance = calculateBlockVariance(
        data,
        width,
        height,
        bx * blockSize,
        by * blockSize,
        blockSize
      );

      totalVariance += blockVariance;

      if (blockVariance > 500) {
        detailArea++;
      } else if (blockVariance < 100) {
        smoothArea++;
      }
    }
  }

  const totalBlocks = blocksX * blocksY;
  const detailRatio = detailArea / totalBlocks;
  const smoothRatio = smoothArea / totalBlocks;

  if (detailRatio > 0.3) {
    return Math.max(0.6, baseQuality - 0.1);
  }
  if (smoothRatio > 0.5) {
    return Math.max(0.5, baseQuality - 0.15);
  }
  return baseQuality;
}

function calculateBlockVariance(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  blockSize: number
): number {
  let sum = 0;
  let sumSquared = 0;
  let count = 0;

  for (let y = startY; y < Math.min(startY + blockSize, height); y++) {
    for (let x = startX; x < Math.min(startX + blockSize, width); x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      sum += gray;
      sumSquared += gray * gray;
      count++;
    }
  }

  if (count === 0) return 0;

  const mean = sum / count;
  return (sumSquared / count) - (mean * mean);
}

function applyPerceptualOptimization(
  quality: number,
  data: Uint8ClampedArray,
  width: number,
  height: number
): number {
  let highSaturationPixels = 0;
  let totalPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;

    if (saturation > 0.5) {
      highSaturationPixels++;
    }
    totalPixels++;
  }

  const saturationRatio = highSaturationPixels / totalPixels;

  if (saturationRatio < 0.2) {
    return Math.max(0.5, quality - 0.08);
  }
  if (saturationRatio > 0.6) {
    return quality;
  }

  return quality;
}

export function estimatePixuCompression(
  originalSize: number,
  quality: number,
  width: number,
  height: number
): number {
  const baseRatio = 0.7;
  const qualityFactor = 1 - quality;
  const sizeFactor = Math.min(1, (width * height) / (1920 * 1080));

  const estimatedRatio = baseRatio - (qualityFactor * 0.2) + (sizeFactor * 0.1);
  return Math.max(0.4, Math.min(0.8, estimatedRatio));
}

/** @deprecated Use estimatePixuCompression */
export const estimatePixCompression = estimatePixuCompression;
