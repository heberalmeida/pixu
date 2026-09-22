export interface ConversionOptions {
  backgroundColor?: string; // For PNG to JPEG conversion
  detectTransparency?: boolean;
}

export async function convertFormat(
  image: HTMLImageElement | HTMLCanvasElement,
  targetFormat: string,
  options: ConversionOptions = {}
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  
  if (image instanceof HTMLImageElement) {
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
  } else {
    canvas.width = image.width;
    canvas.height = image.height;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // For PNG to JPEG conversion, fill with background color
  if (targetFormat === 'image/jpeg' || targetFormat === 'image/jpg') {
    const bgColor = options.backgroundColor || '#ffffff';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw image
  if (image instanceof HTMLImageElement) {
    ctx.drawImage(image, 0, 0);
  } else {
    ctx.drawImage(image, 0, 0);
  }

  return canvas;
}

export async function detectTransparency(
  image: HTMLImageElement | HTMLCanvasElement
): Promise<boolean> {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  
  if (image instanceof HTMLImageElement) {
    canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx = canvas.getContext('2d');
    if (!ctx) {
      return false;
    }
    ctx.drawImage(image, 0, 0);
  } else {
    canvas = image;
    ctx = canvas.getContext('2d');
    if (!ctx) {
      return false;
    }
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Sample pixels to check for transparency
  const sampleRate = 100;
  for (let i = 3; i < data.length; i += 4 * sampleRate) {
    if (data[i] < 255) {
      return true; // Found transparent pixel
    }
  }

  return false;
}

export function shouldConvertToJPEG(
  currentFormat: string,
  hasTransparency: boolean,
  fileSize: number
): boolean {
  // Don't convert if already JPEG
  if (currentFormat === 'image/jpeg' || currentFormat === 'image/jpg') {
    return false;
  }

  // Don't convert PNG with transparency (unless explicitly requested)
  if (currentFormat === 'image/png' && hasTransparency) {
    return false;
  }

  // Convert large PNG files to JPEG
  if (currentFormat === 'image/png' && fileSize > 500000) {
    return true;
  }

  return false;
}

