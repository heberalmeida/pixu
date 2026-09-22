# PIXU format

Proprietary reconstructive format under TECR. Prefer `format: 'image/pixu'` on [`compress`](/pt-BR/api/compress).

## Constantes

```typescript
import {
  PIXU_MIME_TYPE,   // 'image/pixu'
  PIXU_EXTENSION,   // '.pixu'
  isPixuSupported,
} from 'pixu'

isPixuSupported() // true in supported environments
```

Deprecated aliases still exported: `PIX_MIME_TYPE`, `PIX_EXTENSION`, `isPixSupported`, `canvasToPix`, `estimatePixCompression`.

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

Default `quality` is `0.85`. `adaptive` defaults to `true`.

## estimatePixuCompression

```typescript
function estimatePixuCompression(
  originalSize: number,
  quality: number,
  width: number,
  height: number
): number
```

Returns an estimated compression ratio (roughly 0.4–0.8 depending on inputs).

## normalizePixuFormat

```typescript
function normalizePixuFormat(format: string): string
```

Maps legacy `'image/pix'` → `'image/pixu'`.

## Example

```typescript
import { compress, PIXU_MIME_TYPE, PIXU_EXTENSION } from 'pixu'

const result = await compress(file, {
  format: PIXU_MIME_TYPE,
  enableSmartQuality: true,
})

a.download = `photo${PIXU_EXTENSION}`
```

## Helpers de download

```typescript
import { getOutputExtension, buildDownloadName } from 'pixu'

getOutputExtension('image/pixu')  // '.pixu'
getOutputExtension('image/jpeg')  // '.jpg'
buildDownloadName('photo', 'image/webp')  // 'photo.webp'
```

Use ao salvar `CompressionResult.file` para o browser baixar com a extensão correta.

## Preview / decode

```typescript
import {
  createPreviewObjectURL,
  pixuToDisplayBlob,
  loadPixuImage,
  detectPixuPayloadMime,
} from 'pixu'

const url = await createPreviewObjectURL(result.file, result.format)
img.src = url

const display = await pixuToDisplayBlob(result.file)
const image = await loadPixuImage(result.file)
```

Veja [Visualizar PIXU](/pt-BR/guide/features/pixu-viewer).

## Relacionado

- Guide: [Formato PIXU](/pt-BR/guide/features/pixu-format)
- Guide: [Visualizar PIXU](/pt-BR/guide/features/pixu-viewer)
- Theory: [TECR](/pt-BR/guide/theory/contextual-reconstructive-entropy)
