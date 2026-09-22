# Instalação

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

O Pixu inclui definições TypeScript completas. Não é necessário nenhum pacote de tipos adicional.

```typescript
import { compress, CompressionOptions, CompressionResult } from 'pixu';
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
import { compress } from 'pixu';
```

## Tamanho do bundle

- ESM: ~46KB
- UMD: ~32KB
- Worker: ~35KB
- Gzipped: ~10KB
