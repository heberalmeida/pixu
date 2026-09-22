export interface PNGOptimizationOptions {
  reduceColors?: boolean;
  maxColors?: number; // 2, 4, 16, 64, 128, 256
  optimizeTransparency?: boolean;
  removeUnusedColors?: boolean;
}

export function optimizePNG(
  canvas: HTMLCanvasElement,
  options: PNGOptimizationOptions = {}
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return canvas;
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Analyze color palette
  const colorMap = new Map<string, number>();
  let transparentPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 255) {
      transparentPixels++;
    }

    if (options.reduceColors) {
      const colorKey = `${Math.floor(r / 16) * 16}-${Math.floor(g / 16) * 16}-${Math.floor(b / 16) * 16}`;
      colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
    }
  }

  // Reduce colors if requested
  if (options.reduceColors && options.maxColors) {
    const maxColors = Math.min(options.maxColors, 256);
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxColors);

    const colorPalette = new Map<string, [number, number, number]>();
    sortedColors.forEach(([key]) => {
      const [r, g, b] = key.split('-').map(Number);
      colorPalette.set(key, [r, g, b]);
    });

    // Quantize colors
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Find nearest color in palette
      let minDist = Infinity;
      let nearestColor: [number, number, number] = [r, g, b];

      for (const [, color] of colorPalette.entries()) {
        const dist = Math.sqrt(
          Math.pow(r - color[0], 2) +
          Math.pow(g - color[1], 2) +
          Math.pow(b - color[2], 2)
        );
        if (dist < minDist) {
          minDist = dist;
          nearestColor = color;
        }
      }

      data[i] = nearestColor[0];
      data[i + 1] = nearestColor[1];
      data[i + 2] = nearestColor[2];
    }
  }

  // Optimize transparency
  if (options.optimizeTransparency && transparentPixels > 0) {
    // Remove fully transparent pixels' RGB values (set to 0)
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

