# Svelte Examples

Same documentation layout as this site. Live demo below; full app in `examples/svelte/`.

## Live demo

<SvelteDemo :options="{ format: 'image/pixu', enableSmartQuality: true, quality: 0.85 }" />

## Complete project

```bash
npm run build
cd examples/svelte && npm install && npm run dev
```

`http://localhost:3002`

[All framework examples →](/examples/)

## Basic Svelte Component

```svelte
<script>
  import PixuCompressor from 'pixu/components/svelte/PixuCompressor.svelte';

  function handleCompress(result) {
    console.log('Compressed:', result.detail);
  }
</script>

<PixuCompressor
  samples={sampleImages}
  options={{ quality: 0.85, format: 'image/pixu' }}
  on:compress={handleCompress}
/>
```

## With Options

```svelte
<script>
  import PixuCompressor from 'pixu/components/svelte/PixuCompressor.svelte';
  import type { CompressionResult } from '@pantanal/pixu';

  const options = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'auto',
    stripMetadata: true,
  };

  function handleCompress(event) {
    const result = event.detail;
    console.log('Compression completed:', result);
  }

  function handleError(event) {
    const error = event.detail;
    console.error('Error:', error);
  }

  function handleProgress(event) {
    const progress = event.detail;
    console.log('Progress:', progress);
  }
</script>

<PixuCompressor
  {options}
  on:compress={handleCompress}
  on:error={handleError}
  on:progress={handleProgress}
/>
```

## Complete Example

```svelte
<script>
  import PixuCompressor from 'pixu/components/svelte/PixuCompressor.svelte';
  import type { CompressionResult } from '@pantanal/pixu';

  let result = null;
  let progress = 0;

  const options = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'auto',
    stripMetadata: true,
    enableSmartQuality: true,
  };

  function handleCompress(event) {
    result = event.detail;
  }

  function handleError(event) {
    alert(`Error: ${event.detail.message}`);
  }

  function handleProgress(event) {
    progress = event.detail;
  }

  function download() {
    if (!result) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(result.file);
    link.download = 'compressed.jpg';
    link.click();
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
</script>

<div class="container">
  <h1>Image Compressor</h1>
  
  <PixuCompressor
    {options}
    on:compress={handleCompress}
    on:error={handleError}
    on:progress={handleProgress}
  />
  
  {#if result}
    <div class="result">
      <h2>Compression Results</h2>
      <ul>
        <li>Original size: {formatBytes(result.originalSize)}</li>
        <li>Compressed size: {formatBytes(result.compressedSize)}</li>
        <li>Ratio: {(result.compressionRatio * 100).toFixed(1)}%</li>
        <li>Format: {result.format}</li>
      </ul>
      <button on:click={download}>Download</button>
    </div>
  {/if}
</div>

<style>
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

