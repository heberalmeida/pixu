# validateImage

Validate an image file before compression.

## Signature

```typescript
function validateImage(
  file: File | Blob
): Promise<ImageValidationResult>
```

## Parameters

### file

Type: `File | Blob`

The image file to validate.

## Returns

Type: `Promise<ImageValidationResult>`

Validation result with:
- `isValid: boolean`
- `errors: string[]`
- `warnings: string[]`
- `actualFormat?: string`
- `declaredFormat?: string`
- `dimensions?: { width: number; height: number }`
- `fileSize?: number`

## Example

```typescript
import { validateImage } from 'pixu';

const validation = await validateImage(file);

if (validation.isValid) {
  console.log('Image is valid');
  console.log('Dimensions:', validation.dimensions);
  console.log('Format:', validation.actualFormat);
} else {
  console.error('Validation errors:', validation.errors);
}

if (validation.warnings.length > 0) {
  console.warn('Warnings:', validation.warnings);
}
```

## Shorthand

```typescript
import { isValidImage } from 'pixu';

const isValid = await isValidImage(file);
if (isValid) {
  const result = await compress(file);
}
```

