# Svelte Component

Use Pixu with Svelte for easy image compression in your Svelte applications.

## Live Demo

<SvelteDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

## Installation

```bash
npm install pixu
```

## Basic Usage

Import and use the `PixuCompressor` component:

```svelte
<script>
  import PixuCompressor from 'pixu/components/svelte/PixuCompressor.svelte';
  import type { CompressionResult } from 'pixu';

  function handleCompress(result) {
    console.log('Compressed:', result);
  }

  function handleError(error) {
    console.error('Error:', error);
  }
</script>

<PixuCompressor
  options={{ quality: 0.8 }}
  on:compress={handleCompress}
  on:error={handleError}
/>
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

Optional bundled photos as upload-area thumbnails.

```svelte
<PixuCompressor samples={sampleImages} options={{ format: 'image/pixu' }} />
```

See [Framework Examples](/examples/).

## Events

### compress

Dispatched when compression completes successfully.

```svelte
<PixuCompressor on:compress={handleCompress} />
```

### error

Dispatched when compression fails.

```svelte
<PixuCompressor on:error={handleError} />
```

### progress

Dispatched during compression to report progress.

```svelte
<PixuCompressor on:progress={handleProgress} />
```

## Advanced Example

```svelte
<script>
  import PixuCompressor from 'pixu/components/svelte/PixuCompressor.svelte';
  import type { CompressionResult } from 'pixu';

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

  function handleCompress(compressionResult) {
    result = compressionResult.detail;
  }

  function handleError(error) {
    console.error('Compression failed:', error);
    alert(`Error: ${error.detail.message}`);
  }

  function handleProgress(p) {
    progress = p.detail;
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

<PixuCompressor
  {options}
  autoCompress={true}
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

<style>
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

## Features

- Drag and drop support
- Progress tracking
- Error handling
- Download compressed image
- Responsive design
- TypeScript support
- Reactive updates

