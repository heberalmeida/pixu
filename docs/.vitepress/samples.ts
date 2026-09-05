export interface DocSampleImage {
  id: string
  label: string
  url: string
  file: string
}

export const docSampleImages: DocSampleImage[] = [
  { id: 'landscape', label: 'Mountains', url: '/photo-landscape.jpg', file: 'photo-landscape.jpg' },
  { id: 'portrait', label: 'Portrait', url: '/photo-portrait.jpg', file: 'photo-portrait.jpg' },
  { id: 'city', label: 'City', url: '/photo-city.jpg', file: 'photo-city.jpg' },
  { id: 'nature', label: 'Forest', url: '/photo-nature.jpg', file: 'photo-nature.jpg' },
  { id: 'food', label: 'Food', url: '/photo-food.jpg', file: 'photo-food.jpg' },
  { id: 'graphic', label: 'PNG Graphic', url: '/graphic-transparent.png', file: 'graphic-transparent.png' },
]

export async function fetchDocSample(sample: DocSampleImage): Promise<File> {
  const res = await fetch(sample.url)
  if (!res.ok) throw new Error(`Failed to load ${sample.label}`)
  const blob = await res.blob()
  return new File([blob], sample.file, { type: blob.type || 'image/jpeg' })
}
