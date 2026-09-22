# Recorte Inteligente

O Pixu oferece recorte inteligente com base na análise de conteúdo.

## Uso Básico

Ative o recorte inteligente:

<CompressionDemo :options="{ quality: 0.8, smartCrop: { enabled: true, width: 800, height: 600, focus: 'center' } }" />

<VueDemo :options="{ quality: 0.8, smartCrop: { enabled: true, width: 800, height: 600, focus: 'center' } }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  smartCrop: {
    enabled: true,
    width: 800,
    height: 600,
  },
});
```

## Pontos de Foco

Controle onde o recorte se concentra:

```typescript
const result = await compress(file, {
  quality: 0.8,
  smartCrop: {
    enabled: true,
    width: 800,
    height: 600,
    focus: 'center',
  },
});
```

Pontos de foco disponíveis:
- `center` - Centro da imagem
- `top` - Terço superior
- `bottom` - Terço inferior
- `left` - Terço esquerdo
- `right` - Terço direito

## Como Funciona

O recorte inteligente:

1. Analisa o conteúdo da imagem
2. Calcula o centro de massa com base em brilho e contraste
3. Aplica a preferência do ponto de foco
4. Recorta para as dimensões especificadas

## Exemplos Completos

```typescript
import { compress } from 'pixu';

async function createThumbnail(file: File) {
  const result = await compress(file, {
    quality: 0.7,
    smartCrop: {
      enabled: true,
      width: 400,
      height: 400,
      focus: 'center',
    },
    onProgress: (progress) => {
      console.log(`Thumbnail creation progress: ${(progress * 100).toFixed(0)}%`);
    },
  });

  console.log('Thumbnail created:', result.width + 'x' + result.height);
  return result.file;
}

async function createBanner(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    smartCrop: {
      enabled: true,
      width: 1920,
      height: 400,
      focus: 'top',
    },
  });

  console.log('Banner created:', result.width + 'x' + result.height);
  return result.file;
}

async function createSquareCrop(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    smartCrop: {
      enabled: true,
      width: 1080,
      height: 1080,
      focus: 'center',
    },
  });

  return result.file;
}

async function tryAllFocusPoints(file: File) {
  const focusPoints: Array<'center' | 'top' | 'bottom' | 'left' | 'right'> = [
    'center',
    'top',
    'bottom',
    'left',
    'right',
  ];

  const results: Record<string, File> = {};

  for (const focus of focusPoints) {
    try {
      const result = await compress(file, {
        quality: 0.8,
        smartCrop: {
          enabled: true,
          width: 800,
          height: 600,
          focus,
        },
      });
      results[focus] = result.file;
      console.log(`Crop with ${focus} focus completed`);
    } catch (error) {
      console.error(`Crop with ${focus} focus failed:`, error);
    }
  }

  return results;
}
```
