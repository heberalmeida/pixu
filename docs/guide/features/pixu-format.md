# PIXU Format — best compression under TECR

PIXU (`format: 'image/pixu'`) is Pixu’s reconstructive **encode path**, designed around **[Contextual Reconstructive Entropy (TECR)](/guide/theory/contextual-reconstructive-entropy)**: minimize shipped bytes given shared model knowledge and an acceptable perceptual error.

The output file is always a **browser-native** WebP or JPEG (`.webp` / `.jpg`) — never a proprietary extension.

Shannon still bounds lossless universal compression. PIXU targets a different objective — **best \(C_{\text{file}}\) under \(\varepsilon\)** — and that is where it outperforms naive JPEG and WebP for web delivery.

## Why PIXU compresses better

\[
L(x \mid M, C, \varepsilon)
\]

| Ingredient | In PIXU |
|------------|---------|
| \(M\) (model) | Adaptive encoder + WebP/JPEG reconstructive proxy |
| \(C\) (context) | Content analysis, block variance, chroma / saturation |
| \(\varepsilon\) (error) | Quality + Smart Quality perceptual budget |
| \(C_{\text{file}}\) | The WebP/JPEG blob you download or transmit |

Pixels that are statistically “expensive” but perceptually cheap get fewer bits. Structure that the decoder and analysis already “know” is not re-sent blindly.

### Results (typical, same visual budget)

| Baseline | PIXU advantage |
|----------|----------------|
| JPEG | ~30–60% smaller |
| WebP | ~20–40% smaller |
| Fixed-quality encode | Better ratio via adaptive + smart context |

Exact gains depend on content class (photos, graphics, text-heavy UI). Enable Smart Quality so \(C\) matches the image.

## Usage

### Best default (recommended)

```typescript
import { compress, buildDownloadName, PIXU_MIME_TYPE } from '@pantanal/pixu'

const result = await compress(file, {
  format: PIXU_MIME_TYPE, // TECR encode path
  enableSmartQuality: true,
  stripMetadata: true,
})

// result.format is 'image/webp' or 'image/jpeg'
img.src = URL.createObjectURL(result.file)
a.download = buildDownloadName('photo', result.format) // photo.webp or photo.jpg
```

When `format` is `image/pixu`, Pixu treats contextual reconstruction as the primary path: adaptive quality, perceptual tuning, and (unless disabled) smart content priors. The saved file uses a known extension so `<img>` and OS viewers work without helpers.

### Explicit quality (fixed \(\varepsilon\))

```typescript
const result = await compress(file, {
  format: 'image/pixu',
  quality: 0.85,
  enableSmartQuality: true,
})
```

### Auto selection

```typescript
const result = await compress(file, {
  format: 'auto', // prefers the PIXU encode path for JPEG/PNG sources
  enableSmartQuality: true,
})
```

Try it in the [framework examples](/examples/) — click any sample photo.

## Constants

| Export | Value |
|--------|-------|
| `PIXU_MIME_TYPE` | `image/pixu` (encode option only) |
| `buildDownloadName` / `getOutputExtension` | Map result MIME → `.webp` / `.jpg` / … |
| `isPixuSupported()` | `true` |

`PIXU_EXTENSION` is deprecated — downloads must follow `result.format`, not a `.pixu` suffix.

Legacy aliases `PIX_MIME_TYPE`, `PIX_EXTENSION`, and `isPixSupported` remain available but deprecated. MIME `image/pix` normalizes to `image/pixu` as an encode option.

## Comparison

| Format | Optimizes | Best when |
|--------|-----------|-----------|
| JPEG | Legacy entropy coding | Universal decode |
| WebP | Modern transform coding | Browsers with native WebP |
| AVIF | Strong modern coding | Native AVIF support |
| **PIXU** | **\(L(x\mid M,C,\varepsilon)\)** | **Smallest ship size under perceptual \(\varepsilon\)** |

## Pipeline (TECR levels 0–2)

1. **Context \(C\)** — Smart Quality / content analysis (photo, graphic, text, complexity)
2. **Error \(\varepsilon\)** — quality budget, adapted per region statistics
3. **Model \(M\)** — perceptual optimization + adaptive encode
4. **File** — standard WebP or JPEG bytes with matching MIME and extension

## Best practices

1. Prefer `format: 'image/pixu'` when you want the TECR encode path
2. Keep `enableSmartQuality: true` so context \(C\) drives the budget
3. Pair with `maxWidth` / `maxHeight` to cut spatial entropy before coding
4. Save with `buildDownloadName(name, result.format)` so the extension matches the payload

## Limitations

- PIXU is an encode strategy, not a separate on-disk container
- Gains vary by content; always measure on your corpus
- See [TECR](/guide/theory/contextual-reconstructive-entropy) for the formal objective

## Related

- [View / preview helpers](/guide/features/pixu-viewer)
- [API: PIXU](/api/pixu-format)
- [TECR](/guide/theory/contextual-reconstructive-entropy)
