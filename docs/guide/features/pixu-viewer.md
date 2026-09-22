# View PIXU images

Browsers do **not** render `image/pixu` natively. PIXU files are reconstructive payloads (WebP or JPEG bytes under a Pixu MIME type). Pixu exposes helpers so you can **preview** them in `<img>`, canvas, or CSS while still **saving** the original `.pixu` blob.

## Live viewer

Compress to PIXU, preview in the browser, then download `.pixu`:

<CompressionDemo
  :options="{ format: 'image/pixu', enableSmartQuality: true, stripMetadata: true, quality: 0.85 }"
  title="PIXU viewer"
  subtitle="Preview uses createPreviewObjectURL — download keeps .pixu"
/>

## How it works

| Step | What happens |
|------|----------------|
| Encode | `compress(..., { format: 'image/pixu' })` → `File` with type `image/pixu` |
| Preview | `createPreviewObjectURL(file)` remaps payload MIME to `image/webp` or `image/jpeg` for `<img>` |
| Save | Keep `result.file` and name it with `buildDownloadName(name, result.format)` → `.pixu` |

```typescript
import {
  compress,
  createPreviewObjectURL,
  pixuToDisplayBlob,
  loadPixuImage,
  buildDownloadName,
  PIXU_MIME_TYPE,
} from 'pixu'

const result = await compress(file, {
  format: PIXU_MIME_TYPE,
  enableSmartQuality: true,
})

// Preview (revoke when done)
const previewUrl = await createPreviewObjectURL(result.file, result.format)
img.src = previewUrl

// Or get a display Blob / HTMLImageElement
const displayBlob = await pixuToDisplayBlob(result.file)
const image = await loadPixuImage(result.file)

// Download still saves PIXU
const a = document.createElement('a')
a.href = URL.createObjectURL(result.file)
a.download = buildDownloadName('photo', result.format) // photo.pixu
a.click()
```

## API

| Helper | Role |
|--------|------|
| `createPreviewObjectURL(file, format?)` | Object URL safe for `<img>` |
| `pixuToDisplayBlob(file)` | Same bytes, browser MIME (`image/webp` / `image/jpeg`) |
| `createPixuObjectURL(file)` | Alias focused on PIXU → display URL |
| `loadPixuImage(file)` | Decoded `HTMLImageElement` |
| `detectPixuPayloadMime(buffer)` | Sniff WebP vs JPEG payload |
| `isPixuBlob(file)` | MIME check |

## Native support?

There is no built-in browser codec for `image/pixu` yet. Viewing always goes through Pixu (or your own remapping of the payload). Serving `.pixu` to end users typically means:

1. Decode on the client with these helpers, or
2. Transcode to WebP/JPEG on the server for public CDN URLs, while keeping `.pixu` as the archival / app format.

## Related

- [PIXU Format](/guide/features/pixu-format)
- [API: PIXU](/api/pixu-format)
- [TECR](/guide/theory/contextual-reconstructive-entropy)
