# Vue Examples

Same documentation layout as this site — live compressor below, full playground in `examples/vue/`.

## Live demo

<VueDemo :options="{ format: 'image/pixu', enableSmartQuality: true, quality: 0.85 }" />

## Complete project

```bash
npm run build
cd examples/vue && npm install && npm run dev
```

Open `http://localhost:3000`

### What's included

- Docs-style header, gallery, and section cards
- Real sample photos
- `import { compress, compressBatch, PIXU_EXTENSION } from 'pixu'`
- Presets, filters, smart quality, batch, watermark, and more

[All framework examples →](/examples/)

## Basic Vue Component

```vue
<template>
  <PixuCompressor
    :samples="sampleImages"
    :options="{ quality: 0.85, format: 'image/pixu' }"
    @compress="handleCompress"
  />
</template>

<script setup lang="ts">
import PixuCompressor from 'pixu/components/vue/PixuCompressor.vue';
import type { CompressionResult } from 'pixu';
import { sampleImages } from '../../shared/samples';

const handleCompress = (result: CompressionResult) => {
  console.log('Compressed:', result);
};
</script>
```

The `samples` prop shows real photo thumbnails inside the upload area — click any to compress without picking a file manually.

## With Options

```vue
<template>
  <PixuCompressor
    :options="options"
    @compress="onCompress"
    @error="onError"
    @progress="onProgress"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PixuCompressor from 'pixu/components/vue/PixuCompressor.vue';
import type { CompressionResult } from 'pixu';

const options = ref({
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
  format: 'image/pixu', // Using PIX format for best compression
  stripMetadata: true,
});

const onCompress = (result: CompressionResult) => {
  console.log('Compression completed:', result);
};

const onError = (error: Error) => {
  console.error('Error:', error);
};

const onProgress = (progress: number) => {
  console.log('Progress:', progress);
};
</script>
```

## With PIXU Format (Best Compression)

```vue
<template>
  <PixuCompressor
    :options="{ quality: 0.8, format: 'image/pixu' }"
    @compress="handleCompress"
  />
</template>

<script setup lang="ts">
import PixuCompressor from 'pixu/components/vue/PixuCompressor.vue';
import type { CompressionResult } from 'pixu';

const handleCompress = (result: CompressionResult) => {
  console.log('PIX compression completed:', result);
  console.log('Size reduction:', (result.compressionRatio * 100).toFixed(1) + '%');
};
</script>
```

## With Preset

```vue
<template>
  <PixuCompressor
    :options="{ preset: 'web' }"
    @compress="handleCompress"
  />
</template>

<script setup lang="ts">
import PixuCompressor from 'pixu/components/vue/PixuCompressor.vue';
import type { CompressionResult } from 'pixu';

const handleCompress = (result: CompressionResult) => {
  console.log('Web preset result:', result);
};
</script>
```

## With Filters

```vue
<template>
  <PixuCompressor
    :options="{
      quality: 0.8,
      filters: ['grayscale']
    }"
    @compress="handleCompress"
  />
</template>

<script setup lang="ts">
import PixuCompressor from 'pixu/components/vue/PixuCompressor.vue';
import type { CompressionResult } from 'pixu';

const handleCompress = (result: CompressionResult) => {
  console.log('Filtered result:', result);
};
</script>
```

## Complete Example

```vue
<template>
  <div class="container">
    <h1>Image Compressor</h1>
    
    <PixuCompressor
      :options="compressionOptions"
      @compress="handleCompress"
      @error="handleError"
      @progress="handleProgress"
    />
    
    <div v-if="result" class="result">
      <h2>Compression Results</h2>
      <ul>
        <li>Original size: {{ formatBytes(result.originalSize) }}</li>
        <li>Compressed size: {{ formatBytes(result.compressedSize) }}</li>
        <li>Ratio: {{ (result.compressionRatio * 100).toFixed(1) }}%</li>
        <li>Format: {{ result.format }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PixuCompressor from 'pixu/components/vue/PixuCompressor.vue';
import type { CompressionResult } from 'pixu';

const compressionOptions = ref({
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
  format: 'auto' as const,
  stripMetadata: true,
  enableSmartQuality: true,
});

const result = ref<CompressionResult | null>(null);

const handleCompress = (compressionResult: CompressionResult) => {
  result.value = compressionResult;
};

const handleError = (error: Error) => {
  alert(`Error: ${error.message}`);
};

const handleProgress = (progress: number) => {
  console.log('Progress:', progress);
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.result {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
}

.result ul {
  list-style: none;
  padding: 0;
}

.result li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}
</style>
```

