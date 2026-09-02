export interface ImageAnalysisResult {
  quality: 'low' | 'medium' | 'high' | 'very-high';
  compressionLevel: number; // 0-1, estimated current compression
  contentType: 'photo' | 'graphic' | 'text' | 'mixed';
  hasText: boolean;
  complexity: 'low' | 'medium' | 'high';
  colorCount: number;
  hasTransparency: boolean;
  recommendedFormat: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';
  recommendedQuality: number;
  estimatedSizeReduction: number; // 0-1, estimated compression potential
  suggestions: string[];
}

export async function analyzeImage(
  canvas: HTMLCanvasElement,
  originalSize?: number
): Promise<ImageAnalysisResult> {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  const pixelCount = width * height;

  // Analyze colors
  const colorMap = new Map<string, number>();
  let transparentPixels = 0;
  let totalBrightness = 0;
  let edgeCount = 0;
  let smoothAreas = 0;

  // Sample pixels for performance
  const sampleRate = 10;
  for (let i = 0; i < data.length; i += 4 * sampleRate) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 255) {
      transparentPixels++;
    }

    const brightness = (r + g + b) / 3;
    totalBrightness += brightness;

    const colorKey = `${Math.floor(r / 8)}-${Math.floor(g / 8)}-${Math.floor(b / 8)}`;
    colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);

    // Edge detection
    const x = (i / 4) % width;
    const y = Math.floor((i / 4) / width);
    if (x > 0 && y > 0 && x < width - 1 && y < height - 1) {
      const idx = (y * width + x) * 4;
      const rightIdx = (y * width + (x + 1)) * 4;
      const diff = Math.abs(
        (data[idx] + data[idx + 1] + data[idx + 2]) / 3 -
        (data[rightIdx] + data[rightIdx + 1] + data[rightIdx + 2]) / 3
      );
      if (diff > 30) {
        edgeCount++;
      } else {
        smoothAreas++;
      }
    }
  }

  const sampledPixels = pixelCount / sampleRate;
  const colorCount = colorMap.size;
  const colorDiversity = colorCount / sampledPixels;
  const edgeRatio = edgeCount / sampledPixels;
  const avgBrightness = totalBrightness / sampledPixels;
  const hasTransparency = transparentPixels > sampledPixels * 0.01;

  // Determine content type
  let contentType: 'photo' | 'graphic' | 'text' | 'mixed';
  if (colorDiversity > 0.3 && edgeRatio > 0.1) {
    contentType = 'photo';
  } else if (colorDiversity < 0.2 && edgeRatio < 0.05) {
    contentType = 'graphic';
  } else if (edgeRatio > 0.15 && colorDiversity < 0.4) {
    contentType = 'text';
  } else {
    contentType = 'mixed';
  }

  // Determine complexity
  let complexity: 'low' | 'medium' | 'high';
  if (colorDiversity < 0.1 && edgeRatio < 0.05) {
    complexity = 'low';
  } else if (colorDiversity > 0.5 || edgeRatio > 0.2) {
    complexity = 'high';
  } else {
    complexity = 'medium';
  }

  // Estimate compression level (simplified)
  let compressionLevel = 0.5; // Default
  if (originalSize) {
    const currentSize = width * height * 4; // Rough estimate
    compressionLevel = 1 - (currentSize / originalSize);
  }

  // Determine quality
  let quality: 'low' | 'medium' | 'high' | 'very-high';
  if (compressionLevel > 0.8) {
    quality = 'very-high';
  } else if (compressionLevel > 0.5) {
    quality = 'high';
  } else if (compressionLevel > 0.2) {
    quality = 'medium';
  } else {
    quality = 'low';
  }

  // Recommend format
  let recommendedFormat: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';
  if (hasTransparency) {
    recommendedFormat = 'image/png';
  } else if (contentType === 'photo' && complexity === 'high') {
    recommendedFormat = 'image/webp';
  } else if (contentType === 'photo') {
    recommendedFormat = 'image/jpeg';
  } else {
    recommendedFormat = 'image/png';
  }

  // Recommend quality
  let recommendedQuality: number;
  if (contentType === 'graphic' || contentType === 'text') {
    recommendedQuality = 0.9;
  } else if (contentType === 'photo' && complexity === 'high') {
    recommendedQuality = 0.75;
  } else {
    recommendedQuality = 0.8;
  }

  // Estimate size reduction potential
  const estimatedSizeReduction = Math.min(0.9, compressionLevel + 0.3);

  // Generate suggestions
  const suggestions: string[] = [];
  if (hasTransparency && recommendedFormat === 'image/jpeg') {
    suggestions.push('Consider converting to PNG to preserve transparency');
  }
  if (colorCount < 256 && contentType === 'graphic') {
    suggestions.push('Image can benefit from color reduction');
  }
  if (compressionLevel < 0.3) {
    suggestions.push('High compression potential - consider lower quality');
  }
  if (width > 1920 || height > 1080) {
    suggestions.push('Consider resizing for web use');
  }

  return {
    quality,
    compressionLevel,
    contentType,
    hasText: contentType === 'text',
    complexity,
    colorCount,
    hasTransparency,
    recommendedFormat,
    recommendedQuality,
    estimatedSizeReduction,
    suggestions,
  };
}

