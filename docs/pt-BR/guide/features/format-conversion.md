# Conversão de Formato

Converta automaticamente imagens para formatos mais eficientes.

## PNG para JPEG

Converta PNG para JPEG quando for vantajoso:

<CompressionDemo :options="{ quality: 0.8, convertToJPEG: true }" />

<VueDemo :options="{ quality: 0.8, convertToJPEG: true }" />

```typescript
const result = await compress(pngFile, {
  quality: 0.8,
  convertToJPEG: true,
});
```

## Detecção Automática

O Pixu converte automaticamente PNG para JPEG quando:

- O tamanho do arquivo é maior que 500KB
- A imagem não tem transparência
- JPEG seria mais eficiente

## Seleção Manual de Formato

<CompressionDemo :options="{ quality: 0.8, format: 'image/webp' }" />

<VueDemo :options="{ quality: 0.8, format: 'image/webp' }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  format: 'image/webp',
});
```

## Opções de Formato

Formatos disponíveis:
- `image/jpeg`
- `image/png`
- `image/webp`
- `image/avif`
- `auto` - Seleciona automaticamente o melhor formato

## Exemplo

```typescript
import { compress } from '@pantanal/pixu';

async function optimizeFormat(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    convertToJPEG: true,
  });

  return result.file;
}

async function convertToWebP(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    format: 'image/webp',
  });

  return result.file;
}
```
