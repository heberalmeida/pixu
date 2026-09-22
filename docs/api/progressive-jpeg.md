# Progressive JPEG

Detect progressive JPEG buffers and browser support.

## Signature

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
