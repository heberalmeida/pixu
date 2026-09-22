# Smart Cropping

Pixu provides intelligent cropping based on content analysis.

## Basic Usage

Enable smart cropping:

<CompressionDemo :options="{ quality: 0.8, smartCrop: { enabled: true, width: 800, height: 600, focus: 'center' } }" />

<VueDemo :options="{ quality: 0.8, smartCrop: { enabled: true, width: 800, height: 600, focus: 'center' } }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  smartCrop: {
    enabled: true,
    width: 800,
    height: 600,
  },
});
```

## Focus Points

Control where the crop focuses:

```typescript
const result = await compress(file, {
  quality: 0.8,
  smartCrop: {
    enabled: true,
    width: 800,
    height: 600,
    focus: 'center',
  },
});
```

Available focus points:
- `center` - Center of image
- `top` - Top third
- `bottom` - Bottom third
- `left` - Left third
- `right` - Right third

## How It Works

Smart cropping:

1. Analyzes image content
2. Calculates center of mass based on brightness and contrast
3. Applies focus point preference
4. Crops to specified dimensions

## Complete Examples

```typescript
import { compress } from '@pantanal/pixu';

async function createThumbnail(file: File) {
  const result = await compress(file, {
    quality: 0.7,
    smartCrop: {
      enabled: true,
      width: 400,
      height: 400,
      focus: 'center',
    },
    onProgress: (progress) => {
      console.log(`Thumbnail creation progress: ${(progress * 100).toFixed(0)}%`);
    },
  });

  console.log('Thumbnail created:', result.width + 'x' + result.height);
  return result.file;
}

async function createBanner(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    smartCrop: {
      enabled: true,
      width: 1920,
      height: 400,
      focus: 'top',
    },
  });

  console.log('Banner created:', result.width + 'x' + result.height);
  return result.file;
}

async function createSquareCrop(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    smartCrop: {
      enabled: true,
      width: 1080,
      height: 1080,
      focus: 'center',
    },
  });

  return result.file;
}

async function tryAllFocusPoints(file: File) {
  const focusPoints: Array<'center' | 'top' | 'bottom' | 'left' | 'right'> = [
    'center',
    'top',
    'bottom',
    'left',
    'right',
  ];

  const results: Record<string, File> = {};

  for (const focus of focusPoints) {
    try {
      const result = await compress(file, {
        quality: 0.8,
        smartCrop: {
          enabled: true,
          width: 800,
          height: 600,
          focus,
        },
      });
      results[focus] = result.file;
      console.log(`Crop with ${focus} focus completed`);
    } catch (error) {
      console.error(`Crop with ${focus} focus failed:`, error);
    }
  }

  return results;
}
```

