import { PIXU_MIME_TYPE } from './pixu-format';

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
