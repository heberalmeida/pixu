# Presets de Compressão

O Pixu oferece presets de compressão pré-configurados para casos de uso comuns.

## Presets Disponíveis

### Social Media

Otimizado para Instagram, Facebook e outras plataformas sociais.

<CompressionDemo :options="{ preset: 'social-media' }" />

<VueDemo :options="{ preset: 'social-media' }" />

```typescript
const result = await compress(file, {
  preset: 'social-media',
});
```

Configuração:
- Largura máxima: 1080px
- Qualidade: 85%
- Formato: Auto (formato PIX preferido para melhor compressão, com fallback para WebP se necessário)
- Metadados: Removidos

### Print

Alta qualidade para impressão.

<CompressionDemo :options="{ preset: 'print' }" />

<VueDemo :options="{ preset: 'print' }" />

```typescript
const result = await compress(file, {
  preset: 'print',
});
```

Configuração:
- Largura máxima: 3000px
- Qualidade: 95%
- Formato: JPEG
- Metadados: Preservados

### Web

Configurações equilibradas para uso na web.

<CompressionDemo :options="{ preset: 'web' }" />

<VueDemo :options="{ preset: 'web' }" />

```typescript
const result = await compress(file, {
  preset: 'web',
});
```

Configuração:
- Largura máxima: 1920px
- Qualidade: 80%
- Formato: Auto (formato PIX preferido para melhor compressão, com fallback para WebP se necessário)
- Metadados: Removidos

### Thumbnail

Tamanho pequeno para miniaturas e pré-visualizações.

<CompressionDemo :options="{ preset: 'thumbnail' }" />

<VueDemo :options="{ preset: 'thumbnail' }" />

```typescript
const result = await compress(file, {
  preset: 'thumbnail',
});
```

Configuração:
- Largura máxima: 320px
- Qualidade: 70%
- Formato: Auto (formato PIX preferido para melhor compressão)
- Metadados: Removidos

### Email

Otimizado para anexos de e-mail.

<CompressionDemo :options="{ preset: 'email' }" />

<VueDemo :options="{ preset: 'email' }" />

```typescript
const result = await compress(file, {
  preset: 'email',
});
```

Configuração:
- Largura máxima: 800px
- Qualidade: 75%
- Formato: JPEG
- Metadados: Removidos

## Personalizando Presets

Você pode sobrescrever opções do preset:

```typescript
const result = await compress(file, {
  preset: 'web',
  quality: 0.9,
  maxWidth: 2560,
});
```

## Obtendo Opções do Preset

```typescript
import { getPresetOptions } from '@pantanal/pixu';

const options = getPresetOptions('social-media');
console.log(options);
```

## Exemplo Completo

```typescript
import { compress, getPresetOptions } from '@pantanal/pixu';

async function prepareForSocialMedia(file: File) {
  const presetOptions = getPresetOptions('social-media');
  console.log('Using preset options:', presetOptions);

  const result = await compress(file, {
    preset: 'social-media',
    onProgress: (progress) => {
      console.log(`Progress: ${(progress * 100).toFixed(0)}%`);
    },
  });

  console.log('Result:', {
    original: result.originalSize,
    compressed: result.compressedSize,
    ratio: (result.compressionRatio * 100).toFixed(1) + '%',
    dimensions: result.width + 'x' + result.height,
    format: result.format,
  });

  return result.file;
}

async function prepareForPrint(file: File) {
  const result = await compress(file, {
    preset: 'print',
    onProgress: (progress) => {
      console.log(`Progress: ${(progress * 100).toFixed(0)}%`);
    },
  });

  return result.file;
}

async function prepareForAllPlatforms(file: File) {
  const presets: Array<'social-media' | 'web' | 'print' | 'thumbnail' | 'email'> = [
    'social-media',
    'web',
    'print',
    'thumbnail',
    'email',
  ];

  const results: Record<string, File> = {};

  for (const preset of presets) {
    try {
      const result = await compress(file, {
        preset,
      });
      results[preset] = result.file;
      console.log(`${preset} completed: ${result.compressedSize} bytes`);
    } catch (error) {
      console.error(`${preset} failed:`, error);
    }
  }

  return results;
}
```
