import type { CompressionOptions } from '../types';
import { analyzeImage } from './image-analysis';
import { detectTransparency } from './format-conversion';

export interface OptimizationHint {
  type: 'format' | 'quality' | 'size' | 'metadata' | 'filter';
  message: string;
  suggestion: string;
  potentialSavings?: number; // Estimated size reduction (0-1)
  priority: 'low' | 'medium' | 'high';
}

export async function getOptimizationHints(
  file: File | Blob,
  canvas: HTMLCanvasElement,
  currentOptions: CompressionOptions
): Promise<OptimizationHint[]> {
  const hints: OptimizationHint[] = [];
  const analysis = await analyzeImage(canvas, file.size);

  // Format suggestions
  if (file.type === 'image/png') {
    const hasTransparency = await detectTransparency(canvas);
    if (!hasTransparency && file.size > 500000) {
      hints.push({
        type: 'format',
        message: 'PNG without transparency can be converted to JPEG',
        suggestion: 'Use convertToJPEG: true or format: "image/jpeg"',
        potentialSavings: 0.5,
        priority: 'high',
      });
    }
  }

  // Quality suggestions
  if (!currentOptions.quality && analysis.contentType === 'photo') {
    hints.push({
      type: 'quality',
      message: `Recommended quality for ${analysis.contentType}: ${analysis.recommendedQuality}`,
      suggestion: `Set quality: ${analysis.recommendedQuality}`,
      potentialSavings: analysis.estimatedSizeReduction,
      priority: 'medium',
    });
  }

  // Size suggestions
  if (canvas.width > 1920 || canvas.height > 1080) {
    hints.push({
      type: 'size',
      message: 'Image is larger than typical web size',
      suggestion: 'Consider maxWidth: 1920, maxHeight: 1080',
      potentialSavings: 0.6,
      priority: 'high',
    });
  }

  // Metadata suggestions
  if (!currentOptions.stripMetadata && file.size > 1000000) {
    hints.push({
      type: 'metadata',
      message: 'Large file may contain metadata',
      suggestion: 'Use stripMetadata: true to reduce size',
      potentialSavings: 0.05,
      priority: 'low',
    });
  }

  // Format optimization
  if (analysis.recommendedFormat !== file.type) {
    hints.push({
      type: 'format',
      message: `Recommended format: ${analysis.recommendedFormat}`,
      suggestion: `Use format: "${analysis.recommendedFormat}"`,
      potentialSavings: 0.3,
      priority: 'medium',
    });
  }

  // Add analysis suggestions
  for (const suggestion of analysis.suggestions) {
    hints.push({
      type: 'format',
      message: suggestion,
      suggestion: 'Review image analysis results',
      priority: 'low',
    });
  }

  return hints.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

export function estimateCompressionSavings(
  file: File | Blob,
  options: CompressionOptions
): number {
  // Rough estimation based on options
  let savings = 0;

  if (options.quality && options.quality < 0.9) {
    savings += (0.9 - options.quality) * 0.5;
  }

  if (options.maxWidth || options.maxHeight) {
    savings += 0.3;
  }

  if (options.stripMetadata) {
    savings += 0.05;
  }

  if (options.format === 'image/webp' || options.format === 'image/avif') {
    savings += 0.2;
  }

  return Math.min(0.9, savings);
}

