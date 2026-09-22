# Live Demo

Interactive Pixu demos with **real sample images**. Same visual language as the framework examples.

## Compress with PIXU (TECR)

<CompressionDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

## Vue component

<VueDemo :options="{ format: 'image/pixu', enableSmartQuality: true, quality: 0.85 }" />

## What you can try

- Click any **sample photo** (mountains, portrait, city, forest, food, PNG)
- Or **upload** your own image
- Side-by-side original vs compressed
- Download the `.webp` / `.jpg` (or other format) result

## Recommended settings

| Goal | Options |
|------|---------|
| Best compression | `{ format: 'image/pixu', enableSmartQuality: true }` |
| Web photos | `{ preset: 'web' }` |
| Social media | `{ preset: 'social-media', maxWidth: 1080 }` |
| Thumbnails | `{ preset: 'thumbnail' }` |

## Component code

```vue
<template>
  <PixuCompressor
    :samples="sampleImages"
    :options="{
      format: 'image/pixu',
      enableSmartQuality: true,
      stripMetadata: true,
    }"
    @compress="handleCompress"
  />
</template>
```

## Framework playgrounds

| Framework | Docs page | Local app |
|-----------|-----------|-----------|
| [Vue](/examples/vue) | live VueDemo | `:3000` |
| [React](/examples/react-example) | live ReactDemo | `:3001` |
| [Angular](/examples/angular) | live AngularDemo | `:4200` |
| [Svelte](/examples/svelte) | live SvelteDemo | `:3002` |
| [Jacaré](/examples/jacare) | code + API | `:3003` |

Build first: `npm run build` from the repo root.

## Next steps

- [TECR theory](/guide/theory/contextual-reconstructive-entropy)
- [PIXU Format](/guide/features/pixu-format)
- [All framework examples](/examples/)
- [API Reference](/api/compress)
