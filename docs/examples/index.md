# Framework Examples

Runnable projects that share the **same documentation layout** as this site — header, sample gallery, section cards, brand purple — plus live demos below.

## Live demos (in this page)

### PIXU compress

<CompressionDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

### Vue component

<VueDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

### React / Angular / Svelte APIs

<ReactDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

## Before you run local apps

```bash
npm run build
```

Then open any example folder, install, and start the dev server.

## Available projects

| Framework | Folder | Dev server | Docs |
|-----------|--------|------------|------|
| **Vue 3** | `examples/vue/` | `:3000` | [Vue](/examples/vue) |
| **React** | `examples/react/` | `:3001` | [React](/examples/react-example) |
| **Angular** | `examples/angular/` | `:4200` | [Angular](/examples/angular) |
| **Svelte** | `examples/svelte/` | `:3002` | [Svelte](/examples/svelte) |
| **Jacaré** | `examples/jacare/` | `:3003` | [Jacaré](/examples/jacare) |

### Vue 3

```bash
cd examples/vue && npm install && npm run dev
```

### React

```bash
cd examples/react && npm install && npm run dev
```

### Angular

```bash
cd examples/angular && npm install && npm start
```

### Svelte

```bash
cd examples/svelte && npm install && npm run dev
```

### Jacaré

```bash
cd examples/jacare && npm install && npm run dev
```

## Shared layout

All apps use `examples/shared/theme.css` — the same documentation chrome as VitePress:

- Content width ~960px
- Header + logo
- Sample gallery
- Section cards
- Brand purple `#7b3fef`

Sample photos live in `examples/shared/assets/` (also copied to `docs/public/` for these live demos).

## Importing Pixu

```typescript
import { compress, PIXU_EXTENSION } from 'pixu'
```

## Best compression recipe

```typescript
const result = await compress(file, {
  format: 'image/pixu',
  enableSmartQuality: true,
})
```

See [PIXU Format](/guide/features/pixu-format) and [TECR](/guide/theory/contextual-reconstructive-entropy).
