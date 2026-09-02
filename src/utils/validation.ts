export interface ImageValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  actualFormat?: string;
  declaredFormat?: string;
  dimensions?: { width: number; height: number };
  fileSize?: number;
}

export async function validateImage(file: File | Blob): Promise<ImageValidationResult> {
  const result: ImageValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  // Check file size
  if (file.size === 0) {
    result.isValid = false;
    result.errors.push('File is empty');
    return result;
  }

  result.fileSize = file.size;

  // Check declared type
  const declaredType = file.type || '';
  result.declaredFormat = declaredType;

  if (!declaredType || !declaredType.startsWith('image/')) {
    result.warnings.push('File type not declared or not an image');
  }

  // Try to load image
  try {
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Image loading timeout'));
      }, 5000);

      img.onload = () => {
        clearTimeout(timeout);
        result.dimensions = {
          width: img.naturalWidth,
          height: img.naturalHeight,
        };

        // Validate dimensions
        if (img.naturalWidth <= 0 || img.naturalHeight <= 0) {
          result.isValid = false;
          result.errors.push('Invalid image dimensions');
        }

        // Check if dimensions are reasonable
        if (img.naturalWidth > 16384 || img.naturalHeight > 16384) {
          result.warnings.push('Image dimensions are very large (>16K pixels)');
        }

        // Detect actual format from data URL
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          try {
            const dataURL = canvas.toDataURL();
            if (dataURL.startsWith('data:image/')) {
              result.actualFormat = dataURL.split(';')[0].split(':')[1];
            }
          } catch {
            // Ignore
          }
        }

        URL.revokeObjectURL(url);
        resolve();
      };

      img.onerror = () => {
        clearTimeout(timeout);
        result.isValid = false;
        result.errors.push('Failed to load image - file may be corrupted');
        URL.revokeObjectURL(url);
        reject(new Error('Image load failed'));
      };

      img.src = url;
    });

    // Check format mismatch
    if (result.actualFormat && result.declaredFormat) {
      if (result.actualFormat !== result.declaredFormat) {
        result.warnings.push(
          `Format mismatch: declared as ${result.declaredFormat}, actual format is ${result.actualFormat}`
        );
      }
    }

  } catch (error) {
    result.isValid = false;
    result.errors.push(
      error instanceof Error ? error.message : 'Unknown validation error'
    );
  }

  return result;
}

export function isValidImage(file: File | Blob): Promise<boolean> {
  return validateImage(file).then((result) => result.isValid);
}

