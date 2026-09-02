export interface SmartCropOptions {
  width: number;
  height: number;
  focus?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  minContent?: number; // Minimum content area to preserve (0-1)
}

export interface CropResult {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function calculateSmartCrop(
  canvas: HTMLCanvasElement,
  options: SmartCropOptions
): CropResult {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { x: 0, y: 0, width: canvas.width, height: canvas.height };
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  // Calculate center of mass (weighted by brightness/contrast)
  let totalWeight = 0;
  let weightedX = 0;
  let weightedY = 0;

  // Sample pixels for performance
  const sampleRate = 5;
  for (let y = 0; y < height; y += sampleRate) {
    for (let x = 0; x < width; x += sampleRate) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      if (a < 128) continue; // Skip transparent/low opacity

      // Calculate brightness and contrast (weight)
      const brightness = (r + g + b) / 3;
      
      // Check local contrast (edge detection)
      let contrast = 0;
      if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
        const rightIdx = (y * width + (x + 1)) * 4;
        const bottomIdx = ((y + 1) * width + x) * 4;
        contrast = Math.abs(
          (data[rightIdx] + data[rightIdx + 1] + data[rightIdx + 2]) / 3 - brightness
        ) + Math.abs(
          (data[bottomIdx] + data[bottomIdx + 1] + data[bottomIdx + 2]) / 3 - brightness
        );
      }

      const weight = brightness * 0.5 + contrast * 0.5;
      totalWeight += weight;
      weightedX += x * weight;
      weightedY += y * weight;
    }
  }

  // Calculate center of mass
  const centerX = totalWeight > 0 ? weightedX / totalWeight : width / 2;
  const centerY = totalWeight > 0 ? weightedY / totalWeight : height / 2;

  // Apply focus preference
  let focusX = centerX;
  let focusY = centerY;

  switch (options.focus) {
    case 'top':
      focusY = height * 0.25;
      break;
    case 'bottom':
      focusY = height * 0.75;
      break;
    case 'left':
      focusX = width * 0.25;
      break;
    case 'right':
      focusX = width * 0.75;
      break;
    case 'center':
    default:
      // Use calculated center
      break;
  }

  // Calculate crop area
  const aspectRatio = options.width / options.height;
  const sourceAspectRatio = width / height;

  let cropWidth: number;
  let cropHeight: number;

  if (aspectRatio > sourceAspectRatio) {
    cropHeight = height;
    cropWidth = height * aspectRatio;
  } else {
    cropWidth = width;
    cropHeight = width / aspectRatio;
  }

  // Ensure crop doesn't exceed image bounds
  cropWidth = Math.min(cropWidth, width);
  cropHeight = Math.min(cropHeight, height);

  // Center crop around focus point
  let cropX = focusX - cropWidth / 2;
  let cropY = focusY - cropHeight / 2;

  // Clamp to image bounds
  cropX = Math.max(0, Math.min(cropX, width - cropWidth));
  cropY = Math.max(0, Math.min(cropY, height - cropHeight));

  return {
    x: Math.floor(cropX),
    y: Math.floor(cropY),
    width: Math.floor(cropWidth),
    height: Math.floor(cropHeight),
  };
}

