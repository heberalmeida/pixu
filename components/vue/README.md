# Pixu Vue Component

Vue 3 component for Pixu image compression.

## Installation

```bash
npm install pixu
```

## Usage

```vue
<template>
  <PixuCompressor
    :options="{ quality: 0.8 }"
    @compress="handleCompress"
  />
</template>

<script setup lang="ts">
import PixuCompressor from 'pixu/components/vue/PixuCompressor.vue';
import type { CompressionResult } from 'pixu';

const handleCompress = (result: CompressionResult) => {
  console.log('Compressed:', result);
};
</script>
```

## Documentation

See [Vue Component Guide](/guide/components/vue) for complete documentation.

