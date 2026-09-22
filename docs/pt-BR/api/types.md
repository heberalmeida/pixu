# Tipos

Definições de tipos TypeScript completas do Pixu.

## CompressionOptions

```typescript
interface CompressionOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  width?: number;
  height?: number;
  resize?: ResizeMode;
  format?: SupportedFormat;
  stripMetadata?: boolean;
  fixOrientation?: boolean;
  mode?: CompressionMode;
  targetSize?: number;
  strategy?: CompressionStrategy;
  preset?: CompressionPreset;
  enableDualPass?: boolean;
  enableProgressive?: boolean;
  enableNoiseAware?: boolean;
  enableHdrToSdr?: boolean;
  enableColorWeighting?: boolean;
  enableSmartQuality?: boolean;
  useWorker?: boolean;
  workerOptions?: WorkerOptions;
  beforeProcess?: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  afterProcess?: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  onProgress?: (progress: number) => void;
  strict?: boolean;
  filters?: Array<ImageFilter | { type: ImageFilter; value?: number }>;
  convertToJPEG?: boolean;
  validateImage?: boolean;
  optimizePNG?: {
    enabled: boolean;
    reduceColors?: boolean;
    maxColors?: number;
    optimizeTransparency?: boolean;
  };
  smartCrop?: {
    enabled: boolean;
    width: number;
    height: number;
    focus?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  };
  watermark?: {
    text?: string;
    image?: HTMLImageElement | HTMLCanvasElement;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity?: number;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    padding?: number;
    scale?: number;
    rotation?: number;
    stroke?: boolean;
    strokeColor?: string;
  };
  preserveEXIF?: {
    preserve?: string[];
    remove?: string[];
    removeGPS?: boolean;
    preserveCopyright?: boolean;
  };
  enableProgressiveJPEG?: boolean;
  generateResponsive?: boolean;
  monitorPerformance?: boolean;
}
```

## CompressionResult

```typescript
interface CompressionResult {
  file: File | Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  format: string;
  width: number;
  height: number;
  metadata?: {
    hasExif: boolean;
    orientation?: number;
  };
  metrics?: CompressionMetrics;
}
```

## SupportedFormat

```typescript
type SupportedFormat =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | 'image/avif'
  | 'image/pixu'
  | 'auto';
```

| Valor | Extensão | Notas |
|-------|-----------|-------|
| `image/pixu` | `.pixu` | Formato proprietário — melhor compressão |
| `image/webp` | `.webp` | Navegadores modernos |
| `image/avif` | `.avif` | Melhor formato padrão |
| `image/jpeg` | `.jpg` | Universal |
| `image/png` | `.png` | Transparência |
| `auto` | — | Prefere PIX, depois WebP |

## Constantes PIX

Exportadas de `pixu`:

```typescript
import { PIXU_MIME_TYPE, PIXU_EXTENSION, isPixSupported } from 'pixu';

PIXU_MIME_TYPE;   // "image/pixu"
PIXU_EXTENSION;   // ".pixu"
isPixSupported(); // true
```

Use ao nomear downloads:

```typescript
const ext = result.format === PIXU_MIME_TYPE ? PIXU_EXTENSION : '.jpg';
```

## ResizeMode

```typescript
type ResizeMode = 'none' | 'contain' | 'cover' | 'fit' | 'fill';
```

## CompressionMode

```typescript
type CompressionMode = 'quality' | 'size' | 'adaptive';
```

## CompressionStrategy

```typescript
type CompressionStrategy = 'balanced' | 'aggressive' | 'conservative' | 'smart';
```

## CompressionPreset

```typescript
type CompressionPreset = 'social-media' | 'print' | 'web' | 'thumbnail' | 'email';
```

## ImageFilter

```typescript
type ImageFilter = 'grayscale' | 'sepia' | 'vintage' | 'brightness' | 'contrast' | 'saturation' | 'blur' | 'sharpen';
```
