# PIXU format

TECR encode path. Prefer `format: 'image/pixu'` on [`compress`](/api/compress). The **output file** is always WebP or JPEG with a known extension.

## Constants

```typescript
import {
  PIXU_MIME_TYPE,   // 'image/pixu' — encode option only
  isPixuSupported,
  buildDownloadName,
} from 'pixu'

isPixuSupported() // true
```

`PIXU_EXTENSION` is deprecated (alias of `.webp`). Prefer `buildDownloadName(name, result.format)`.

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

Returns a Blob typed as `image/webp` (or `image/jpeg` fallback). Default `quality` is `0.85`. `adaptive` defaults to `true`.

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
import { compress, PIXU_MIME_TYPE, buildDownloadName } from 'pixu'

const result = await compress(file, {
  format: PIXU_MIME_TYPE,
  enableSmartQuality: true,
})

// result.format === 'image/webp' | 'image/jpeg'
a.download = buildDownloadName('photo', result.format)
img.src = URL.createObjectURL(result.file)
```

## Download helpers

```typescript
import { getOutputExtension, buildDownloadName } from 'pixu'

getOutputExtension('image/webp')  // '.webp'
getOutputExtension('image/jpeg')  // '.jpg'
getOutputExtension('image/pixu')  // '.webp' (encode option → default container)
buildDownloadName('photo', result.format)  // matches payload
```

## Legacy preview helpers

For older blobs still typed as `image/pixu`:

```typescript
import {
  createPreviewObjectURL,
  pixuToDisplayBlob,
  loadPixuImage,
  detectPixuPayloadMime,
} from 'pixu'
```

See [PIXU encode](/guide/features/pixu-viewer).

## Related

- Guide: [PIXU Format](/guide/features/pixu-format)
- Guide: [PIXU encode](/guide/features/pixu-viewer)
- Theory: [TECR](/guide/theory/contextual-reconstructive-entropy)
