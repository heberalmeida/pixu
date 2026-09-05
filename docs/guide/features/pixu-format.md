# PIXU Format — best compression under TECR

PIXU (`image/pixu`, `.pixu`) is Pixu’s reconstructive image format. It is designed around **[Contextual Reconstructive Entropy (TECR)](/guide/theory/contextual-reconstructive-entropy)**: minimize shipped bytes given shared model knowledge and an acceptable perceptual error.

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
| \(C_{\text{file}}\) | The `.pixu` blob you transmit |

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
import { compress, PIXU_EXTENSION, PIXU_MIME_TYPE } from 'pixu'

const result = await compress(file, {
  format: 'image/pixu',
  enableSmartQuality: true, // builds context C
  stripMetadata: true,
})

const name = file.name.replace(/\.[^.]+$/, '') + PIXU_EXTENSION
// result.format === PIXU_MIME_TYPE → "image/pixu"
```

When `format` is `image/pixu`, Pixu treats contextual reconstruction as the primary path: adaptive quality, perceptual tuning, and (unless disabled) smart content priors.

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
  format: 'auto', // prefers PIXU for JPEG/PNG sources
  enableSmartQuality: true,
})
```

Try it in the [framework examples](/examples/) — click any sample photo.

## Constants

| Export | Value |
|--------|-------|
| `PIXU_MIME_TYPE` | `image/pixu` |
| `PIXU_EXTENSION` | `.pixu` |
| `isPixuSupported()` | `true` |

Legacy aliases `PIX_MIME_TYPE`, `PIX_EXTENSION`, and `isPixSupported` remain available but deprecated. MIME `image/pix` normalizes to `image/pixu`.

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
3. **Model \(M\)** — perceptual optimization + adaptive encode into reconstructive payload
4. **File** — wrapped as `image/pixu` (`.pixu`) for delivery

Browsers display via the internal WebP/JPEG reconstructive proxy; the MIME and extension stay PIXU for product identity and future TECR level-3 payloads.

## Best practices

1. Prefer `format: 'image/pixu'` for web delivery when you control decode/display through Pixu or your CDN pipeline
2. Keep `enableSmartQuality: true` so context \(C\) drives the budget
3. Pair with `maxWidth` / `maxHeight` to cut spatial entropy before coding
4. Keep a WebP/JPEG fallback only when you need raw native `<img>` without a PIXU-aware path

## Limitations

- Decode today uses a WebP/JPEG proxy inside the PIXU container path
- Tiny images (&lt; ~10KB) may see limited gain
- TECR level 3 (generative / semantic latents) is not in the shipped codec yet — see the [theory guide](/guide/theory/contextual-reconstructive-entropy)

## Further reading

- [Contextual Reconstructive Entropy](/guide/theory/contextual-reconstructive-entropy)
- [Smart Quality](/guide/features/smart-quality)
- [Supported Formats](/guide/features/supported-formats)
