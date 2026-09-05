# Format Conversion

Automatically convert images to more efficient formats.

## PNG to JPEG

Convert PNG to JPEG when beneficial:

<CompressionDemo :options="{ quality: 0.8, convertToJPEG: true }" />

<VueDemo :options="{ quality: 0.8, convertToJPEG: true }" />

```typescript
const result = await compress(pngFile, {
  quality: 0.8,
  convertToJPEG: true,
});
```

## Automatic Detection

Pixu automatically converts PNG to JPEG when:

- File size is larger than 500KB
- Image has no transparency
- JPEG would be more efficient

## Manual Format Selection

<CompressionDemo :options="{ quality: 0.8, format: 'image/webp' }" />

<VueDemo :options="{ quality: 0.8, format: 'image/webp' }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  format: 'image/webp',
});
```

## Format Options

Available formats:
- `image/jpeg`
- `image/png`
- `image/webp`
- `image/avif`
- `auto` - Automatically select best format

## Example

```typescript
import { compress } from 'pixu';

async function optimizeFormat(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    convertToJPEG: true,
  });

  return result.file;
}

async function convertToWebP(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    format: 'image/webp',
  });

  return result.file;
}
```

