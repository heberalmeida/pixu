export function extensionForFormat(format?: string | null): string {
  const type = String(format || 'image/jpeg').toLowerCase()
  if (type === 'image/pixu' || type === 'image/pix') return '.webp'
  if (type === 'image/jpeg' || type === 'image/jpg') return '.jpg'
  if (type === 'image/png') return '.png'
  if (type === 'image/webp') return '.webp'
  if (type === 'image/avif') return '.avif'
  if (type.includes('/')) {
    const sub = type.split('/')[1] || ''
    if (sub === 'jpeg') return '.jpg'
    return sub ? `.${sub}` : '.jpg'
  }
  return type.startsWith('.') ? type : `.${type || 'jpg'}`
}

export function downloadCompressed(
  file: File | Blob,
  name: string,
  format?: string | null
): void {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  const base = String(name || 'compressed').replace(/\.[^.]+$/, '')
  a.download = `${base}${extensionForFormat(format || file.type)}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function downloadAsWebpOrJpeg(
  file: File | Blob,
  name: string,
  format: 'image/webp' | 'image/jpeg'
): Promise<void> {
  const { downloadImageAs } = await import('pixu')
  await downloadImageAs(file, name, format)
}

export function formatLabel(format?: string | null): string {
  return extensionForFormat(format).replace(/^\./, '').toUpperCase()
}

export function downloadLabel(format?: string | null): string {
  return `Download (${extensionForFormat(format)})`
}
