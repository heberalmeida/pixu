# compressStream

Comprime imagens de forma assíncrona usando generators.

## Assinatura

```typescript
function* compressStream(
  files: AsyncIterable<File | Blob> | Iterable<File | Blob>,
  options?: StreamCompressionOptions
): AsyncGenerator<CompressionResult, void, unknown>
```

## Parâmetros

### files

Tipo: `AsyncIterable<File | Blob> | Iterable<File | Blob>`

Iterable ou async iterable de arquivos de imagem.

### options

Tipo: `StreamCompressionOptions`

Opções de compressão em stream que estendem CompressionOptions com:
- `chunkSize?: number` - Tamanho dos chunks a processar
- `onChunk?: (chunk: Blob, index: number) => void`

## Retorno

Tipo: `AsyncGenerator<CompressionResult, void, unknown>`

Async generator que emite resultados de compressão.

## Exemplo

```typescript
import { compressStream } from 'pixu';

async function processFiles(files: File[]) {
  for await (const result of compressStream(files, {
    quality: 0.8,
    onChunk: (chunk, index) => {
      console.log(`Chunk ${index} processed`);
    },
  })) {
    console.log('Compressed:', result);
    await uploadToServer(result.file);
  }
}
```

## Com Async Iterable

```typescript
async function* fileGenerator() {
  for (const file of files) {
    yield file;
  }
}

for await (const result of compressStream(fileGenerator(), {
  quality: 0.8,
})) {
  processResult(result);
}
```
