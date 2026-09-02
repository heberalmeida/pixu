export type ImageFilter = 
  | 'grayscale' 
  | 'sepia' 
  | 'vintage' 
  | 'brightness' 
  | 'contrast' 
  | 'saturation' 
  | 'blur' 
  | 'sharpen';

export interface FilterOptions {
  type: ImageFilter;
  value?: number; // 0-1 for brightness/contrast/saturation, 0-10 for blur/sharpen
}

export function applyFilter(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  filter: ImageFilter | FilterOptions,
  value?: number
): void {
  let filterType: ImageFilter;
  let filterValue: number;

  if (typeof filter === 'string') {
    filterType = filter;
    filterValue = value ?? 1;
  } else {
    filterType = filter.type;
    filterValue = filter.value ?? 1;
  }

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  switch (filterType) {
    case 'grayscale':
      applyGrayscale(data);
      break;
    case 'sepia':
      applySepia(data);
      break;
    case 'vintage':
      applyVintage(data);
      break;
    case 'brightness':
      applyBrightness(data, filterValue);
      break;
    case 'contrast':
      applyContrast(data, filterValue);
      break;
    case 'saturation':
      applySaturation(data, filterValue);
      break;
    case 'blur':
      // Blur is applied via CSS filter, not pixel manipulation
      context.filter = `blur(${filterValue}px)`;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.filter = 'none';
        context.drawImage(tempCanvas, 0, 0);
      }
      return;
    case 'sharpen':
      applySharpen(context, canvas, filterValue);
      return;
  }

  context.putImageData(imageData, 0, 0);
}

function applyGrayscale(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
}

function applySepia(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
  }
}

function applyVintage(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    // Slight desaturation
    const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
    data[i] = Math.min(255, data[i] * 0.7 + gray * 0.3);
    data[i + 1] = Math.min(255, data[i + 1] * 0.7 + gray * 0.3);
    data[i + 2] = Math.min(255, data[i + 2] * 0.7 + gray * 0.3);
    
    // Add warm tone
    data[i] = Math.min(255, data[i] * 1.1);
    data[i + 2] = Math.min(255, data[i + 2] * 0.9);
  }
}

function applyBrightness(data: Uint8ClampedArray, value: number): void {
  const factor = (value - 0.5) * 2; // -1 to 1
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, data[i] + factor * 128));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + factor * 128));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + factor * 128));
  }
}

function applyContrast(data: Uint8ClampedArray, value: number): void {
  const factor = (value - 0.5) * 2; // -1 to 1
  const intercept = 128 * (1 - factor);
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, data[i] * factor + intercept));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * factor + intercept));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * factor + intercept));
  }
}

function applySaturation(data: Uint8ClampedArray, value: number): void {
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = Math.max(0, Math.min(255, gray + (data[i] - gray) * value));
    data[i + 1] = Math.max(0, Math.min(255, gray + (data[i + 1] - gray) * value));
    data[i + 2] = Math.max(0, Math.min(255, gray + (data[i + 2] - gray) * value));
  }
}

function applySharpen(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  value: number
): void {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  
  // Simple sharpen kernel
  const kernel = [
    0, -value, 0,
    -value, 1 + 4 * value, -value,
    0, -value, 0
  ];
  
  const tempData = new Uint8ClampedArray(data);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            const k = kernel[(ky + 1) * 3 + (kx + 1)];
            sum += tempData[idx] * k;
          }
        }
        const idx = (y * width + x) * 4 + c;
        data[idx] = Math.max(0, Math.min(255, sum));
      }
    }
  }
  
  context.putImageData(imageData, 0, 0);
}

