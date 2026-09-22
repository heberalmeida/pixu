# Exemplos Vue

Mesmo layout de documentação deste site — compressor ao vivo abaixo, playground completo em `examples/vue/`.

## Demo ao vivo

<VueDemo :options="{ format: 'image/pixu', enableSmartQuality: true, quality: 0.85 }" />

## Projeto completo

```bash
npm run build
cd examples/vue && npm install && npm run dev
```

Abra `http://localhost:3000`

### O que está incluso

- Cabeçalho no estilo da docs, galeria e cards de seção
- Fotos de amostra reais
- `import { compress, compressBatch, buildDownloadName } from '@pantanal/pixu'`
- Presets, filtros, smart quality, lote, watermark e mais

[Todos os exemplos por framework →](/pt-BR/examples/)

## Componente Vue básico

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
import type { CompressionResult } from '@pantanal/pixu';
import { sampleImages } from '../../shared/samples';

const handleCompress = (result: CompressionResult) => {
  console.log('Compressed:', result);
};
</script>
```

A prop `samples` mostra miniaturas de fotos reais na área de upload — clique em qualquer uma para comprimir sem escolher um arquivo manualmente.

## Com opções

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
import type { CompressionResult } from '@pantanal/pixu';

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

## Com formato PIXU (melhor compressão)

```vue
<template>
  <PixuCompressor
    :options="{ quality: 0.8, format: 'image/pixu' }"
    @compress="handleCompress"
  />
</template>

<script setup lang="ts">
import PixuCompressor from 'pixu/components/vue/PixuCompressor.vue';
import type { CompressionResult } from '@pantanal/pixu';

const handleCompress = (result: CompressionResult) => {
  console.log('PIX compression completed:', result);
  console.log('Size reduction:', (result.compressionRatio * 100).toFixed(1) + '%');
};
</script>
```

## Com preset

```vue
<template>
  <PixuCompressor
    :options="{ preset: 'web' }"
    @compress="handleCompress"
  />
</template>

<script setup lang="ts">
import PixuCompressor from 'pixu/components/vue/PixuCompressor.vue';
import type { CompressionResult } from '@pantanal/pixu';

const handleCompress = (result: CompressionResult) => {
  console.log('Web preset result:', result);
};
</script>
```

## Com filtros

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
import type { CompressionResult } from '@pantanal/pixu';

const handleCompress = (result: CompressionResult) => {
  console.log('Filtered result:', result);
};
</script>
```

## Exemplo completo

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
import type { CompressionResult } from '@pantanal/pixu';

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
