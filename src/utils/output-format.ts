import { canvasToBlob } from './canvas';
import { createPreviewObjectURL, isPixuBlob, PIXU_MIME_TYPE } from './pixu-format';

export type DownloadImageFormat = 'image/webp' | 'image/jpeg';

export const DOWNLOAD_IMAGE_FORMATS: readonly DownloadImageFormat[] = [
  'image/webp',
  'image/jpeg',
] as const;

const EXTENSION_BY_FORMAT: Record<string, string> = {
  [PIXU_MIME_TYPE]: '.webp',
  'image/pix': '.webp',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/gif': '.gif',
};

export function getOutputExtension(format?: string | null): string {
  const type = String(format || 'image/jpeg').toLowerCase().trim();
  if (EXTENSION_BY_FORMAT[type]) {
    return EXTENSION_BY_FORMAT[type];
  }
  if (type.includes('/')) {
    const sub = type.split('/')[1] || '';
    if (sub === 'jpeg') return '.jpg';
    return sub ? `.${sub}` : '.jpg';
  }
  if (type.startsWith('.')) return type;
  return type ? `.${type}` : '.jpg';
}

export function buildDownloadName(
  baseName: string,
  format?: string | null
): string {
  const base = String(baseName || 'compressed').replace(/\.[^.]+$/, '');
  return `${base}${getOutputExtension(format)}`;
}

function sameDownloadFormat(fileType: string, format: DownloadImageFormat): boolean {
  const type = (fileType || '').toLowerCase();
  if (format === 'image/webp') return type === 'image/webp';
  return type === 'image/jpeg' || type === 'image/jpg';
}

export async function toDownloadableBlob(
  file: Blob,
  format: DownloadImageFormat,
  quality = 0.92
): Promise<Blob> {
  if (!isPixuBlob(file) && sameDownloadFormat(file.type, format)) {
    return file;
  }

  const url = await createPreviewObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to decode image for download'));
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(image, 0, 0);
    return canvasToBlob(canvas, format, quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function triggerBlobDownload(file: Blob, fileName: string): void {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadImageAs(
  file: Blob,
  baseName: string,
  format: DownloadImageFormat,
  quality = 0.92
): Promise<void> {
  const blob = await toDownloadableBlob(file, format, quality);
  triggerBlobDownload(blob, buildDownloadName(baseName, format));
}
