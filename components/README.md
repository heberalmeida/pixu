# Pixu Framework Components

Ready-to-use components for popular JavaScript frameworks.

## Available Components

- **Vue 3** - `components/vue/PixuCompressor.vue`
- **React** - `components/react/PixuCompressor.tsx`
- **Angular** - `components/angular/pixu-compressor.component.ts`
- **Svelte** - `components/svelte/PixuCompressor.svelte`

## Usage

### Vue

```vue
<template>
  <PixuCompressor
    :options="{ quality: 0.8 }"
    @compress="handleCompress"
  />
</template>

<script setup>
import PixuCompressor from 'pixu/components/vue/PixuCompressor.vue';
</script>
```

### React

```tsx
import PixuCompressor from 'pixu/components/react/PixuCompressor';
import 'pixu/components/react/PixuCompressor.css';

<PixuCompressor
  options={{ quality: 0.8 }}
  onCompress={handleCompress}
/>
```

### Angular

```typescript
import { PixuCompressorComponent } from 'pixu/components/angular/pixu-compressor.component';

<pixu-compressor
  [options]="{ quality: 0.8 }"
  (compress)="handleCompress($event)"
></pixu-compressor>
```

### Svelte

```svelte
<script>
  import PixuCompressor from 'pixu/components/svelte/PixuCompressor.svelte';
</script>

<PixuCompressor
  options={{ quality: 0.8 }}
  on:compress={handleCompress}
/>
```

## Documentation

See the [Components Guide](/guide/components/vue) for complete documentation and examples.

