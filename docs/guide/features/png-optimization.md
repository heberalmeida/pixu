# PNG Optimization

Pixu provides advanced PNG optimization features.

## Color Reduction

Reduce color palette to decrease file size:

<CompressionDemo :options="{ quality: 0.8, optimizePNG: { enabled: true, reduceColors: true, maxColors: 128 } }" />

<VueDemo :options="{ quality: 0.8, format: 'image/png', optimizePNG: { enabled: true, reduceColors: true, maxColors: 128 } }" />

```typescript
const result = await compress(pngFile, {
  quality: 0.8,
  optimizePNG: {
    enabled: true,
    reduceColors: true,
    maxColors: 128,
  },
});
```

Available color counts: 2, 4, 16, 64, 128, 256

## Transparency Optimization

Optimize transparent pixels:

```typescript
const result = await compress(pngFile, {
  quality: 0.8,
  optimizePNG: {
    enabled: true,
    optimizeTransparency: true,
  },
});
```

## Combined Optimization

```typescript
const result = await compress(pngFile, {
  quality: 0.8,
  optimizePNG: {
    enabled: true,
    reduceColors: true,
    maxColors: 64,
    optimizeTransparency: true,
  },
});
```

## When to Use

PNG optimization is most effective for:

- Images with limited color palettes
- Graphics and illustrations
- Images with transparency
- Large PNG files

## Complete Examples

```typescript
import { compress } from 'pixu';

async function optimizePNG(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    optimizePNG: {
      enabled: true,
      reduceColors: true,
      maxColors: 128,
      optimizeTransparency: true,
    },
    onProgress: (progress) => {
      console.log(`PNG optimization progress: ${(progress * 100).toFixed(0)}%`);
    },
  });

  console.log('PNG optimized:', {
    original: result.originalSize,
    compressed: result.compressedSize,
    ratio: (result.compressionRatio * 100).toFixed(1) + '%',
  });

  return result.file;
}

async function optimizeWithColorReduction(file: File, maxColors: number) {
  const result = await compress(file, {
    quality: 0.8,
    optimizePNG: {
      enabled: true,
      reduceColors: true,
      maxColors,
      optimizeTransparency: true,
    },
  });

  console.log(`Optimized with ${maxColors} colors`);
  return result.file;
}

async function tryAllColorLevels(file: File) {
  const colorLevels = [256, 128, 64, 16, 4, 2];
  const results: Record<number, File> = {};

  for (const maxColors of colorLevels) {
    try {
      const result = await compress(file, {
        quality: 0.8,
        optimizePNG: {
          enabled: true,
          reduceColors: true,
          maxColors,
          optimizeTransparency: true,
        },
      });
      results[maxColors] = result.file;
      console.log(`${maxColors} colors: ${result.compressedSize} bytes`);
    } catch (error) {
      console.error(`Failed with ${maxColors} colors:`, error);
    }
  }

  return results;
}
```

