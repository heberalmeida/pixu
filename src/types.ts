export type SupportedFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif' | 'image/pixu' | 'auto';

export type ResizeMode = 'none' | 'contain' | 'cover' | 'fit' | 'fill';

export type CompressionMode = 'quality' | 'size' | 'adaptive';

export type CompressionStrategy = 'balanced' | 'aggressive' | 'conservative' | 'smart';
export type CompressionPreset = 'social-media' | 'print' | 'web' | 'thumbnail' | 'email';
export type ImageFilter = 'grayscale' | 'sepia' | 'vintage' | 'brightness' | 'contrast' | 'saturation' | 'blur' | 'sharpen';

export interface CompressionOptions {
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
  preset?: CompressionPreset; // Apply preset configuration
  enableDualPass?: boolean;
  enableProgressive?: boolean;
  enableNoiseAware?: boolean;
  enableHdrToSdr?: boolean;
  enableColorWeighting?: boolean;
  enableSmartQuality?: boolean; // Auto-detect optimal quality based on content
  useWorker?: boolean;
  workerOptions?: WorkerOptions;
  beforeProcess?: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  afterProcess?: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  onProgress?: (progress: number) => void;
  strict?: boolean; // Return original file if compressed is larger (default: true)
  filters?: Array<ImageFilter | { type: ImageFilter; value?: number }>; // Apply image filters
  convertToJPEG?: boolean; // Auto-convert PNG to JPEG if beneficial
  validateImage?: boolean; // Validate image before compression (default: false)
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
  };
  preserveEXIF?: {
    preserve?: string[];
    remove?: string[];
    removeGPS?: boolean;
    preserveCopyright?: boolean;
  };
  enableProgressiveJPEG?: boolean; // Attempt to create progressive JPEG
  generateResponsive?: boolean; // Generate multiple sizes for responsive images
  monitorPerformance?: boolean; // Track compression metrics
}

export interface CompressionResult {
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
}

export interface BatchCompressionOptions extends CompressionOptions {
  concurrency?: number;
  onItemComplete?: (result: CompressionResult, index: number) => void;
  onItemError?: (error: Error, index: number) => void;
}

export interface StreamCompressionOptions extends CompressionOptions {
  chunkSize?: number;
  onChunk?: (chunk: Blob, index: number) => void;
}

export interface Plugin {
  name: string;
  version: string;
  beforeCompress?: (file: File | Blob, options: CompressionOptions) => Promise<File | Blob> | File | Blob;
  afterCompress?: (result: CompressionResult, options: CompressionOptions) => Promise<CompressionResult> | CompressionResult;
  transform?: (canvas: HTMLCanvasElement, options: CompressionOptions) => Promise<void> | void;
}

export interface WorkerMessage {
  id: string;
  type: 'compress' | 'batch' | 'abort';
  payload?: {
    file: ArrayBuffer;
    fileName: string;
    fileType: string;
    options: CompressionOptions;
  };
}

export interface WorkerResponse {
  id: string;
  type: 'success' | 'error' | 'progress';
  payload?: CompressionResult | Error | number;
}

