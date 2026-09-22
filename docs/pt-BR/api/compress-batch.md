# compressBatch

Comprime várias imagens com controle de concorrência.

## Assinatura

```typescript
function compressBatch(
  files: (File | Blob)[],
  options?: BatchCompressionOptions
): Promise<CompressionResult[]>
```

## Parâmetros

### files

Tipo: `(File | Blob)[]`

Array de arquivos de imagem a comprimir.

### options

Tipo: `BatchCompressionOptions`

Opções de compressão em lote que estendem CompressionOptions com:
- `concurrency?: number` - Número de compressões concorrentes (padrão: 3)
- `onItemComplete?: (result: CompressionResult, index: number) => void`
- `onItemError?: (error: Error, index: number) => void`

## Retorno

Tipo: `Promise<CompressionResult[]>`

Array de resultados de compressão na mesma ordem dos arquivos de entrada.

## Exemplo

```typescript
import { compressBatch } from 'pixu';

const files = Array.from(fileInput.files);

const results = await compressBatch(files, {
  quality: 0.8,
  maxWidth: 1920,
  concurrency: 3,
  onItemComplete: (result, index) => {
    console.log(`File ${index + 1} completed`);
  },
  onItemError: (error, index) => {
    console.error(`File ${index + 1} failed:`, error);
  },
});
```

## Tratamento de erros

Se algum arquivo falhar e nenhum `onItemError` for fornecido, a promise será rejeitada. Com `onItemError`, os erros são tratados por item e a promise resolve com os resultados das compressões bem-sucedidas.
