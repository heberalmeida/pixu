# Pixu Framework Examples

Complete working examples for Vue, React, Angular, Svelte, and Jacaré.

## Documentation layout

All examples share the **same layout as the VitePress docs**:

| Token | Color |
|-------|-------|
| Brand purple | `#7b3fef` |
| Background | light / system (docs-style) |
| Content width | ~960px |

Shared styles: `examples/shared/theme.css`  
Logo + samples: `examples/shared/assets/`

Live demos also run inside the docs (`npm run dev` at repo root) with the same samples.

## Available Examples

### Vue 3

```bash
cd vue
npm install
npm run dev
```

`http://localhost:3000`

### React

```bash
cd react
npm install
npm run dev
```

`http://localhost:3001`

### Angular

```bash
cd angular
npm install
npm start
```

`http://localhost:4200`

### Svelte

```bash
cd svelte
npm install
npm run dev
```

`http://localhost:3002`

### Jacaré

```bash
cd jacare
npm install
npm run dev
```

`http://localhost:3003`

## Prerequisites

Build Pixu first:

```bash
cd ../..
npm run build
```

## Sample images

Each example includes real sample images in `public/` (or `src/assets/` for Angular):

- `photo-landscape.jpg` — mountains (Picsum)
- `photo-portrait.jpg` — portrait
- `photo-city.jpg` — cityscape
- `photo-nature.jpg` — forest
- `photo-food.jpg` — food photography
- `graphic-transparent.png` — PNG with transparency

Click a sample to compress with `format: 'image/pixu'` and compare before/after.

## Features

- Docs-style layout (shared with VitePress)
- Direct `import { compress } from 'pixu'`
- Framework components including Jacaré (`PixuCompressor.jcr`)
- PIXU format (`.pixu`) in format selectors
- Sample image gallery
- Compression presets, filters, batch (Vue full demo)
