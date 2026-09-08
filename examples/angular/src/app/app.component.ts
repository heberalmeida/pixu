import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PixuCompressorComponent } from '../../../../components/angular/pixu-compressor.component';
import type { CompressionResult } from 'pixu';
import { compress } from 'pixu';
import { angularSampleImages, fetchSampleFile } from '../../../shared/samples';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, PixuCompressorComponent],
  template: `
    <div class="container">
      <header class="pixu-header">
        <img src="assets/logo.png" alt="Pixu" class="pixu-logo" />
        <div class="pixu-brand">
          <h1>Pixu × Angular</h1>
          <p>Documentation-style examples — same layout as the Pixu docs</p>
        </div>
      </header>

      <section class="pixu-gallery">
        <span class="pixu-samples-label">Real sample images — click to compress with PIXU</span>
        <div class="pixu-gallery-grid">
          <button
            *ngFor="let sample of sampleImages"
            type="button"
            class="pixu-gallery-card"
            [class.loading]="sampleLoading === sample.id"
            [disabled]="sampleLoading === sample.id"
            (click)="compressSample(sample)"
          >
            <img [src]="sample.url" [alt]="sample.label" loading="lazy" />
            <span>{{ sampleLoading === sample.id ? 'Compressing…' : sample.label }}</span>
          </button>
        </div>
      </section>

      <div *ngIf="sampleResult" class="section">
        <h2>Sample compression result</h2>
        <p class="description">{{ sampleResult.label }} — {{ sampleResult.format }} ({{ (sampleResult.compressionRatio * 100).toFixed(1) }}% reduction)</p>
        <div class="sample-preview">
          <figure><img [src]="sampleOriginalUrl" alt="Original" /><figcaption>{{ formatBytes(sampleResult.originalSize) }}</figcaption></figure>
          <figure><img [src]="sampleCompressedUrl" alt="Compressed" /><figcaption>{{ formatBytes(sampleResult.compressedSize) }}</figcaption></figure>
        </div>
      </div>

      <div class="content">
        <!-- Basic Compression -->
        <div class="section">
          <h2>1. Basic Compression</h2>
          <p class="description">Simple compression with quality setting only</p>
          <pixu-compressor
            [samples]="sampleImages"
            [options]="{ quality: 0.8 }"
            (compress)="handleBasicCompress($event)"
            (error)="handleError($event)"
          ></pixu-compressor>
          <div *ngIf="basicResult" class="result-card">
            <h3>Result</h3>
            <div class="stats">
              <div class="stat">
                <span class="label">Original:</span>
                <span class="value">{{ formatBytes(basicResult.originalSize) }}</span>
              </div>
              <div class="stat">
                <span class="label">Compressed:</span>
                <span class="value">{{ formatBytes(basicResult.compressedSize) }}</span>
              </div>
              <div class="stat">
                <span class="label">Ratio:</span>
                <span class="value">{{ (basicResult.compressionRatio * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced Options -->
        <div class="section">
          <h2>2. Advanced Options</h2>
          <p class="description">Customizable quality, dimensions, format, and metadata</p>
          <div class="controls">
            <label>
              Quality: {{ (advancedOptions.quality * 100).toFixed(0) }}%
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                [(ngModel)]="advancedOptions.quality"
              />
            </label>
            <label>
              Max Width:
              <input
                type="number"
                [(ngModel)]="advancedOptions.maxWidth"
                min="100"
                max="4000"
              />
            </label>
            <label>
              Format:
              <select [(ngModel)]="advancedOptions.format">
                <option value="auto">Auto (prefers PIX)</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
                <option value="image/pixu">PIXU (.pixu)</option>
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                [(ngModel)]="advancedOptions.stripMetadata"
              />
              Strip Metadata
            </label>
          </div>
          <pixu-compressor
            [samples]="sampleImages"
            [options]="advancedOptions"
            (compress)="handleAdvancedCompress($event)"
            (error)="handleError($event)"
          ></pixu-compressor>
          <div *ngIf="advancedResult" class="result-card">
            <h3>Result</h3>
            <div class="stats">
              <div class="stat">
                <span class="label">Original:</span>
                <span class="value">{{ formatBytes(advancedResult.originalSize) }}</span>
              </div>
              <div class="stat">
                <span class="label">Compressed:</span>
                <span class="value">{{ formatBytes(advancedResult.compressedSize) }}</span>
              </div>
              <div class="stat">
                <span class="label">Format:</span>
                <span class="value">{{ advancedResult.format }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Presets -->
        <div class="section">
          <h2>3. Compression Presets</h2>
          <p class="description">Pre-configured settings for common use cases</p>
          <div class="preset-selector">
            <button
              *ngFor="let preset of presets"
              (click)="selectedPreset = preset"
              [class.active]="selectedPreset === preset"
              class="preset-btn"
            >
              {{ preset }}
            </button>
          </div>
          <pixu-compressor
            [samples]="sampleImages"
            [options]="{ preset: selectedPreset }"
            (compress)="handlePresetCompress($event)"
            (error)="handleError($event)"
          ></pixu-compressor>
          <div *ngIf="presetResult" class="result-card">
            <h3>Result</h3>
            <div class="stats">
              <div class="stat">
                <span class="label">Preset:</span>
                <span class="value">{{ selectedPreset }}</span>
              </div>
              <div class="stat">
                <span class="label">Original:</span>
                <span class="value">{{ formatBytes(presetResult.originalSize) }}</span>
              </div>
              <div class="stat">
                <span class="label">Compressed:</span>
                <span class="value">{{ formatBytes(presetResult.compressedSize) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="error" class="error-message">
        <p>{{ error }}</p>
        <button (click)="error = null">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: var(--pixu-text);
    }

    .header p {
      font-size: 1.1rem;
      color: var(--pixu-muted);
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .section {
      background: rgba(18, 24, 38, 0.92);
      border: 1px solid var(--pixu-border);
      border-radius: var(--pixu-radius);
      padding: 2rem;
      box-shadow: var(--pixu-shadow);
    }

    .section h2 {
      margin-bottom: 0.5rem;
      color: var(--pixu-text);
      font-size: 1.5rem;
      border-bottom: 2px solid transparent;
      border-image: var(--pixu-gradient) 1;
      padding-bottom: 0.5rem;
    }

    .description {
      margin-bottom: 1.5rem;
      color: var(--pixu-muted);
      font-size: 0.95rem;
    }

    .sample-preview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .sample-preview img {
      width: 100%;
      border-radius: 10px;
      border: 1px solid var(--pixu-border);
    }

    .controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      background: var(--pixu-surface-2);
      border-radius: 8px;
    }

    .controls label {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--pixu-muted);
    }

    .controls input[type="range"] {
      width: 100%;
    }

    .controls input[type="number"],
    .controls select {
      padding: 0.5rem;
      border: 1px solid var(--pixu-border);
      background: var(--pixu-surface);
      color: var(--pixu-text);
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .preset-selector {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .preset-btn {
      padding: 0.75rem 1.5rem;
      border: 2px solid #3498db;
      background: white;
      color: #3498db;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
    }

    .preset-btn:hover {
      background: var(--pixu-gradient);
      color: white;
      border-color: transparent;
    }

    .preset-btn.active {
      background: var(--pixu-gradient);
      color: white;
      border-color: transparent;
    }

    .result-card {
      margin-top: 1.5rem;
      padding: 1.5rem;
      background: var(--pixu-surface-2);
      border-radius: 8px;
      border: 1px solid var(--pixu-border);
    }

    .result-card h3 {
      margin-bottom: 1rem;
      color: var(--pixu-text);
      font-size: 1.1rem;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat .label {
      font-size: 0.85rem;
      color: var(--pixu-muted);
      font-weight: 500;
    }

    .stat .value {
      font-size: 1.1rem;
      color: #3498db;
      font-weight: 600;
    }

    .error-message {
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: #e74c3c;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      max-width: 400px;
    }

    .error-message button {
      margin-top: 0.5rem;
      padding: 0.5rem 1rem;
      background: white;
      color: #e74c3c;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class AppComponent {
  sampleImages = angularSampleImages;

  sampleLoading: string | null = null;
  sampleResult: (CompressionResult & { label: string }) | null = null;
  sampleOriginalUrl = '';
  sampleCompressedUrl = '';

  advancedOptions = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'auto' as const,
    stripMetadata: true,
  };

  presets = ['web', 'print', 'social', 'thumbnail', 'email'];
  selectedPreset = 'web';

  basicResult: CompressionResult | null = null;
  advancedResult: CompressionResult | null = null;
  presetResult: CompressionResult | null = null;
  error: string | null = null;

  async compressSample(sample: typeof this.sampleImages[0]) {
    this.sampleLoading = sample.id;
    try {
      const file = await fetchSampleFile(sample);
      if (this.sampleOriginalUrl) URL.revokeObjectURL(this.sampleOriginalUrl);
      if (this.sampleCompressedUrl) URL.revokeObjectURL(this.sampleCompressedUrl);
      this.sampleOriginalUrl = URL.createObjectURL(file);
      const result = await compress(file, {
        quality: 0.85,
        format: 'image/pixu',
        stripMetadata: true,
        enableSmartQuality: true,
      });
      this.sampleCompressedUrl = URL.createObjectURL(result.file);
      this.sampleResult = { ...result, label: sample.label };
    } catch (err) {
      this.handleError(err instanceof Error ? err : new Error('Sample compression failed'));
    } finally {
      this.sampleLoading = null;
    }
  }

  handleBasicCompress(result: CompressionResult) {
    this.basicResult = result;
  }

  handleAdvancedCompress(result: CompressionResult) {
    this.advancedResult = result;
  }

  handlePresetCompress(result: CompressionResult) {
    this.presetResult = result;
  }

  handleError(err: Error) {
    this.error = err.message;
    console.error('Compression error:', err);
    setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

