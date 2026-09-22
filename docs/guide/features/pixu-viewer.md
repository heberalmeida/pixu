# PIXU encode — native WebP/JPEG output

`format: 'image/pixu'` selects the TECR encode path. The **file you get is always** `image/webp` or `image/jpeg` with a matching `.webp` / `.jpg` extension — ready for `<img>`, downloads, and CDNs.

## Live demo

<CompressionDemo
  :options="{ format: 'image/pixu', enableSmartQuality: true, stripMetadata: true, quality: 0.85 }"
  title="PIXU encode"
  subtitle="TECR path — downloads as .webp or .jpg"
/>

## How it works

| Step | What happens |
|------|----------------|
| Encode | `compress(..., { format: 'image/pixu' })` uses adaptive / smart quality |
| Result | `result.format` is `image/webp` or `image/jpeg` |
| Display | `URL.createObjectURL(result.file)` works in `<img>` |
| Save | `buildDownloadName(name, result.format)` → `.webp` or `.jpg` |

```typescript
import {
  compress,
  buildDownloadName,
  PIXU_MIME_TYPE,
} from 'pixu'

const result = await compress(file, {
  format: PIXU_MIME_TYPE,
  enableSmartQuality: true,
})

img.src = URL.createObjectURL(result.file)

const a = document.createElement('a')
a.href = URL.createObjectURL(result.file)
a.download = buildDownloadName('photo', result.format)
a.click()
```

## Legacy helpers

If you still hold a blob typed as `image/pixu` (older builds), these remap the payload for display:

| Helper | Role |
|--------|------|
| `createPreviewObjectURL(file, format?)` | Object URL safe for `<img>` |
| `pixuToDisplayBlob(file)` | Same bytes, browser MIME |
| `loadPixuImage(file)` | Decoded `HTMLImageElement` |
| `detectPixuPayloadMime(buffer)` | Sniff WebP vs JPEG payload |

New compressions do not need these for normal preview or download.

## Related

- [PIXU Format](/guide/features/pixu-format)
- [API: PIXU](/api/pixu-format)
- [TECR](/guide/theory/contextual-reconstructive-entropy)
