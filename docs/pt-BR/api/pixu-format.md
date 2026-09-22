# PIXU format

Caminho de encode TECR. Prefira `format: 'image/pixu'` em [`compress`](/pt-BR/api/compress). O **arquivo de saída** é sempre WebP ou JPEG com extensão conhecida.

## Constantes

```typescript
import {
  PIXU_MIME_TYPE,   // 'image/pixu' — só opção de encode
  isPixuSupported,
  buildDownloadName,
} from '@pantanal/pixu'

isPixuSupported() // true
```

`PIXU_EXTENSION` está depreciado (alias de `.webp`). Prefira `buildDownloadName(name, result.format)`.

Aliases depreciados ainda exportados: `PIX_MIME_TYPE`, `PIX_EXTENSION`, `isPixSupported`, `canvasToPix`, `estimatePixCompression`.

## canvasToPixu

```typescript
function canvasToPixu(
  canvas: HTMLCanvasElement,
  quality?: number,
  options?: {
    progressive?: boolean
    adaptive?: boolean
    chromaSubsampling?: '4:4:4' | '4:2:2' | '4:2:0'
  }
): Promise<Blob>
```

Retorna um Blob tipado como `image/webp` (ou fallback `image/jpeg`). Default `quality` é `0.85`. `adaptive` default `true`.

## estimatePixuCompression

```typescript
function estimatePixuCompression(
  originalSize: number,
  quality: number,
  width: number,
  height: number
): number
```

Retorna uma razão estimada de compressão (cerca de 0.4–0.8).

## normalizePixuFormat

```typescript
function normalizePixuFormat(format: string): string
```

Mapeia legado `'image/pix'` → `'image/pixu'`.

## Exemplo

```typescript
import { compress, PIXU_MIME_TYPE, buildDownloadName } from '@pantanal/pixu'

const result = await compress(file, {
  format: PIXU_MIME_TYPE,
  enableSmartQuality: true,
})

// result.format === 'image/webp' | 'image/jpeg'
a.download = buildDownloadName('photo', result.format)
img.src = URL.createObjectURL(result.file)
```

## Helpers de download

```typescript
import { getOutputExtension, buildDownloadName } from '@pantanal/pixu'

getOutputExtension('image/webp')  // '.webp'
getOutputExtension('image/jpeg')  // '.jpg'
getOutputExtension('image/pixu')  // '.webp' (opção de encode → container padrão)
buildDownloadName('photo', result.format)  // bate com o payload
```

## Helpers de preview legados

Para blobs antigos ainda tipados como `image/pixu`:

```typescript
import {
  createPreviewObjectURL,
  pixuToDisplayBlob,
  loadPixuImage,
  detectPixuPayloadMime,
} from '@pantanal/pixu'
```

Veja [Encode PIXU](/pt-BR/guide/features/pixu-viewer).

## Relacionado

- Guide: [Formato PIXU](/pt-BR/guide/features/pixu-format)
- Guide: [Encode PIXU](/pt-BR/guide/features/pixu-viewer)
- Theory: [TECR](/pt-BR/guide/theory/contextual-reconstructive-entropy)
