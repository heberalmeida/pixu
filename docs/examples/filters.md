# Filter Examples

Examples using image filters.

## Single Filter

<CompressionDemo :options="{ quality: 0.8, filters: ['grayscale'] }" />

```typescript
import { compress } from 'pixu';

async function applyGrayscale(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    filters: ['grayscale'],
  });

  console.log('Applied grayscale filter');
  return result.file;
}
```

<CompressionDemo :options="{ quality: 0.8, filters: ['sepia'] }" />

async function applySepia(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    filters: ['sepia'],
  });

  console.log('Applied sepia filter');
  return result.file;
}

<CompressionDemo :options="{ quality: 0.8, filters: ['vintage'] }" />

async function applyVintage(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    filters: ['vintage'],
  });

  console.log('Applied vintage filter');
  return result.file;
}

## Multiple Filters

```typescript
import { compress } from 'pixu';

async function applyMultipleFilters(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    filters: [
      'sepia',
      { type: 'brightness', value: 1.1 },
      { type: 'contrast', value: 1.2 },
      { type: 'saturation', value: 0.9 },
    ],
  });

  console.log('Applied multiple filters');
  return result.file;
}
```

## Brightness Adjustment

```typescript
import { compress } from 'pixu';

async function adjustBrightness(file: File, brightness: number) {
  const result = await compress(file, {
    quality: 0.8,
    filters: [
      { type: 'brightness', value: brightness },
    ],
  });

  console.log(`Brightness adjusted to ${brightness}`);
  return result.file;
}

async function brightenImage(file: File) {
  return adjustBrightness(file, 1.2);
}

async function darkenImage(file: File) {
  return adjustBrightness(file, 0.8);
}
```

## Contrast Adjustment

```typescript
import { compress } from 'pixu';

async function adjustContrast(file: File, contrast: number) {
  const result = await compress(file, {
    quality: 0.8,
    filters: [
      { type: 'contrast', value: contrast },
    ],
  });

  console.log(`Contrast adjusted to ${contrast}`);
  return result.file;
}

async function increaseContrast(file: File) {
  return adjustContrast(file, 1.3);
}

async function decreaseContrast(file: File) {
  return adjustContrast(file, 0.7);
}
```

## Saturation Adjustment

```typescript
import { compress } from 'pixu';

async function adjustSaturation(file: File, saturation: number) {
  const result = await compress(file, {
    quality: 0.8,
    filters: [
      { type: 'saturation', value: saturation },
    ],
  });

  console.log(`Saturation adjusted to ${saturation}`);
  return result.file;
}

async function desaturate(file: File) {
  return adjustSaturation(file, 0.5);
}

async function oversaturate(file: File) {
  return adjustSaturation(file, 1.5);
}
```

## Blur Effect

```typescript
import { compress } from 'pixu';

async function applyBlur(file: File, blurAmount: number) {
  const result = await compress(file, {
    quality: 0.8,
    filters: [
      { type: 'blur', value: blurAmount },
    ],
  });

  console.log(`Blur applied: ${blurAmount}px`);
  return result.file;
}

async function lightBlur(file: File) {
  return applyBlur(file, 1);
}

async function heavyBlur(file: File) {
  return applyBlur(file, 5);
}
```

## Sharpen

```typescript
import { compress } from 'pixu';

async function applySharpen(file: File, sharpenAmount: number) {
  const result = await compress(file, {
    quality: 0.8,
    filters: [
      { type: 'sharpen', value: sharpenAmount },
    ],
  });

  console.log(`Sharpen applied: ${sharpenAmount}`);
  return result.file;
}

async function lightSharpen(file: File) {
  return applySharpen(file, 1);
}

async function heavySharpen(file: File) {
  return applySharpen(file, 3);
}
```

## Complete Filter Examples

```typescript
import { compress } from 'pixu';

async function applyVintageEffect(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    maxWidth: 1920,
    filters: [
      'vintage',
      { type: 'brightness', value: 0.9 },
      { type: 'contrast', value: 1.1 },
      { type: 'saturation', value: 0.8 },
    ],
  });

  console.log('Vintage effect applied');
  return result.file;
}

async function createThumbnail(file: File) {
  const result = await compress(file, {
    quality: 0.7,
    maxWidth: 320,
    filters: ['grayscale'],
  });

  console.log('Thumbnail created with grayscale');
  return result.file;
}

async function enhancePhoto(file: File) {
  const result = await compress(file, {
    quality: 0.85,
    filters: [
      { type: 'brightness', value: 1.05 },
      { type: 'contrast', value: 1.1 },
      { type: 'saturation', value: 1.15 },
      { type: 'sharpen', value: 1.2 },
    ],
  });

  console.log('Photo enhanced');
  return result.file;
}

async function createArtisticEffect(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    filters: [
      'sepia',
      { type: 'brightness', value: 1.1 },
      { type: 'contrast', value: 1.2 },
      { type: 'saturation', value: 0.7 },
    ],
  });

  console.log('Artistic effect applied');
  return result.file;
}

async function applyAllFilters(file: File) {
  const filters = [
    { name: 'grayscale', filter: ['grayscale'] },
    { name: 'sepia', filter: ['sepia'] },
    { name: 'vintage', filter: ['vintage'] },
    { name: 'bright', filter: [{ type: 'brightness', value: 1.2 }] },
    { name: 'contrast', filter: [{ type: 'contrast', value: 1.2 }] },
    { name: 'saturated', filter: [{ type: 'saturation', value: 1.3 }] },
    { name: 'blurred', filter: [{ type: 'blur', value: 2 }] },
    { name: 'sharpened', filter: [{ type: 'sharpen', value: 1.5 }] },
  ];

  const results: Record<string, File> = {};

  for (const { name, filter } of filters) {
    try {
      const result = await compress(file, {
        quality: 0.8,
        filters: filter,
      });
      results[name] = result.file;
      console.log(`Applied ${name} filter`);
    } catch (error) {
      console.error(`Failed to apply ${name} filter:`, error);
    }
  }

  return results;
}
```

