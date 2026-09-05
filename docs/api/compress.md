# compress

Compress a single image file.

## Signature

```typescript
function compress(
  file: File | Blob,
  options?: CompressionOptions
): Promise<CompressionResult>
```

## Parameters

### file

Type: `File | Blob`

The image file to compress.

### options

Type: `CompressionOptions`

Compression options. See [CompressionOptions](/api/types#compressionoptions).

## Returns

Type: `Promise<CompressionResult>`

A promise that resolves to a compression result. See [CompressionResult](/api/types#compressionresult).

## Example

<CompressionDemo :options="{ quality: 0.8, maxWidth: 1920, maxHeight: 1080 }" />

```typescript
import { compress } from 'pixu';

const fileInput = document.querySelector('input[type="file"]');

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const result = await compress(file, {
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
    });

    console.log(`Compressed from ${result.originalSize} to ${result.compressedSize} bytes`);
  } catch (error) {
    console.error('Compression failed:', error);
  }
});
```

## Error Handling

```typescript
try {
  const result = await compress(file, options);
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  }
}
```

## Common Errors

- `File must be an image` - The provided file is not a valid image
- `Invalid image dimensions` - The image has invalid dimensions
- `Compression was aborted` - Compression was aborted
- `Compression already in progress` - Another compression is in progress

