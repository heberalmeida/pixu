# Início rápido

Comece a usar o Pixu em minutos.

## Compressão básica

<CompressionDemo :options="{ quality: 0.8 }" />

```typescript
import { compress } from 'pixu';

const fileInput = document.querySelector('input[type="file"]');

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const result = await compress(file, {
    quality: 0.8,
  });

  console.log('Compressed:', result);
});
```

## Com redimensionamento

<CompressionDemo :options="{ quality: 0.8, maxWidth: 1920, maxHeight: 1080 }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
});
```

## Usando presets

<CompressionDemo :options="{ preset: 'web' }" />

```typescript
const result = await compress(file, {
  preset: 'web',
});
```

## Com acompanhamento de progresso

<CompressionDemo :options="{ quality: 0.8 }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  onProgress: (progress) => {
    console.log(`Progress: ${(progress * 100).toFixed(0)}%`);
  },
});
```

## Web Worker

```typescript
import { WorkerCompressor } from 'pixu/worker/client';

const worker = new WorkerCompressor('/path/to/pixu.worker.esm.js');

const result = await worker.compress(file, {
  quality: 0.8,
});
```

## Processamento em lote

```typescript
import { compressBatch } from 'pixu';

const results = await compressBatch(files, {
  quality: 0.8,
  concurrency: 3,
});
```

## Tratamento de erros

```typescript
try {
  const result = await compress(file, {
    quality: 0.8,
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Compression failed:', error.message);
  }
}
```

## Usando o formato PIXU (melhor compressão)

<CompressionDemo :options="{ quality: 0.8, format: 'image/pixu' }" />

```typescript
import { compress } from 'pixu';

const result = await compress(file, {
  quality: 0.8,
  format: 'image/pixu', // Revolutionary format, 30-60% better than JPEG
});
```

## Exemplo completo

```typescript
import { compress } from 'pixu';

async function compressImage(file: File) {
  try {
    const result = await compress(file, {
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
      format: 'image/pixu', // Using PIX for best compression
      stripMetadata: true,
      onProgress: (progress) => {
        console.log(`Progress: ${(progress * 100).toFixed(0)}%`);
      },
    });

    console.log(`Original: ${result.originalSize} bytes`);
    console.log(`Compressed: ${result.compressedSize} bytes`);
    console.log(`Ratio: ${(result.compressionRatio * 100).toFixed(1)}%`);

    return result.file;
  } catch (error) {
    console.error('Compression failed:', error);
    throw error;
  }
}
```

## Exemplos por framework

Apps prontos para rodar com fotos de exemplo reais e componentes de UI:

```bash
npm run build
cd examples/vue   # or react, angular, svelte, jacare
npm install && npm run dev
```

| Framework | Porta | Guia |
|-----------|------|-------|
| Vue | 3000 | [/pt-BR/examples/vue](/pt-BR/examples/vue) |
| React | 3001 | [/pt-BR/examples/react-example](/pt-BR/examples/react-example) |
| Angular | 4200 | [/pt-BR/examples/angular](/pt-BR/examples/angular) |
| Svelte | 3002 | [/pt-BR/examples/svelte](/pt-BR/examples/svelte) |
| Jacaré | 3003 | [/pt-BR/examples/jacare](/pt-BR/examples/jacare) |

[Visão geral completa →](/pt-BR/examples/)
