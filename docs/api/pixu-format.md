# PIXU format

Proprietary reconstructive format under TECR. Prefer `format: 'image/pixu'` on [`compress`](/api/compress).

## Constants

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

## Download helpers

```typescript
import { getOutputExtension, buildDownloadName } from 'pixu'

getOutputExtension('image/pixu')  // '.pixu'
getOutputExtension('image/jpeg')  // '.jpg'
buildDownloadName('photo', 'image/webp')  // 'photo.webp'
```

Use these when saving `CompressionResult.file` so the browser downloads the correct extension.

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

const display = await pixuToDisplayBlob(result.file) // image/webp or image/jpeg
const image = await loadPixuImage(result.file)
```

See [View PIXU](/guide/features/pixu-viewer).

## Related

- Guide: [PIXU Format](/guide/features/pixu-format)
- Guide: [View PIXU](/guide/features/pixu-viewer)
- Theory: [TECR](/guide/theory/contextual-reconstructive-entropy)

