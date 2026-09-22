# Componente Svelte

Use o Pixu com Svelte para comprimir imagens facilmente nas suas aplicações Svelte.

## Demo ao vivo

<SvelteDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

## Instalação

```bash
npm install @pantanal/pixu
```

## Uso básico

Importe e use o componente `PixuCompressor`:

```svelte
<script>
  import PixuCompressor from 'pixu/components/svelte/PixuCompressor.svelte';
  import type { CompressionResult } from '@pantanal/pixu';

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

Opções de compressão. Veja [CompressionOptions](/pt-BR/api/types#compressionoptions).

### autoCompress

Type: `boolean`

Default: `true`

Comprime automaticamente ao selecionar um arquivo.

### samples

Type: `SampleImageOption[]`

Fotos opcionais como miniaturas na área de upload.

```svelte
<PixuCompressor samples={sampleImages} options={{ format: 'image/pixu' }} />
```

See [Exemplos de frameworks](/pt-BR/examples/).

## Events

### compress

Disparado quando a compressão conclui com sucesso.

```svelte
<PixuCompressor on:compress={handleCompress} />
```

### error

Disparado quando a compressão falha.

```svelte
<PixuCompressor on:error={handleError} />
```

### progress

Disparado durante a compressão para reportar o progresso.

```svelte
<PixuCompressor on:progress={handleProgress} />
```

## Exemplo avançado

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

## Recursos

- Suporte a arrastar e soltar
- Acompanhamento de progresso
- Tratamento de erros
- Download da imagem comprimida
- Design responsivo
- Suporte a TypeScript
- Atualizações reativas

