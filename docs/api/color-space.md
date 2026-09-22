# Color space

Helpers for sRGB normalization and wide-gamut detection.

## Signature

```typescript
interface ColorSpaceInfo {
  isSRGB: boolean
  hasColorProfile: boolean
  gamma?: number
  needsConversion: boolean
}

function analyzeColorSpace(canvas: HTMLCanvasElement): ColorSpaceInfo
function normalizeToSRGB(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void
function supportsWideGamut(): boolean
```

## Example

```typescript
import { analyzeColorSpace, normalizeToSRGB, supportsWideGamut } from '@pantanal/pixu'

if (supportsWideGamut()) {
  console.log('Display may be wide-gamut')
}

const info = analyzeColorSpace(canvas)
if (info.needsConversion) {
  normalizeToSRGB(ctx, canvas)
}
```
