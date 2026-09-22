# Otimização de PNG

O Pixu oferece recursos avançados de otimização de PNG.

## Redução de Cores

Reduza a paleta de cores para diminuir o tamanho do arquivo:

<CompressionDemo :options="{ quality: 0.8, optimizePNG: { enabled: true, reduceColors: true, maxColors: 128 } }" />

<VueDemo :options="{ quality: 0.8, format: 'image/png', optimizePNG: { enabled: true, reduceColors: true, maxColors: 128 } }" />

```typescript
const result = await compress(pngFile, {
  quality: 0.8,
  optimizePNG: {
    enabled: true,
    reduceColors: true,
    maxColors: 128,
  },
});
```

Contagens de cores disponíveis: 2, 4, 16, 64, 128, 256

## Otimização de Transparência

Otimize pixels transparentes:

```typescript
const result = await compress(pngFile, {
  quality: 0.8,
  optimizePNG: {
    enabled: true,
    optimizeTransparency: true,
  },
});
```

## Otimização Combinada

```typescript
const result = await compress(pngFile, {
  quality: 0.8,
  optimizePNG: {
    enabled: true,
    reduceColors: true,
    maxColors: 64,
    optimizeTransparency: true,
  },
});
```

## Quando Usar

A otimização de PNG é mais eficaz para:

- Imagens com paletas de cores limitadas
- Gráficos e ilustrações
- Imagens com transparência
- Arquivos PNG grandes

## Exemplos Completos

```typescript
import { compress } from 'pixu';

async function optimizePNG(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    optimizePNG: {
      enabled: true,
      reduceColors: true,
      maxColors: 128,
      optimizeTransparency: true,
    },
    onProgress: (progress) => {
      console.log(`PNG optimization progress: ${(progress * 100).toFixed(0)}%`);
    },
  });

  console.log('PNG optimized:', {
    original: result.originalSize,
    compressed: result.compressedSize,
    ratio: (result.compressionRatio * 100).toFixed(1) + '%',
  });

  return result.file;
}

async function optimizeWithColorReduction(file: File, maxColors: number) {
  const result = await compress(file, {
    quality: 0.8,
    optimizePNG: {
      enabled: true,
      reduceColors: true,
      maxColors,
      optimizeTransparency: true,
    },
  });

  console.log(`Optimized with ${maxColors} colors`);
  return result.file;
}

async function tryAllColorLevels(file: File) {
  const colorLevels = [256, 128, 64, 16, 4, 2];
  const results: Record<number, File> = {};

  for (const maxColors of colorLevels) {
    try {
      const result = await compress(file, {
        quality: 0.8,
        optimizePNG: {
          enabled: true,
          reduceColors: true,
          maxColors,
          optimizeTransparency: true,
        },
      });
      results[maxColors] = result.file;
      console.log(`${maxColors} colors: ${result.compressedSize} bytes`);
    } catch (error) {
      console.error(`Failed with ${maxColors} colors:`, error);
    }
  }

  return results;
}
```
