# Progressive JPEG

Detecta buffers JPEG progressivos e suporte do browser.

## Assinatura

```typescript
function isProgressiveJPEG(buffer: ArrayBuffer): boolean
function supportsProgressiveJPEG(): boolean
```

## Example

```typescript
import { isProgressiveJPEG, supportsProgressiveJPEG, compress } from '@pantanal/pixu'

if (supportsProgressiveJPEG()) {
  await compress(file, {
    format: 'image/jpeg',
    enableProgressiveJPEG: true,
  })
}

const buf = await file.arrayBuffer()
console.log(isProgressiveJPEG(buf))
```
