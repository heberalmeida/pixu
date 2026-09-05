# Installation

## NPM

```bash
npm install pixu
```

## Yarn

```bash
yarn add pixu
```

## PNPM

```bash
pnpm add pixu
```

## CDN

```html
<script type="module">
  import { compress } from 'https://cdn.jsdelivr.net/npm/pixu@latest/dist/pixu.esm.js';
</script>
```

## TypeScript

Pixu includes full TypeScript definitions. No additional type packages needed.

```typescript
import { compress, CompressionOptions, CompressionResult } from 'pixu';
```

## Browser Support

Pixu works in all modern browsers:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Node.js

Pixu can be used in Node.js environments with canvas support:

```bash
npm install canvas
```

```typescript
import { compress } from 'pixu';
```

## Bundle Size

- ESM: ~46KB
- UMD: ~32KB
- Worker: ~35KB
- Gzipped: ~10KB

