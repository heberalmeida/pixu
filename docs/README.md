# Pixu Documentation

VitePress site for the Pixu image compression library.

## Development

```bash
npm run build          # build pixu library first
npm run dev            # start docs at http://localhost:5173
```

## Build & Preview

```bash
npm run docs:build
npm run docs:preview   # http://localhost:4173
```

## Structure

| Path | Content |
|------|---------|
| `/` | Home  hero, features, live demo |
| `/demo` | Interactive Vue component demo |
| `/guide/*` | Getting started, features, components |
| `/api/*` | compress, compressBatch, types |
| `/examples/` | Framework projects hub |
| `/examples/basic` | Vanilla JS code patterns |

## Key Pages

- [Getting Started](/guide/getting-started)
- [PIXU Format](/guide/features/pixu-format)
- [Framework Examples](/examples/)
- [Vue Component](/guide/components/vue)
- [API Types](/api/types)

## Assets

- Logo: `docs/public/logo.png`
- Library bundle for demos: `docs/public/pixu.esm.js` (copied on `docs:build`)

## Routes

Use paths **without** `.html`:

- `/examples/vue`
- `/examples/vue.html`
