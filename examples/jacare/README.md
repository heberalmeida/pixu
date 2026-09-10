# Pixu × Jacaré Example

Image compression demo using [Pixu](https://github.com/heberalmeida/pixu) with [Jacaré](https://github.com/jacarejs/core) — fine-grained reactivity, zero Virtual DOM.

## Features

- Direct `import { compress, PIXU_EXTENSION } from 'pixu'`
- PIXU format (`image/pixu` → `.pixu` download)
- Sample images for instant demos
- Brand theme from the Pixu logo (purple + cyan)

## Run

```bash
cd ../..
npm run build

cd examples/jacare
npm install
npm run dev
```

Open `http://localhost:3003`

## Stack

- `@jacare/core` — signals, templates (`.jcr`)
- `@jacare/vite-plugin` — compile-time UI
- `pixu` — image compression (linked from repo root)
