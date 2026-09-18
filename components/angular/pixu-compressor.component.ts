import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { CompressionOptions, CompressionResult } from 'pixu';

@Component({
  selector: 'pixu-compressor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pixu-compressor">
      <div *ngIf="!file" class="upload-area" (click)="triggerFileInput()" (dragover)="handleDragOver($event)" (drop)="handleDrop($event)">
        <input
          #fileInput
          type="file"
          (change)="handleFileChange($event)"
          accept="image/*"
          class="file-input"
          style="display: none;"
        />
        <div class="upload-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <p class="upload-text">Click or drag image here to compress</p>
          <p class="upload-hint">Supports JPEG, PNG, WEBP, AVIF, PIXU</p>
        </div>
        <div *ngIf="samples.length" class="sample-gallery" (click)="$event.stopPropagation()">
          <p class="sample-label">Or try a real sample</p>
          <div class="sample-grid">
            <button
              *ngFor="let sample of samples"
              type="button"
              class="sample-card"
              (click)="loadSample(sample)"
            >
              <img [src]="sample.url" [alt]="sample.label" loading="lazy" />
              <span>{{ sample.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="file" class="compression-container">
        <div class="image-preview-section">
          <div class="image-preview">
            <h4>Original</h4>
            <img [src]="originalUrl" alt="Original" />
            <div class="image-info">
              <span>{{ formatBytes(originalSize) }}</span>
              <span>{{ originalDimensions }}</span>
            </div>
          </div>
          <div class="image-preview" *ngIf="result">
            <h4>Compressed</h4>
            <img [src]="compressedUrl" alt="Compressed" />
            <div class="image-info">
              <span>{{ formatBytes(result.compressedSize) }}</span>
              <span>{{ result.width }}x{{ result.height }}</span>
            </div>
          </div>
        </div>

        <div *ngIf="loading" class="progress-section">
          <progress [value]="progressValue" max="1" class="progress-bar"></progress>
          <p class="progress-text">Compressing... {{ Math.round(progressValue * 100) }}%</p>
        </div>

        <div *ngIf="result" class="result-section">
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Compression Ratio</span>
              <span class="stat-value">{{ (result.compressionRatio * 100).toFixed(1) }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Size Reduction</span>
              <span class="stat-value">{{ formatBytes(originalSize - result.compressedSize) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Format</span>
              <span class="stat-value">{{ result.format }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Quality</span>
              <span class="stat-value">{{ qualityLabel }}</span>
            </div>
          </div>
          <div class="actions">
            <button (click)="downloadFile()" class="btn btn-primary">Download Compressed</button>
            <button (click)="reset()" class="btn btn-secondary">Compress Another</button>
          </div>
        </div>

        <div *ngIf="errorMessage" class="error-section">
          <p class="error-message">{{ errorMessage }}</p>
          <button (click)="reset()" class="btn btn-secondary">Try Again</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pixu-compressor {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }

    .upload-area {
      border: 2px dashed #e5e7eb;
      border-radius: 8px;
      padding: 3rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f9fafb;
    }

    .upload-area:hover {
      border-color: #3b82f6;
      background: #ffffff;
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .upload-content svg {
      color: #6b7280;
    }

    .upload-text {
      font-size: 1.1rem;
      font-weight: 500;
      color: #111827;
      margin: 0;
    }

    .upload-hint {
      font-size: 0.9rem;
      color: #6b7280;
      margin: 0;
    }

    .sample-gallery {
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid rgba(123, 63, 239, 0.25);
    }

    .sample-label {
      margin: 0 0 0.75rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #8b95a8;
    }

    .sample-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 0.65rem;
    }

    .sample-card {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      padding: 0.35rem;
      border: 1px solid rgba(123, 63, 239, 0.25);
      border-radius: 10px;
      background: transparent;
      cursor: pointer;
    }

    .sample-card:hover {
      border-color: #7b3fef;
      transform: translateY(-2px);
    }

    .sample-card img {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      border-radius: 6px;
    }

    .sample-card span {
      font-size: 0.72rem;
      font-weight: 600;
      color: #213547;
    }

    .compression-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .image-preview-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .image-preview {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .image-preview h4 {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 600;
      color: #111827;
    }

    .image-preview img {
      width: 100%;
      height: auto;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      max-height: 400px;
      object-fit: contain;
    }

    .image-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #6b7280;
    }

    .progress-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      border-radius: 4px;
    }

    .progress-text {
      text-align: center;
      font-size: 0.9rem;
      color: #6b7280;
      margin: 0;
    }

    .result-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 6px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #6b7280;
    }

    .stat-value {
      font-size: 1.1rem;
      font-weight: 600;
      color: #3b82f6;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-secondary {
      background: #f9fafb;
      color: #111827;
      border: 1px solid #e5e7eb;
    }

    .btn-secondary:hover {
      background: #f3f4f6;
    }

    .error-section {
      padding: 1.5rem;
      background: #fee2e2;
      border: 1px solid #ef4444;
      border-radius: 6px;
      text-align: center;
    }

    .error-message {
      color: #dc2626;
      margin: 0 0 1rem 0;
    }

    @media (max-width: 768px) {
      .image-preview-section {
        grid-template-columns: 1fr;
      }
      
      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }
      
      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class PixuCompressorComponent implements OnInit, OnDestroy {
  @Input() options: CompressionOptions = {};
  @Input() autoCompress: boolean = true;
  @Input() samples: { id: string; label: string; url: string; file: string }[] = [];
  @Output() compress = new EventEmitter<CompressionResult>();
  @Output() error = new EventEmitter<Error>();
  @Output() progress = new EventEmitter<number>();
  @Output() source = new EventEmitter<{ file: File; url: string }>();

  file: File | null = null;
  loading: boolean = false;
  progressValue: number = 0;
  errorMessage: string | null = null;
  result: CompressionResult | null = null;
  originalUrl: string | null = null;
  compressedUrl: string | null = null;
  originalSize: number = 0;
  originalDimensions: string = '';
  Math = Math;

  private compressFn: any = null;

  get qualityLabel(): string {
    const q = this.result?.metadata?.quality;
    if (q == null) return '—';
    return `${Math.round(q * 100)}%`;
  }

  async ngOnInit() {
    try {
      const module = await import('pixu');
      this.compressFn = module.compress;
    } catch (err) {
      console.error('Failed to load pixu:', err);
    }
  }

  ngOnDestroy() {
    if (this.originalUrl) {
      URL.revokeObjectURL(this.originalUrl);
    }
    if (this.compressedUrl) {
      URL.revokeObjectURL(this.compressedUrl);
    }
  }

  triggerFileInput() {
    const input = document.querySelector('.file-input') as HTMLInputElement;
    input?.click();
  }

  handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0];
    if (selectedFile) {
      this.processFile(selectedFile);
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    const droppedFile = event.dataTransfer?.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      this.processFile(droppedFile);
    }
  }

  async loadSample(sample: { id: string; label: string; url: string; file: string }) {
    const res = await fetch(sample.url);
    if (!res.ok) return;
    const blob = await res.blob();
    const file = new File([blob], sample.file, { type: blob.type || 'image/jpeg' });
    await this.processFile(file);
  }

  async processFile(selectedFile: File) {
    this.loading = true;
    this.errorMessage = null;
    this.progressValue = 0;
    this.result = null;

    if (this.originalUrl) {
      URL.revokeObjectURL(this.originalUrl);
      this.originalUrl = null;
    }
    if (this.compressedUrl) {
      URL.revokeObjectURL(this.compressedUrl);
      this.compressedUrl = null;
    }

    try {
      const buffer = await selectedFile.arrayBuffer();
      const type = selectedFile.type || 'image/jpeg';
      const previewBlob = new Blob([buffer.slice(0)], { type });
      const appPreviewBlob = new Blob([buffer.slice(0)], { type });
      const fileForCompress = new File([buffer.slice(0)], selectedFile.name, {
        type,
        lastModified: selectedFile.lastModified,
      });

      this.file = fileForCompress;
      this.originalUrl = URL.createObjectURL(previewBlob);
      this.originalSize = fileForCompress.size;
      this.source.emit({
        file: fileForCompress,
        url: URL.createObjectURL(appPreviewBlob),
      });

      if (!this.autoCompress) {
        this.loading = false;
        return;
      }

      if (!this.compressFn) {
        const module = await import('pixu');
        this.compressFn = module.compress;
      }

      const compressionResult = await this.compressFn(fileForCompress, {
        ...this.options,
        onProgress: (p: number) => {
          this.progressValue = p;
          this.progress.emit(p);
        },
      });

      this.result = compressionResult;
      this.compressedUrl = URL.createObjectURL(compressionResult.file);
      this.compress.emit(compressionResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Compression failed';
      this.errorMessage = errorMessage;
      this.error.emit(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      this.loading = false;
    }
  }

  downloadFile() {
    if (!this.result || !this.compressedUrl) return;
    
    const link = document.createElement('a');
    link.href = this.compressedUrl;
    link.download = `compressed-${this.file?.name || 'image'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  reset() {
    this.file = null;
    this.result = null;
    this.errorMessage = null;
    this.progressValue = 0;
    if (this.originalUrl) {
      URL.revokeObjectURL(this.originalUrl);
      this.originalUrl = null;
    }
    if (this.compressedUrl) {
      URL.revokeObjectURL(this.compressedUrl);
      this.compressedUrl = null;
    }
  }

  formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes === 0) return '0 Bytes';
    const sign = bytes < 0 ? '-' : '';
    const abs = Math.abs(bytes);
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.min(sizes.length - 1, Math.floor(Math.log(abs) / Math.log(k)));
    return `${sign}${Math.round((abs / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  }
}

