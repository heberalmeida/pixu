# Filtros de Imagem

O Pixu oferece filtros de imagem nativos, sem dependências externas.

## Filtros Disponíveis

### Grayscale

Converte a imagem para escala de cinza.

<CompressionDemo :options="{ quality: 0.8, filters: ['grayscale'] }" />

<VueDemo :options="{ quality: 0.8, filters: ['grayscale'] }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: ['grayscale'],
});
```

### Sepia

Aplica efeito de tom sépia.

<CompressionDemo :options="{ quality: 0.8, filters: ['sepia'] }" />

<VueDemo :options="{ quality: 0.8, filters: ['sepia'] }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: ['sepia'],
});
```

### Vintage

Aplica efeito de filme vintage.

<CompressionDemo :options="{ quality: 0.8, filters: ['vintage'] }" />

<VueDemo :options="{ quality: 0.8, filters: ['vintage'] }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: ['vintage'],
});
```

### Brightness

Ajusta o brilho da imagem.

<CompressionDemo :options="{ quality: 0.8, filters: [{ type: 'brightness', value: 1.2 }] }" />

<VueDemo :options="{ quality: 0.8, filters: [{ type: 'brightness', value: 1.2 }] }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: [
    { type: 'brightness', value: 1.2 }
  ],
});
```

Faixa de valor: 0-2 (1.0 é normal, >1.0 é mais claro, <1.0 é mais escuro)

### Contrast

Ajusta o contraste da imagem.

<CompressionDemo :options="{ quality: 0.8, filters: [{ type: 'contrast', value: 1.1 }] }" />

<VueDemo :options="{ quality: 0.8, filters: [{ type: 'contrast', value: 1.1 }] }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: [
    { type: 'contrast', value: 1.1 }
  ],
});
```

Faixa de valor: 0-2 (1.0 é normal, >1.0 é mais contraste, <1.0 é menos contraste)

### Saturation

Ajusta a saturação das cores.

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: [
    { type: 'saturation', value: 1.2 }
  ],
});
```

Faixa de valor: 0-2 (1.0 é normal, >1.0 é mais saturado, <1.0 é menos saturado)

### Blur

Aplica efeito de desfoque.

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: [
    { type: 'blur', value: 2 }
  ],
});
```

Faixa de valor: 0-10 (pixels)

### Sharpen

Aplica efeito de nitidez.

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: [
    { type: 'sharpen', value: 1.5 }
  ],
});
```

Faixa de valor: 0-10

## Múltiplos Filtros

Aplique vários filtros em sequência:

```typescript
const result = await compress(file, {
  quality: 0.8,
  filters: [
    'grayscale',
    { type: 'brightness', value: 1.1 },
    { type: 'contrast', value: 1.2 },
  ],
});
```

## Exemplos Completos

```typescript
import { compress } from 'pixu';

async function applyVintageEffect(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    maxWidth: 1920,
    filters: [
      'vintage',
      { type: 'brightness', value: 0.9 },
      { type: 'contrast', value: 1.1 },
      { type: 'saturation', value: 0.8 },
    ],
    onProgress: (progress) => {
      console.log(`Vintage effect progress: ${(progress * 100).toFixed(0)}%`);
    },
  });

  console.log('Vintage effect applied');
  return result.file;
}

async function createThumbnail(file: File) {
  const result = await compress(file, {
    quality: 0.7,
    maxWidth: 320,
    filters: ['grayscale'],
  });

  console.log('Thumbnail created');
  return result.file;
}

async function applyAllFilters(file: File) {
  const filterConfigs = [
    { name: 'grayscale', filters: ['grayscale'] },
    { name: 'sepia', filters: ['sepia'] },
    { name: 'vintage', filters: ['vintage'] },
    { name: 'bright', filters: [{ type: 'brightness', value: 1.2 }] },
    { name: 'dark', filters: [{ type: 'brightness', value: 0.8 }] },
    { name: 'high-contrast', filters: [{ type: 'contrast', value: 1.3 }] },
    { name: 'saturated', filters: [{ type: 'saturation', value: 1.5 }] },
    { name: 'blurred', filters: [{ type: 'blur', value: 3 }] },
    { name: 'sharpened', filters: [{ type: 'sharpen', value: 2 }] },
  ];

  const results: Record<string, File> = {};

  for (const config of filterConfigs) {
    try {
      const result = await compress(file, {
        quality: 0.8,
        filters: config.filters,
      });
      results[config.name] = result.file;
      console.log(`Applied ${config.name} filter`);
    } catch (error) {
      console.error(`Failed to apply ${config.name}:`, error);
    }
  }

  return results;
}
```
