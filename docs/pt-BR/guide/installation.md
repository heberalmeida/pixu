# Instalação

## NPM

```bash
npm install @pantanal/pixu
```

## Yarn

```bash
yarn add @pantanal/pixu
```

## PNPM

```bash
pnpm add @pantanal/pixu
```

## CDN

```html
<script type="module">
  import { compress } from 'https://cdn.jsdelivr.net/npm/@pantanal/pixu@latest/dist/pixu.esm.js';
</script>
```

## TypeScript

O Pixu inclui definições TypeScript completas. Não é necessário nenhum pacote de tipos adicional.

```typescript
import { compress, CompressionOptions, CompressionResult } from '@pantanal/pixu';
```

## Compatibilidade com navegadores

O Pixu funciona em todos os navegadores modernos:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Node.js

O Pixu pode ser usado em ambientes Node.js com suporte a canvas:

```bash
npm install canvas
```

```typescript
import { compress } from '@pantanal/pixu';
```

## Tamanho do bundle

- ESM: ~46KB
- UMD: ~32KB
- Worker: ~35KB
- Gzipped: ~10KB
