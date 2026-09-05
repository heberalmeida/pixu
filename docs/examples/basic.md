# Basic Examples

Simple examples to get started with Pixu.

## Basic Compression

<CompressionDemo :options="{ quality: 0.8 }" />

```typescript
import { compress } from 'pixu';

const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

fileInput.addEventListener('change', async (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    const result = await compress(file, {
      quality: 0.8,
    });

    console.log('Original size:', result.originalSize);
    console.log('Compressed size:', result.compressedSize);
    console.log('Compression ratio:', (result.compressionRatio * 100).toFixed(1) + '%');
    console.log('Format:', result.format);
    console.log('Dimensions:', result.width + 'x' + result.height);
  } catch (error) {
    console.error('Compression failed:', error);
  }
});
```

## With Resize

<CompressionDemo :options="{ quality: 0.8, maxWidth: 1920, maxHeight: 1080, resize: 'contain' }" />

```typescript
import { compress } from 'pixu';

async function compressWithResize(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    resize: 'contain',
  });

  console.log('Resized to:', result.width + 'x' + result.height);
  return result.file;
}
```

## Format Selection

### Using PIXU Format (Best Compression)

<CompressionDemo :options="{ quality: 0.8, format: 'image/pixu' }" />

```typescript
import { compress } from 'pixu';

async function convertToPIX(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    format: 'image/pixu', // Revolutionary format, 30-60% better than JPEG
  });

  console.log('Converted to:', result.format);
  console.log('Size reduction:', (result.compressionRatio * 100).toFixed(1) + '%');
  return result.file;
}
```

### Using WebP Format

<CompressionDemo :options="{ quality: 0.8, format: 'image/webp' }" />

```typescript
import { compress } from 'pixu';

async function convertToWebP(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    format: 'image/webp',
  });

  console.log('Converted to:', result.format);
  return result.file;
}
```

### Auto Format Selection (Prefers PIX)

<CompressionDemo :options="{ quality: 0.8, format: 'auto' }" />

```typescript
async function autoFormat(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    format: 'auto', // Automatically selects PIX for best compression
  });

  console.log('Selected format:', result.format);
  return result.file;
}
```

## Compression Modes

```typescript
import { compress } from 'pixu';

async function qualityMode(file: File) {
  const result = await compress(file, {
    mode: 'quality',
    quality: 0.8,
  });
  return result;
}

async function sizeMode(file: File) {
  const result = await compress(file, {
    mode: 'size',
    targetSize: 500 * 1024,
  });
  return result;
}

async function adaptiveMode(file: File) {
  const result = await compress(file, {
    mode: 'adaptive',
  });
  return result;
}
```

## Progress Tracking

```typescript
import { compress } from 'pixu';

async function compressWithProgress(file: File) {
  const progressBar = document.getElementById('progress') as HTMLProgressElement;
  
  const result = await compress(file, {
    quality: 0.8,
    onProgress: (progress) => {
      const percentage = progress * 100;
      console.log(`Progress: ${percentage.toFixed(0)}%`);
      if (progressBar) {
        progressBar.value = percentage;
      }
    },
  });

  return result;
}
```

## Error Handling

```typescript
import { compress } from 'pixu';

async function safeCompress(file: File) {
  try {
    const result = await compress(file, {
      quality: 0.8,
    });
    return { success: true, result };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Compression failed:', error.message);
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown error' };
  }
}
```

## Complete Example with All Options

```typescript
import { compress } from 'pixu';

async function compressImage(file: File) {
  try {
    const result = await compress(file, {
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
      minWidth: 320,
      minHeight: 240,
      width: undefined,
      height: undefined,
      resize: 'contain',
      format: 'image/webp',
      stripMetadata: true,
      fixOrientation: true,
      mode: 'quality',
      targetSize: undefined,
      strategy: 'balanced',
      enableDualPass: false,
      enableProgressive: false,
      enableNoiseAware: false,
      enableHdrToSdr: false,
      enableColorWeighting: false,
      strict: true,
      onProgress: (progress) => {
        console.log(`Progress: ${(progress * 100).toFixed(0)}%`);
      },
    });

    console.log(`Original: ${result.originalSize} bytes`);
    console.log(`Compressed: ${result.compressedSize} bytes`);
    console.log(`Ratio: ${(result.compressionRatio * 100).toFixed(1)}%`);
    console.log(`Format: ${result.format}`);
    console.log(`Dimensions: ${result.width}x${result.height}`);

    return result.file;
  } catch (error) {
    console.error('Compression failed:', error);
    throw error;
  }
}
```

