# Smart Quality — content context \(C\)

Smart Quality builds the **context** term in Pixu’s [Contextual Reconstructive Entropy](/guide/theory/contextual-reconstructive-entropy) model:

\[
L(x \mid M, C, \varepsilon)
\]

Instead of one fixed quality for every image, Pixu estimates content class and complexity, then sets a perceptual error budget \(\varepsilon\) that favors smaller \(C_{\text{file}}\) without wasting bits on detail the eye will not miss.

## Basic usage

<CompressionDemo :options="{ enableSmartQuality: true, format: 'image/pixu' }" />

```typescript
const result = await compress(file, {
  format: 'image/pixu',
  enableSmartQuality: true,
})
```

For PIXU output, contextual reconstruction is the default path: leave Smart Quality on unless you need a fixed numeric quality only.

## How it works

Analysis estimates:

| Signal | Used as |
|--------|---------|
| Content type (photo / graphic / text / mixed) | Prior for \(C\) |
| Complexity (low / medium / high) | How aggressively to spend \(\varepsilon\) |
| Recommended quality | Starting \(\varepsilon\) for the encoder |

That context feeds adaptive PIXU encoding (\(M\)) so bitrate follows structure, not a blind constant.

## Content priors

### Photos

Natural scenes tolerate more perceptual loss → lower recommended quality (more compression).

### Graphics

Flat colors and hard edges need higher quality to avoid banding and ringing.

### Text

Edge-heavy, low-diversity images keep high quality for readability.

## With PIXU (recommended)

```typescript
import { compress } from '@pantanal/pixu'

const result = await compress(file, {
  format: 'image/pixu',
  enableSmartQuality: true,
  stripMetadata: true,
})
```

This is the TECR “best compression” recipe: shared reconstructive model + measured context + perceptual \(\varepsilon\).

## Overriding the budget

```typescript
const result = await compress(file, {
  enableSmartQuality: true,
  quality: 0.85, // explicit ε; context still informs PIXU adaptive stages
})
```

## Manual analysis

```typescript
import { analyzeImageContent } from '@pantanal/pixu'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
ctx.drawImage(img, 0, 0)

const analysis = await analyzeImageContent(canvas)
console.log(analysis.recommendedQuality)
console.log(analysis.complexity, analysis.isPhoto, analysis.isGraphic)
```

## Example

```typescript
import { compress } from '@pantanal/pixu'

async function smartCompress(file: File) {
  return compress(file, {
    format: 'image/pixu',
    enableSmartQuality: true,
  })
}
```

## See also

- [TECR theory](/guide/theory/contextual-reconstructive-entropy)
- [PIXU Format](/guide/features/pixu-format)
- [Image Analysis](/guide/features/image-analysis)
