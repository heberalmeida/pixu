import type { CompressionOptions, CompressionStrategy } from '../types';

export function calculateOptimalQuality(
  originalSize: number,
  targetSize: number,
  currentQuality: number,
  iterations: number = 0
): number {
  if (iterations >= 10) {
    return Math.max(0.1, currentQuality);
  }

  const ratio = targetSize / originalSize;
  let newQuality = currentQuality;

  if (ratio < 0.5) {
    newQuality = currentQuality * 0.7;
  } else if (ratio < 0.8) {
    newQuality = currentQuality * 0.85;
  } else if (ratio > 1.2) {
    newQuality = Math.min(1, currentQuality * 1.1);
  }

  return Math.max(0.1, Math.min(1, newQuality));
}

export function getQualityForStrategy(strategy: CompressionStrategy): number {
  const map: Record<CompressionStrategy, number> = {
    aggressive: 0.5,
    balanced: 0.75,
    conservative: 0.9,
    smart: 0.8,
  };
  return map[strategy] ?? 0.75;
}

export function getAdaptiveQuality(
  file: File | Blob,
  options: CompressionOptions
): number {
  // Avoid recursion - don't call if quality is already set
  if (options.quality !== undefined && options.quality !== null) {
    return Math.max(0.1, Math.min(1, options.quality));
  }
  
  const sizeMB = file.size / (1024 * 1024);
  let baseQuality = getQualityForStrategy(options.strategy ?? 'balanced');

  if (sizeMB > 10) {
    baseQuality *= 0.85;
  } else if (sizeMB > 5) {
    baseQuality *= 0.9;
  } else if (sizeMB < 1) {
    baseQuality = Math.min(1, baseQuality * 1.05);
  }

  const format = options.format;
  if (format && format !== 'auto' && (format === 'image/webp' || format === 'image/avif')) {
    baseQuality = Math.min(1, baseQuality * 1.1);
  }

  return Math.max(0.1, Math.min(1, baseQuality));
}

export function shouldUseDualPass(options: CompressionOptions): boolean {
  if (options.enableDualPass === false) return false;
  if (options.enableDualPass === true) return true;
  
  const sizeMB = (options.targetSize ? options.targetSize : 0) / (1024 * 1024);
  return sizeMB > 2 || options.mode === 'size';
}

export function applyNoiseReduction(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const gray = r * 0.299 + g * 0.587 + b * 0.114;
    const threshold = 10;
    
    if (Math.abs(r - gray) < threshold) {
      data[i] = gray;
    }
    if (Math.abs(g - gray) < threshold) {
      data[i + 1] = gray;
    }
    if (Math.abs(b - gray) < threshold) {
      data[i + 2] = gray;
    }
  }

  context.putImageData(imageData, 0, 0);
}

export function applyColorWeighting(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const luminance = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const weight = luminance > 128 ? 1.05 : 0.95;
    
    data[i] = Math.min(255, r * weight);
    data[i + 1] = Math.min(255, g * weight);
    data[i + 2] = Math.min(255, b * weight);
  }

  context.putImageData(imageData, 0, 0);
}

export function convertHdrToSdr(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const toneMapFactor = 0.8;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * toneMapFactor);
    data[i + 1] = Math.min(255, data[i + 1] * toneMapFactor);
    data[i + 2] = Math.min(255, data[i + 2] * toneMapFactor);
  }

  context.putImageData(imageData, 0, 0);
}

