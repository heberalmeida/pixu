# Preset Examples

Examples using compression presets.

## Social Media

<CompressionDemo :options="{ preset: 'social-media' }" />

```typescript
import { compress } from '@pantanal/pixu';

async function prepareForSocialMedia(file: File) {
  const result = await compress(file, {
    preset: 'social-media',
  });

  console.log('Social media preset:');
  console.log('  Max width: 1080px');
  console.log('  Quality: 85%');
  console.log('  Format: Auto (WebP if supported)');
  console.log('  Result:', result.width + 'x' + result.height);
  console.log('  Size:', result.compressedSize, 'bytes');

  return result.file;
}
```

## Print Quality

<CompressionDemo :options="{ preset: 'print' }" />

```typescript
import { compress } from '@pantanal/pixu';

async function prepareForPrint(file: File) {
  const result = await compress(file, {
    preset: 'print',
  });

  console.log('Print preset:');
  console.log('  Max width: 3000px');
  console.log('  Quality: 95%');
  console.log('  Format: JPEG');
  console.log('  Metadata: Preserved');
  console.log('  Result:', result.width + 'x' + result.height);

  return result.file;
}
```

## Web Optimization

<CompressionDemo :options="{ preset: 'web' }" />

```typescript
import { compress } from '@pantanal/pixu';

async function prepareForWeb(file: File) {
  const result = await compress(file, {
    preset: 'web',
  });

  console.log('Web preset:');
  console.log('  Max width: 1920px');
  console.log('  Quality: 80%');
  console.log('  Format: Auto (WebP if supported)');
  console.log('  Result:', result.width + 'x' + result.height);
  console.log('  Compression ratio:', (result.compressionRatio * 100).toFixed(1) + '%');

  return result.file;
}
```

## Thumbnail Generation

<CompressionDemo :options="{ preset: 'thumbnail' }" />

```typescript
import { compress } from '@pantanal/pixu';

async function createThumbnail(file: File) {
  const result = await compress(file, {
    preset: 'thumbnail',
  });

  console.log('Thumbnail preset:');
  console.log('  Max width: 320px');
  console.log('  Quality: 70%');
  console.log('  Result:', result.width + 'x' + result.height);
  console.log('  Size:', result.compressedSize, 'bytes');

  return result.file;
}
```

## Email Optimization

<CompressionDemo :options="{ preset: 'email' }" />

```typescript
import { compress } from '@pantanal/pixu';

async function prepareForEmail(file: File) {
  const result = await compress(file, {
    preset: 'email',
  });

  console.log('Email preset:');
  console.log('  Max width: 800px');
  console.log('  Quality: 75%');
  console.log('  Format: JPEG');
  console.log('  Result:', result.width + 'x' + result.height);
  console.log('  Size:', result.compressedSize, 'bytes');

  return result.file;
}
```

## Customizing Presets

```typescript
import { compress } from '@pantanal/pixu';

async function customPreset(file: File) {
  const result = await compress(file, {
    preset: 'web',
    quality: 0.9,
    maxWidth: 2560,
    maxHeight: 1440,
    format: 'image/webp',
    stripMetadata: true,
    fixOrientation: true,
    enableSmartQuality: true,
  });

  return result.file;
}
```

## Getting Preset Options

```typescript
import { getPresetOptions } from '@pantanal/pixu';

const socialMediaOptions = getPresetOptions('social-media');
console.log('Social media options:', socialMediaOptions);

const webOptions = getPresetOptions('web');
console.log('Web options:', webOptions);
```

## Complete Example with All Presets

```typescript
import { compress, getPresetOptions } from '@pantanal/pixu';

async function prepareForPlatform(file: File, platform: string) {
  let preset: 'social-media' | 'web' | 'print' | 'thumbnail' | 'email';
  
  switch (platform.toLowerCase()) {
    case 'instagram':
    case 'facebook':
    case 'twitter':
    case 'social':
      preset = 'social-media';
      break;
    case 'website':
    case 'web':
    case 'blog':
      preset = 'web';
      break;
    case 'print':
    case 'printing':
      preset = 'print';
      break;
    case 'thumbnail':
    case 'thumb':
    case 'preview':
      preset = 'thumbnail';
      break;
    case 'email':
    case 'mail':
      preset = 'email';
      break;
    default:
      preset = 'web';
  }

  const presetOptions = getPresetOptions(preset);
  console.log(`Using ${preset} preset:`, presetOptions);
  
  const result = await compress(file, {
    preset,
    onProgress: (progress) => {
      console.log(`${platform} compression: ${(progress * 100).toFixed(0)}%`);
    },
  });

  console.log(`Prepared for ${platform}:`);
  console.log('  Original:', result.originalSize, 'bytes');
  console.log('  Compressed:', result.compressedSize, 'bytes');
  console.log('  Ratio:', (result.compressionRatio * 100).toFixed(1) + '%');
  console.log('  Dimensions:', result.width + 'x' + result.height);
  console.log('  Format:', result.format);
  
  return result.file;
}

async function processForAllPlatforms(file: File) {
  const platforms = ['social-media', 'web', 'print', 'thumbnail', 'email'];
  const results: Record<string, File> = {};

  for (const platform of platforms) {
    try {
      const result = await prepareForPlatform(file, platform);
      results[platform] = result;
    } catch (error) {
      console.error(`Failed to process for ${platform}:`, error);
    }
  }

  return results;
}
```

