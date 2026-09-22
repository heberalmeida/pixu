# validateImage

Validate an image before compression — format, dimensions, and basic integrity.

## Signature

```typescript
function validateImage(file: File | Blob): Promise<ImageValidationResult>

function isValidImage(file: File | Blob): Promise<boolean>
```

## Parameters

### `file`

`File | Blob` — candidate image.

## Returns

### `ImageValidationResult`

```typescript
interface ImageValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  actualFormat?: string
  declaredFormat?: string
  dimensions?: { width: number; height: number }
  fileSize?: number
}
```

| Field | Description |
|-------|-------------|
| `isValid` | `true` when there are no hard errors |
| `errors` | Blocking issues (corrupt, not an image, …) |
| `warnings` | Soft issues (MIME mismatch, huge dimensions, …) |
| `actualFormat` | Detected MIME / codec |
| `declaredFormat` | `file.type` when available |
| `dimensions` | Natural width/height when decodable |
| `fileSize` | Byte length |

`isValidImage(file)` is equivalent to `(await validateImage(file)).isValid`.

## Examples

### Gate compression

```typescript
import { validateImage, compress } from 'pixu'

const validation = await validateImage(file)

if (!validation.isValid) {
  throw new Error(validation.errors.join('; '))
}

for (const warning of validation.warnings) {
  console.warn(warning)
}

const result = await compress(file, { quality: 0.8 })
```

### Shorthand

```typescript
import { isValidImage, compress } from 'pixu'

if (await isValidImage(file)) {
  await compress(file)
}
```

### Via compress options

```typescript
await compress(file, {
  validateImage: true,
  quality: 0.8,
})
```

## Related

- [analyzeImage](/api/analyze-image) — content recommendations
- [compress](/api/compress)
