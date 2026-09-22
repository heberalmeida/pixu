# Começando

O Pixu entrega a **melhor compressão perceptual** para a web ao otimizar a Entropia Reconstrutiva Contextual — $L(x \mid M, C, \varepsilon)$ — via o formato PIXU. Zero dependências, TypeScript completo, ciência honesta com Shannon.

Leia a [teoria TECR](/pt-BR/guide/theory/contextual-reconstructive-entropy) para o modelo completo.

## Instalação

```bash
npm install @pantanal/pixu
```

```bash
yarn add @pantanal/pixu
```

```bash
pnpm add @pantanal/pixu
```

## Primeira compressão

<CompressionDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

```typescript
import { compress } from '@pantanal/pixu';

const file = document.querySelector('input[type="file"]').files[0];

const result = await compress(file, {
  format: 'image/pixu',
  enableSmartQuality: true,
  stripMetadata: true,
});

console.log(`${result.originalSize} → ${result.compressedSize} bytes`);
console.log(`${(result.compressionRatio * 100).toFixed(1)}% reduction`);
```

## Opções de compressão

```typescript
const result = await compress(file, {
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
  format: 'auto',
  stripMetadata: true,
  fixOrientation: true,
  enableSmartQuality: true,
});
```

## Formatos de saída

| Formato | MIME | Extensão | Melhor para |
|--------|------|-----------|----------|
| PIXU | `image/pixu` | `.webp` / `.jpg` | Caminho TECR; saída nativa WebP ou JPEG |
| WebP | `image/webp` | `.webp` | Navegadores modernos |
| AVIF | `image/avif` | `.avif` | Pipelines nativos AVIF |
| JPEG | `image/jpeg` | `.jpg` | Compatibilidade universal |
| PNG | `image/png` | `.png` | Transparência, gráficos |
| Auto | `auto` | — | O Pixu escolhe PIX quando possível |

```typescript
import { compress, PIXU_MIME_TYPE, buildDownloadName } from '@pantanal/pixu';

const result = await compress(file, { format: PIXU_MIME_TYPE });
console.log(result.format); // "image/webp" ou "image/jpeg"
console.log(buildDownloadName('out', result.format));
```

Saiba mais: [Formato PIXU](/pt-BR/guide/features/pixu-format) · [Formatos suportados](/pt-BR/guide/features/supported-formats)

## Modos de compressão

### Modo qualidade

```typescript
await compress(file, { mode: 'quality', quality: 0.8 });
```

### Modo tamanho

```typescript
await compress(file, { mode: 'size', targetSize: 500 * 1024 });
```

### Modo adaptativo

```typescript
await compress(file, { mode: 'adaptive' });
```

## Modos de redimensionamento

```typescript
await compress(file, {
  width: 1920,
  height: 1080,
  resize: 'contain',
});
```

| Modo | Comportamento |
|------|----------|
| `none` | Sem redimensionar |
| `contain` | Cabe na caixa, mantém a proporção |
| `cover` | Preenche a caixa, corta se necessário |
| `fit` | Igual a contain |
| `fill` | Dimensões exatas, pode distorcer |

## Experimente imagens de exemplo

Os [exemplos de framework](/pt-BR/examples/) incluem fotos reais que você pode clicar para comprimir na hora:

```typescript
import { compress } from '@pantanal/pixu';

const res = await fetch('/photo-landscape.jpg');
const blob = await res.blob();
const file = new File([blob], 'photo-landscape.jpg', { type: blob.type });

const result = await compress(file, { format: 'image/pixu' });
```

Ou use um componente de UI com amostras embutidas:

```vue
<PixuCompressor
  :samples="sampleImages"
  :options="{ quality: 0.85, format: 'image/pixu' }"
  @compress="onDone"
/>
```

## Exemplos por framework

Prefere um app completo? Escolha sua stack:

| Framework | Guia |
|-----------|-------|
| Vue 3 | [Exemplos Vue](/pt-BR/examples/vue) |
| React | [Exemplos React](/pt-BR/examples/react-example) |
| Angular | [Exemplos Angular](/pt-BR/examples/angular) |
| Svelte | [Exemplos Svelte](/pt-BR/examples/svelte) |
| Jacaré | [Exemplos Jacaré](/pt-BR/examples/jacare) |

Execute qualquer projeto:

```bash
npm run build          # from repo root
cd examples/vue        # or react, angular, svelte, jacare
npm install && npm run dev
```

## Próximos passos

- [Início rápido](/pt-BR/guide/quick-start) — presets, workers, batch
- [Componente Vue](/pt-BR/guide/components/vue) — UI com drag & drop
- [Presets de compressão](/pt-BR/guide/features/presets)
- [Smart Quality](/pt-BR/guide/features/smart-quality)
- [API: compress()](/pt-BR/api/compress)
