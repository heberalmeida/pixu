---
layout: home

hero:
  name: Pixu
  text: Best compression under TECR
  tagline: Contextual Reconstructive Entropy · PIXU format · Zero dependencies · TypeScript
  image:
    src: /logo.png
    alt: Pixu
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Theory
      link: /guide/theory/contextual-reconstructive-entropy
    - theme: alt
      text: Try Live Demo
      link: /demo

features:
  - title: Contextual Reconstructive Entropy
    details: Optimize L(x|M,C,ε) — ship fewer bytes given shared model, content context, and perceptual error. Shannon still holds; the problem we solve is better.
  - title: PIXU Encode
    details: image/pixu TECR path — typically 30–60% smaller than JPEG and 20–40% vs WebP; saves as .webp or .jpg.
  - title: Smart Context (C)
    details: Smart Quality classifies photo, graphic, and text so bitrate follows structure, not a blind constant.
  - title: Zero Dependencies
    details: Lightweight bundle (~14KB gzip). No external runtime deps — ship less, load faster.
  - title: Framework Ready
    details: Drop-in components for Vue 3, React, Angular, Svelte, and Jacaré with real sample images.
  - title: Full TypeScript
    details: Typed API, CompressionResult, SupportedFormat, and buildDownloadName helpers.
---

## Quick Start

```bash
npm install pixu
```

```typescript
import { compress, buildDownloadName } from 'pixu';

const result = await compress(file, {
  format: 'image/pixu',
  enableSmartQuality: true,
  stripMetadata: true,
});

console.log(result.compressionRatio);
console.log(buildDownloadName('photo', result.format)); // photo.webp or photo.jpg
```

## Theory

Pixu minimizes shipped bytes under [Contextual Reconstructive Entropy](/guide/theory/contextual-reconstructive-entropy) — $L(x \mid M, C, \varepsilon)$ — not a claim to beat Shannon losslessly.
## Try It Live

Pick a sample photo or upload your own — same layout as the framework examples.

<CompressionDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

<VueDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

## Framework Examples

| Framework | Port | Command |
|-----------|------|---------|
| [Vue 3](/examples/vue) | 3000 | `cd examples/vue && npm run dev` |
| [React](/examples/react-example) | 3001 | `cd examples/react && npm run dev` |
| [Angular](/examples/angular) | 4200 | `cd examples/angular && npm start` |
| [Svelte](/examples/svelte) | 3002 | `cd examples/svelte && npm run dev` |
| [Jacaré](/examples/jacare) | 3003 | `cd examples/jacare && npm run dev` |

Build the library first: `npm run build` from the repo root.

[View all framework examples →](/examples/)

## Documentation Map

- [Getting Started](/guide/getting-started) — install and first compression
- [PIXU Format](/guide/features/pixu-format) — proprietary output format
- [Components](/guide/components/vue) — Vue, React, Angular, Svelte, Jacaré
- [API Reference](/api/compress) — compress, compressBatch, types
- [Code Examples](/examples/basic) — presets, filters, workers, batch
