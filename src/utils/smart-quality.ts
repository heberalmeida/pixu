import type { CompressionOptions } from '../types';

export interface ContentAnalysis {
  isPhoto: boolean;
  isGraphic: boolean;
  hasText: boolean;
  complexity: 'low' | 'medium' | 'high';
  recommendedQuality: number;
}

export async function analyzeImageContent(
  canvas: HTMLCanvasElement
): Promise<ContentAnalysis> {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      isPhoto: true,
      isGraphic: false,
      hasText: false,
      complexity: 'medium',
      recommendedQuality: 0.8,
    };
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  const pixelCount = width * height;

  // Analyze color distribution
  let uniqueColors = 0;
  const colorMap = new Map<string, number>();
  let edgeCount = 0;

  // Sample pixels (every 10th pixel for performance)
  const sampleRate = 10;
  for (let i = 0; i < data.length; i += 4 * sampleRate) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 255) {
      // Has transparency
      continue;
    }

    const colorKey = `${Math.floor(r / 16)}-${Math.floor(g / 16)}-${Math.floor(b / 16)}`;
    if (!colorMap.has(colorKey)) {
      uniqueColors++;
      colorMap.set(colorKey, 1);
    }

    // Simple edge detection (check neighbors)
    const x = (i / 4) % width;
    const y = Math.floor((i / 4) / width);
    if (x > 0 && y > 0 && x < width - 1 && y < height - 1) {
      const idx = (y * width + x) * 4;
      const neighborIdx = (y * width + (x + 1)) * 4;
      const diff = Math.abs(
        (data[idx] + data[idx + 1] + data[idx + 2]) / 3 -
        (data[neighborIdx] + data[neighborIdx + 1] + data[neighborIdx + 2]) / 3
      );
      if (diff > 30) {
        edgeCount++;
      }
    }
  }

  const sampledPixels = pixelCount / sampleRate;
  const colorDiversity = uniqueColors / sampledPixels;
  const edgeRatio = edgeCount / sampledPixels;

  // Determine content type
  const isPhoto = colorDiversity > 0.3 && edgeRatio > 0.1;
  const isGraphic = colorDiversity < 0.2 && edgeRatio < 0.05;
  const hasText = edgeRatio > 0.15 && colorDiversity < 0.4;

  // Determine complexity
  let complexity: 'low' | 'medium' | 'high';
  if (colorDiversity < 0.1 && edgeRatio < 0.05) {
    complexity = 'low';
  } else if (colorDiversity > 0.5 || edgeRatio > 0.2) {
    complexity = 'high';
  } else {
    complexity = 'medium';
  }

  // Recommend quality based on content
  let recommendedQuality: number;
  if (isGraphic || hasText) {
    // Graphics and text need higher quality
    recommendedQuality = 0.9;
  } else if (isPhoto && complexity === 'high') {
    // Complex photos can use lower quality
    recommendedQuality = 0.75;
  } else if (isPhoto && complexity === 'low') {
    // Simple photos can use medium quality
    recommendedQuality = 0.85;
  } else {
    // Default
    recommendedQuality = 0.8;
  }

  return {
    isPhoto,
    isGraphic,
    hasText,
    complexity,
    recommendedQuality,
  };
}

export function getSmartQuality(
  options: CompressionOptions,
  analysis: ContentAnalysis
): number {
  // If quality is explicitly set, use it
  if (options.quality !== undefined && options.quality !== null) {
    return options.quality;
  }

  // Use recommended quality from analysis
  return analysis.recommendedQuality;
}

