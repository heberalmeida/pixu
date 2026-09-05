# Compression Presets

Pixu provides pre-configured compression presets for common use cases.

## Available Presets

### Social Media

Optimized for Instagram, Facebook, and other social platforms.

<CompressionDemo :options="{ preset: 'social-media' }" />

<VueDemo :options="{ preset: 'social-media' }" />

```typescript
const result = await compress(file, {
  preset: 'social-media',
});
```

Configuration:
- Max width: 1080px
- Quality: 85%
- Format: Auto (PIX format preferred for best compression, falls back to WebP if needed)
- Metadata: Stripped

### Print

High quality for printing.

<CompressionDemo :options="{ preset: 'print' }" />

<VueDemo :options="{ preset: 'print' }" />

```typescript
const result = await compress(file, {
  preset: 'print',
});
```

Configuration:
- Max width: 3000px
- Quality: 95%
- Format: JPEG
- Metadata: Preserved

### Web

Balanced settings for web use.

<CompressionDemo :options="{ preset: 'web' }" />

<VueDemo :options="{ preset: 'web' }" />

```typescript
const result = await compress(file, {
  preset: 'web',
});
```

Configuration:
- Max width: 1920px
- Quality: 80%
- Format: Auto (PIX format preferred for best compression, falls back to WebP if needed)
- Metadata: Stripped

### Thumbnail

Small size for thumbnails and previews.

<CompressionDemo :options="{ preset: 'thumbnail' }" />

<VueDemo :options="{ preset: 'thumbnail' }" />

```typescript
const result = await compress(file, {
  preset: 'thumbnail',
});
```

Configuration:
- Max width: 320px
- Quality: 70%
- Format: Auto (PIX format preferred for best compression)
- Metadata: Stripped

### Email

Optimized for email attachments.

<CompressionDemo :options="{ preset: 'email' }" />

<VueDemo :options="{ preset: 'email' }" />

```typescript
const result = await compress(file, {
  preset: 'email',
});
```

Configuration:
- Max width: 800px
- Quality: 75%
- Format: JPEG
- Metadata: Stripped

## Customizing Presets

You can override preset options:

```typescript
const result = await compress(file, {
  preset: 'web',
  quality: 0.9,
  maxWidth: 2560,
});
```

## Getting Preset Options

```typescript
import { getPresetOptions } from 'pixu';

const options = getPresetOptions('social-media');
console.log(options);
```

## Complete Example

```typescript
import { compress, getPresetOptions } from 'pixu';

async function prepareForSocialMedia(file: File) {
  const presetOptions = getPresetOptions('social-media');
  console.log('Using preset options:', presetOptions);

  const result = await compress(file, {
    preset: 'social-media',
    onProgress: (progress) => {
      console.log(`Progress: ${(progress * 100).toFixed(0)}%`);
    },
  });

  console.log('Result:', {
    original: result.originalSize,
    compressed: result.compressedSize,
    ratio: (result.compressionRatio * 100).toFixed(1) + '%',
    dimensions: result.width + 'x' + result.height,
    format: result.format,
  });

  return result.file;
}

async function prepareForPrint(file: File) {
  const result = await compress(file, {
    preset: 'print',
    onProgress: (progress) => {
      console.log(`Progress: ${(progress * 100).toFixed(0)}%`);
    },
  });

  return result.file;
}

async function prepareForAllPlatforms(file: File) {
  const presets: Array<'social-media' | 'web' | 'print' | 'thumbnail' | 'email'> = [
    'social-media',
    'web',
    'print',
    'thumbnail',
    'email',
  ];

  const results: Record<string, File> = {};

  for (const preset of presets) {
    try {
      const result = await compress(file, {
        preset,
      });
      results[preset] = result.file;
      console.log(`${preset} completed: ${result.compressedSize} bytes`);
    } catch (error) {
      console.error(`${preset} failed:`, error);
    }
  }

  return results;
}
```

