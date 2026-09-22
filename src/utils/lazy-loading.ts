export interface ResponsiveImageSet {
  srcset: string;
  sizes: string;
  src: string;
  formats: Array<{
    format: string;
    srcset: string;
    sizes: string;
  }>;
}

export interface LazyLoadOptions {
  widths: number[]; // Array of widths to generate
  formats?: string[]; // Formats to generate (default: ['webp', 'jpeg'])
  quality?: number;
  baseName?: string;
}

export async function generateResponsiveImages(
  file: File | Blob,
  options: LazyLoadOptions
): Promise<ResponsiveImageSet> {
  const widths = options.widths || [320, 640, 960, 1280, 1920];
  const formats = options.formats || ['image/webp', 'image/jpeg'];

  const srcsetEntries: string[] = [];
  const formatSets: Array<{ format: string; srcset: string; sizes: string }> = [];

  for (const format of formats) {
    const formatSrcset: string[] = [];
    
    for (const width of widths) {
      // In real implementation, would compress at each width
      // For now, return placeholder structure
      formatSrcset.push(`image-${width}w.${format.split('/')[1]} ${width}w`);
    }

    formatSets.push({
      format,
      srcset: formatSrcset.join(', '),
      sizes: '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 960px) 960px, 1280px',
    });
  }

  return {
    srcset: srcsetEntries.join(', '),
    sizes: '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 960px) 960px, 1280px',
    src: '', // Default/fallback src
    formats: formatSets,
  };
}

export function generateSrcset(
  images: Array<{ url: string; width: number }>
): string {
  return images.map(img => `${img.url} ${img.width}w`).join(', ');
}

export function generateSizes(breakpoints: number[]): string {
  const sizes: string[] = [];
  for (let i = 0; i < breakpoints.length - 1; i++) {
    sizes.push(`(max-width: ${breakpoints[i]}px) ${breakpoints[i]}px`);
  }
  sizes.push(`${breakpoints[breakpoints.length - 1]}px`);
  return sizes.join(', ');
}

