# Componente Vue

Use o Pixu com Vue 3 para comprimir imagens com facilidade em suas aplicações Vue.

## Demo ao Vivo

<VueDemo :options="{ format: 'image/pixu', enableSmartQuality: true, quality: 0.8, maxWidth: 1920, maxHeight: 1080 }" />

## Instalação

```bash
npm install @pantanal/pixu
```

## Uso Básico

Importe e use o componente `PixuCompressor`:

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

Tipo: `CompressionOptions`

Opções de compressão. Veja [CompressionOptions](/pt-BR/api/types#compressionoptions).

### autoCompress

Tipo: `boolean`

Padrão: `true`

Comprime automaticamente quando um arquivo é selecionado.

### samples

Tipo: `SampleImageOption[]`

Lista opcional de fotos inclusas exibidas na área de upload:

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

Clique em uma miniatura para comprimir sem seleção manual de arquivo. Veja [Exemplos de Frameworks](/pt-BR/examples/) para o conjunto completo de amostras.

## Eventos

### compress

Emitido quando a compressão é concluída com sucesso.

```typescript
@compress="(result: CompressionResult) => void"
```

### error

Emitido quando a compressão falha.

```typescript
@error="(error: Error) => void"
```

### progress

Emitido durante a compressão para reportar o progresso.

```typescript
@progress="(progress: number) => void"
```

## Exemplo Avançado

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

## Personalização

O componente usa variáveis CSS para temas. Você pode sobrescrevê-las:

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

## Recursos

- Suporte a arrastar e soltar
- Galeria de imagens de amostra integrada (prop `samples`)
- Suporte ao formato PIX
- Acompanhamento de progresso
- Tratamento de erros
- Download da imagem comprimida
- Design responsivo
- Suporte a TypeScript

## Projeto de Exemplo Completo

```bash
npm run build && cd examples/vue && npm install && npm run dev
```

[Documentação dos exemplos Vue →](/pt-BR/examples/vue)
