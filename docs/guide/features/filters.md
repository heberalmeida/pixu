# Image Filters

Pixu provides native image filters without external dependencies.

## Available Filters

### Grayscale

Convert image to grayscale.

<CompressionDemo :options="{ quality: 0.8, filters: ['grayscale'] }" />

<VueDemo :options="{ quality: 0.8, filters: ['grayscale'] }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: ['grayscale'],
});
```

### Sepia

Apply sepia tone effect.

<CompressionDemo :options="{ quality: 0.8, filters: ['sepia'] }" />

<VueDemo :options="{ quality: 0.8, filters: ['sepia'] }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: ['sepia'],
});
```

### Vintage

Apply vintage film effect.

<CompressionDemo :options="{ quality: 0.8, filters: ['vintage'] }" />

<VueDemo :options="{ quality: 0.8, filters: ['vintage'] }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: ['vintage'],
});
```

### Brightness

Adjust image brightness.

<CompressionDemo :options="{ quality: 0.8, filters: [{ type: 'brightness', value: 1.2 }] }" />

<VueDemo :options="{ quality: 0.8, filters: [{ type: 'brightness', value: 1.2 }] }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: [
    { type: 'brightness', value: 1.2 }
  ],
});
```

Value range: 0-2 (1.0 is normal, >1.0 is brighter, <1.0 is darker)

### Contrast

Adjust image contrast.

<CompressionDemo :options="{ quality: 0.8, filters: [{ type: 'contrast', value: 1.1 }] }" />

<VueDemo :options="{ quality: 0.8, filters: [{ type: 'contrast', value: 1.1 }] }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: [
    { type: 'contrast', value: 1.1 }
  ],
});
```

Value range: 0-2 (1.0 is normal, >1.0 is more contrast, <1.0 is less contrast)

### Saturation

Adjust color saturation.

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: [
    { type: 'saturation', value: 1.2 }
  ],
});
```

Value range: 0-2 (1.0 is normal, >1.0 is more saturated, <1.0 is less saturated)

### Blur

Apply blur effect.

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: [
    { type: 'blur', value: 2 }
  ],
});
```

Value range: 0-10 (pixels)

### Sharpen

Apply sharpening effect.

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: [
    { type: 'sharpen', value: 1.5 }
  ],
});
```

Value range: 0-10

## Multiple Filters

Apply multiple filters in sequence:

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: [
    'grayscale',
    { type: 'brightness', value: 1.1 },
    { type: 'contrast', value: 1.2 },
  ],
});
```

## Complete Examples

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
    onProgress: (progress) => {
      console.log(`Vintage effect progress: ${(progress * 100).toFixed(0)}%`);
    },
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

  console.log('Thumbnail created');
  return result.file;
}

async function applyAllFilters(file: File) {
  const filterConfigs = [
    { name: 'grayscale', filters: ['grayscale'] },
    { name: 'sepia', filters: ['sepia'] },
    { name: 'vintage', filters: ['vintage'] },
    { name: 'bright', filters: [{ type: 'brightness', value: 1.2 }] },
    { name: 'dark', filters: [{ type: 'brightness', value: 0.8 }] },
    { name: 'high-contrast', filters: [{ type: 'contrast', value: 1.3 }] },
    { name: 'saturated', filters: [{ type: 'saturation', value: 1.5 }] },
    { name: 'blurred', filters: [{ type: 'blur', value: 3 }] },
    { name: 'sharpened', filters: [{ type: 'sharpen', value: 2 }] },
  ];

  const results: Record<string, File> = {};

  for (const config of filterConfigs) {
    try {
      const result = await compress(file, {
        quality: 0.8,
        filters: config.filters,
      });
      results[config.name] = result.file;
      console.log(`Applied ${config.name} filter`);
    } catch (error) {
      console.error(`Failed to apply ${config.name}:`, error);
    }
  }

  return results;
}
```

