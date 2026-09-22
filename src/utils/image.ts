export function isImageType(mimeType: string): boolean {
  if (!mimeType || typeof mimeType !== 'string') {
    return false;
  }
  // Normalize jpg to jpeg
  const normalized = mimeType.toLowerCase().replace(/^image\/jpg$/, 'image/jpeg');
  // Include PIX format
  if (normalized === 'image/pixu' || normalized === 'image/pix') {
    return true;
  }
  return /^image\/(jpeg|png|webp|avif|gif|bmp|svg\+xml)$/i.test(normalized);
}

export function getImageExtension(mimeType: string): string {
  // Normalize jpg to jpeg
  const normalized = mimeType.toLowerCase().replace(/^image\/jpg$/, 'image/jpeg');
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/avif': '.avif',
    'image/pixu': '.webp',
    'image/pix': '.webp',
    'image/gif': '.gif',
    'image/bmp': '.bmp',
  };
  return map[normalized] || '.jpg';
}

export function formatToMimeType(format: string): string {
  if (format === 'auto') {
    return '';
  }
  return format;
}

// Cache for format support to avoid repeated canvas creation
let formatSupportCache: Map<string, boolean> | null = null;
let formatCheckInProgress = false;

export function isFormatSupported(format: string): boolean {
  if (format === 'auto') return true;
  
  // Prevent recursive calls
  if (formatCheckInProgress) {
    return false;
  }
  
  // Initialize cache if needed
  if (formatSupportCache === null) {
    formatSupportCache = new Map();
  }
  
  // Check cache first
  if (formatSupportCache.has(format)) {
    return formatSupportCache.get(format)!;
  }
  
  // Check if we're in a browser environment
  if (typeof document === 'undefined' || typeof HTMLCanvasElement === 'undefined') {
    formatSupportCache.set(format, false);
    return false;
  }
  
  formatCheckInProgress = true;
  let supported = false;
  
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 1;
      canvas.height = 1;
      const dataURL = canvas.toDataURL(format);
      supported = dataURL.startsWith(`data:${format}`);
    }
  } catch {
    supported = false;
  } finally {
    formatCheckInProgress = false;
  }
  
  // Cache the result
  formatSupportCache.set(format, supported);
  return supported;
}

export function getOptimalFormat(originalFormat: string): string {
  // Normalize input
  if (!originalFormat || originalFormat === 'auto' || (typeof originalFormat === 'string' && originalFormat.trim() === '')) {
    return 'image/jpeg';
  }
  
  // Ensure it's a valid image format
  if (typeof originalFormat !== 'string' || !originalFormat.startsWith('image/')) {
    return 'image/jpeg';
  }
  
  // Simple heuristic: prefer WebP if original is JPEG/PNG, otherwise keep original
  // Only check WebP support once to avoid stack issues
  if (originalFormat === 'image/jpeg' || originalFormat === 'image/png') {
    try {
      if (isFormatSupported('image/webp')) {
        return 'image/webp';
      }
    } catch (e) {
      // If check fails, fall through to original
    }
  }
  
  // Fallback to original format if it's valid, otherwise JPEG
  if (isImageType(originalFormat)) {
    return originalFormat;
  }
  
  return 'image/jpeg';
}

export function createImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // Prevent infinite loops by checking if we're already loading
    if (typeof document === 'undefined') {
      reject(new Error('Not in browser environment'));
      return;
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    let resolved = false;
    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
    };
    
    // Set timeout to prevent hanging
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        reject(new Error('Image loading timeout'));
      }
    }, 30000);
    
    img.onload = () => {
      clearTimeout(timeout);
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(img);
      }
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      if (!resolved) {
        resolved = true;
        cleanup();
        reject(new Error('Failed to load image'));
      }
    };
    
    img.src = src;
  });
}

export function getImageDimensions(file: File | Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to read image dimensions'));
    };
    
    img.src = url;
  });
}

