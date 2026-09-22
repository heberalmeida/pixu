# compress

Comprime um único arquivo de imagem.

## Assinatura

```typescript
function compress(
  file: File | Blob,
  options?: CompressionOptions
): Promise<CompressionResult>
```

## Parâmetros

### file

Tipo: `File | Blob`

O arquivo de imagem a comprimir.

### options

Tipo: `CompressionOptions`

Opções de compressão. Veja [CompressionOptions](/pt-BR/api/types#compressionoptions).

## Retorno

Tipo: `Promise<CompressionResult>`

Uma promise que resolve para um resultado de compressão. Veja [CompressionResult](/pt-BR/api/types#compressionresult).

## Exemplo

<CompressionDemo :options="{ quality: 0.8, maxWidth: 1920, maxHeight: 1080 }" />

```typescript
import { compress } from 'pixu';

const fileInput = document.querySelector('input[type="file"]');

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const result = await compress(file, {
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
    });

    console.log(`Compressed from ${result.originalSize} to ${result.compressedSize} bytes`);
  } catch (error) {
    console.error('Compression failed:', error);
  }
});
```

## Tratamento de erros

```typescript
try {
  const result = await compress(file, options);
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  }
}
```

## Erros comuns

- `File must be an image` - O arquivo fornecido não é uma imagem válida
- `Invalid image dimensions` - A imagem tem dimensões inválidas
- `Compression was aborted` - A compressão foi abortada
- `Compression already in progress` - Outra compressão já está em andamento
