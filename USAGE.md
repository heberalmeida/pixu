# Pixu Usage Guide

Complete usage examples and best practices for the Pixu image compression library.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Advanced Features](#advanced-features)
- [Web Workers](#web-workers)
- [Batch Processing](#batch-processing)
- [Streaming API](#streaming-api)
- [Plugin System](#plugin-system)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)

---

## Basic Usage

### Simple Compression

```typescript
import { compress } from 'pixu';

const fileInput = document.querySelector('input[type="file"]');

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const result = await compress(file, {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
  });

  console.log('Compression complete:', result);
});
```

### With Error Handling

```typescript
import { compress } from 'pixu';

try {
  const result = await compress(file, {
    quality: 0.8,
  });
  
  // Use result.file
} catch (error) {
  if (error instanceof Error) {
    console.error('Compression failed:', error.message);
  }
}
```

### With Progress Tracking

```typescript
import { compress } from 'pixu';

const result = await compress(file, {
  quality: 0.8,
  onProgress: (progress) => {
    console.log(`Progress: ${Math.round(progress * 100)}%`);
    updateProgressBar(progress);
  },
});
```

---

## Advanced Features

### Adaptive Smart Compression

```typescript
import { compress } from 'pixu';

// Let Pixu automatically choose optimal settings
const result = await compress(file, {
  mode: 'adaptive',
  strategy: 'smart',
});
```

### Size-Based Compression

```typescript
import { compress } from 'pixu';

// Compress to target file size
const result = await compress(file, {
  mode: 'size',
  targetSize: 500 * 1024, // 500KB
  enableDualPass: true,
});
```

### Format Conversion

```typescript
import { compress } from 'pixu';

// Convert PNG to WebP
const result = await compress(pngFile, {
  format: 'image/webp',
  quality: 0.85,
});

// Convert to AVIF (if supported)
const avifResult = await compress(jpegFile, {
  format: 'image/avif',
  quality: 0.8,
});
```

### Resize Modes

```typescript
import { compress } from 'pixu';

// Contain - fit within dimensions, maintain aspect ratio
const contain = await compress(file, {
  width: 1920,
  height: 1080,
  resize: 'contain',
});

// Cover - fill dimensions, maintain aspect ratio
const cover = await compress(file, {
  width: 1920,
  height: 1080,
  resize: 'cover',
});

// Fit - similar to contain
const fit = await compress(file, {
  width: 1920,
  height: 1080,
  resize: 'fit',
});

// Fill - stretch to exact dimensions
const fill = await compress(file, {
  width: 1920,
  height: 1080,
  resize: 'fill',
});
```

### Metadata Management

```typescript
import { compress } from 'pixu';

// Strip all metadata
const stripped = await compress(file, {
  stripMetadata: true,
});

// Fix orientation automatically
const fixed = await compress(file, {
  fixOrientation: true,
});

// Both
const clean = await compress(file, {
  stripMetadata: true,
  fixOrientation: true,
});
```

### Advanced Optimization Features

```typescript
import { compress } from 'pixu';

const result = await compress(file, {
  quality: 0.8,
  
  // Enable dual-pass optimization
  enableDualPass: true,
  
  // Noise-aware encoding
  enableNoiseAware: true,
  
  // Color channel weighting
  enableColorWeighting: true,
  
  // HDR to SDR conversion
  enableHdrToSdr: true,
});
```

### Custom Canvas Processing

```typescript
import { compress } from 'pixu';

const result = await compress(file, {
  quality: 0.8,
  
  // Before compression
  beforeProcess: (ctx, canvas) => {
    // Apply filters
    ctx.filter = 'grayscale(50%)';
  },
  
  // After compression
  afterProcess: (ctx, canvas) => {
    // Add watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '24px Arial';
    ctx.fillText('Watermark', 20, canvas.height - 20);
  },
});
```

---

## Web Workers

### Basic Worker Usage

```typescript
import { WorkerCompressor } from 'pixu/worker';

const worker = new WorkerCompressor('/path/to/pixu.worker.esm.js');

const result = await worker.compress(file, {
  quality: 0.8,
  maxWidth: 1920,
});

// Clean up
worker.terminate();
```

### Worker with Error Handling

```typescript
import { WorkerCompressor } from 'pixu/worker';

const worker = new WorkerCompressor();

try {
  const result = await worker.compress(file, {
    quality: 0.8,
  });
} catch (error) {
  console.error('Worker compression failed:', error);
} finally {
  worker.terminate();
}
```

### Multiple Worker Instances

```typescript
import { WorkerCompressor } from 'pixu/worker';

const workers = Array.from({ length: 3 }, () => new WorkerCompressor());

// Use workers in parallel
const results = await Promise.all(
  files.map((file, index) => 
    workers[index % workers.length].compress(file, { quality: 0.8 })
  )
);

// Clean up
workers.forEach(worker => worker.terminate());
```

---

## Batch Processing

### Basic Batch Compression

```typescript
import { compressBatch } from 'pixu';

const files = Array.from(fileInput.files);

const results = await compressBatch(files, {
  quality: 0.8,
  maxWidth: 1920,
});
```

### Batch with Concurrency Control

```typescript
import { compressBatch } from 'pixu';

const results = await compressBatch(files, {
  quality: 0.8,
  concurrency: 3, // Process 3 images at a time
});
```

### Batch with Progress Tracking

```typescript
import { compressBatch } from 'pixu';

const results = await compressBatch(files, {
  quality: 0.8,
  concurrency: 3,
  onItemComplete: (result, index) => {
    console.log(`Image ${index + 1} complete:`, result.file.name);
    updateProgress(index + 1, files.length);
  },
  onItemError: (error, index) => {
    console.error(`Image ${index + 1} failed:`, error);
  },
});
```

### Batch with Different Options per Image

```typescript
import { compressBatch, PixuCompressor } from 'pixu';

const compressor = new PixuCompressor();

const results = await Promise.all(
  files.map((file, index) => 
    compressor.compress(file, {
      quality: 0.7 + (index * 0.05), // Varying quality
      maxWidth: 1920 - (index * 100), // Varying width
    })
  )
);
```

---

## Streaming API

### Basic Streaming

```typescript
import { compressStream } from 'pixu';

async function processImages(files: File[]) {
  for await (const result of compressStream(files, {
    quality: 0.8,
  })) {
    console.log('Compressed:', result.file.name);
    await uploadToServer(result.file);
  }
}
```

### Streaming with Chunk Processing

```typescript
import { compressStream } from 'pixu';

for await (const result of compressStream(files, {
  quality: 0.8,
  onChunk: async (chunk, index) => {
    // Process each chunk as it arrives
    await saveChunk(chunk, index);
  },
})) {
  // Process complete result
}
```

---

## Plugin System

### Creating a Plugin

```typescript
import { PixuCompressor, type Plugin } from 'pixu';

const watermarkPlugin: Plugin = {
  name: 'watermark',
  version: '1.0.0',
  transform: async (canvas, options) => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '24px Arial';
      ctx.fillText('Watermark', 20, canvas.height - 20);
    }
  },
};

const compressor = new PixuCompressor();
compressor.registerPlugin(watermarkPlugin);
```

### Plugin with Before/After Hooks

```typescript
const advancedPlugin: Plugin = {
  name: 'advanced',
  version: '1.0.0',
  beforeCompress: async (file, options) => {
    // Pre-process file
    return file;
  },
  afterCompress: async (result, options) => {
    // Post-process result
    return result;
  },
  transform: async (canvas, options) => {
    // Transform canvas
  },
};
```

---

## Best Practices

### 1. Always Handle Errors

```typescript
try {
  const result = await compress(file, options);
} catch (error) {
  // Handle error appropriately
  console.error('Compression failed:', error);
  showErrorToUser('Failed to compress image');
}
```

### 2. Use Web Workers for Large Images

```typescript
const useWorker = file.size > 5 * 1024 * 1024; // 5MB

if (useWorker) {
  const worker = new WorkerCompressor();
  const result = await worker.compress(file, options);
  worker.terminate();
} else {
  const result = await compress(file, options);
}
```

### 3. Provide Progress Feedback

```typescript
const result = await compress(file, {
  quality: 0.8,
  onProgress: (progress) => {
    updateProgressBar(progress);
    updateStatusText(`Compressing... ${Math.round(progress * 100)}%`);
  },
});
```

### 4. Optimize for Your Use Case

```typescript
// For web uploads - prioritize size
const webResult = await compress(file, {
  mode: 'size',
  targetSize: 200 * 1024, // 200KB
  format: 'image/webp',
  enableDualPass: true,
});

// For high-quality storage - prioritize quality
const storageResult = await compress(file, {
  mode: 'quality',
  quality: 0.95,
  format: 'image/jpeg',
});
```

### 5. Batch Process Efficiently

```typescript
// Use appropriate concurrency based on device
const concurrency = navigator.hardwareConcurrency || 2;

const results = await compressBatch(files, {
  quality: 0.8,
  concurrency: Math.min(concurrency, 4), // Cap at 4
});
```

### 6. Clean Up Resources

```typescript
const worker = new WorkerCompressor();

try {
  const result = await worker.compress(file, options);
  // Use result
} finally {
  worker.terminate(); // Always clean up
}
```

---

## Common Patterns

### Image Upload with Compression

```typescript
import { compress } from 'pixu';

async function uploadImage(file: File) {
  // Compress first
  const result = await compress(file, {
    quality: 0.8,
    maxWidth: 1920,
    format: 'image/webp',
  });

  // Upload compressed file
  const formData = new FormData();
  formData.append('image', result.file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}
```

### Responsive Image Generation

```typescript
import { compress } from 'pixu';

async function generateResponsiveImages(file: File) {
  const sizes = [
    { width: 1920, suffix: 'large' },
    { width: 1280, suffix: 'medium' },
    { width: 640, suffix: 'small' },
  ];

  const results = await Promise.all(
    sizes.map(({ width, suffix }) =>
      compress(file, {
        width,
        resize: 'contain',
        format: 'image/webp',
        quality: 0.85,
      }).then(result => ({
        ...result,
        suffix,
      }))
    )
  );

  return results;
}
```

### Format Detection and Conversion

```typescript
import { compress } from 'pixu';

async function optimizeImage(file: File) {
  // Detect if browser supports modern formats
  const supportsWebP = await checkWebPSupport();
  const supportsAVIF = await checkAVIFSupport();

  let format = 'image/jpeg';
  if (supportsAVIF) {
    format = 'image/avif';
  } else if (supportsWebP) {
    format = 'image/webp';
  }

  return compress(file, {
    format,
    quality: 0.85,
    maxWidth: 1920,
  });
}

function checkWebPSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}
```

---

## React Example

```tsx
import { useState } from 'react';
import { compress } from 'pixu';

function ImageUploader() {
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compress(file, {
        quality: 0.8,
        maxWidth: 1920,
        onProgress: setProgress,
      });
      setResult(compressed);
    } catch (error) {
      console.error('Compression failed:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {progress > 0 && progress < 1 && (
        <progress value={progress} max={1} />
      )}
      {result && (
        <img src={URL.createObjectURL(result.file)} alt="Compressed" />
      )}
    </div>
  );
}
```

---

## Vue Example

```vue
<template>
  <div>
    <input type="file" @change="handleFileChange" accept="image/*" />
    <progress v-if="progress > 0 && progress < 1" :value="progress" max="1" />
    <img v-if="result" :src="imageUrl" alt="Compressed" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { compress } from 'pixu';

const progress = ref(0);
const result = ref(null);

const imageUrl = computed(() => 
  result.value ? URL.createObjectURL(result.value.file) : null
);

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const compressed = await compress(file, {
      quality: 0.8,
      maxWidth: 1920,
      onProgress: (p) => progress.value = p,
    });
    result.value = compressed;
  } catch (error) {
    console.error('Compression failed:', error);
  }
};
</script>
```

---

For more examples, see the [documentation examples](/examples/basic).

