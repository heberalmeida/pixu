# Vue Component

Use Pixu with Vue 3 for easy image compression in your Vue applications.

## Live Demo

<VueDemo :options="{ format: 'image/pixu', enableSmartQuality: true, quality: 0.8, maxWidth: 1920, maxHeight: 1080 }" />

## Installation

```bash
npm install @pantanal/pixu
```

## Basic Usage

Import and use the `PixuCompressor` component:

```vue
<template>
  <PixuCompressor
    :options="compressionOptions"
    @compress="handleCompress"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PixuCompressor from 'pixu/components/vue/PixuCompressor.vue';
import type { CompressionResult } from '@pantanal/pixu';

const compressionOptions = ref({
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
});

const handleCompress = (result: CompressionResult) => {
  console.log('Compressed:', result);
};

const handleError = (error: Error) => {
  console.error('Error:', error);
};
</script>
```

## Props

### options

Type: `CompressionOptions`

Compression options. See [CompressionOptions](/api/types#compressionoptions).

### autoCompress

Type: `boolean`

Default: `true`

Automatically compress when a file is selected.

### samples

Type: `SampleImageOption[]`

Optional list of bundled photos shown inside the upload area:

```typescript
interface SampleImageOption {
  id: string;
  label: string;
  url: string;   // e.g. '/photo-landscape.jpg'
  file: string;  // e.g. 'photo-landscape.jpg'
}
```

```vue
<PixuCompressor
  :samples="sampleImages"
  :options="{ format: 'image/pixu' }"
/>
```

Click a thumbnail to compress without manual file selection. See [Framework Examples](/examples/) for the full sample set.

## Events

### compress

Emitted when compression completes successfully.

```typescript
@compress="(result: CompressionResult) => void"
```

### error

Emitted when compression fails.

```typescript
@error="(error: Error) => void"
```

### progress

Emitted during compression to report progress.

```typescript
@progress="(progress: number) => void"
```

## Advanced Example

```vue
<template>
  <div>
    <PixuCompressor
      :options="options"
      :auto-compress="true"
      @compress="onCompress"
      @error="onError"
      @progress="onProgress"
    />
    
    <div v-if="result">
      <p>Compression ratio: {{ (result.compressionRatio * 100).toFixed(1) }}%</p>
      <button @click="download">Download</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PixuCompressor from 'pixu/components/vue/PixuCompressor.vue';
import type { CompressionResult } from '@pantanal/pixu';

const options = ref({
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
  format: 'auto',
  stripMetadata: true,
  enableSmartQuality: true,
});

const result = ref<CompressionResult | null>(null);

const onCompress = (compressionResult: CompressionResult) => {
  result.value = compressionResult;
};

const onError = (error: Error) => {
  console.error('Compression failed:', error);
};

const onProgress = (progress: number) => {
  console.log('Progress:', progress);
};

const download = () => {
  if (!result.value) return;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(result.value.file);
  link.download = 'compressed.jpg';
  link.click();
};
</script>
```

## Customization

The component uses CSS variables for theming. You can override them:

```css
.pixu-compressor {
  --vp-c-brand: #3b82f6;
  --vp-c-divider: #e5e7eb;
  --vp-c-text-1: #111827;
  --vp-c-text-2: #6b7280;
  --vp-c-bg: #ffffff;
  --vp-c-bg-soft: #f9fafb;
}
```

## Features

- Drag and drop support
- Built-in sample image gallery (`samples` prop)
- PIX format support
- Progress tracking
- Error handling
- Download compressed image
- Responsive design
- TypeScript support

## Full Example Project

```bash
npm run build && cd examples/vue && npm install && npm run dev
```

[Vue examples documentation →](/examples/vue)

