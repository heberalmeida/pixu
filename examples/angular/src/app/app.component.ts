import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PixuCompressorComponent } from '../../../../components/angular/pixu-compressor.component';
import type { CompressionOptions, CompressionResult, ImageFilter, SupportedFormat } from '@pantanal/pixu';
import { compress, compressBatch, downloadImageAs, createPreviewObjectURL } from '@pantanal/pixu';
import type { DownloadImageFormat } from '@pantanal/pixu';
import { angularSampleImages, fetchSampleFile } from '../../../shared/samples';

type ResultWithMetrics = CompressionResult & {
  metrics?: {
    duration?: number;
    memoryUsed?: number;
    throughput?: number;
  };
};

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

      <div *ngIf="sampleResult" class="section sample-result">
        <h2>Sample compression result</h2>
        <p class="description">{{ sampleResult.label }} — {{ sampleResult.format }} ({{ (sampleResult.compressionRatio * 100).toFixed(1) }}% reduction)</p>
        <div class="image-comparison">
          <div class="image-preview">
            <h4>Original</h4>
            <img [src]="sampleOriginalUrl" alt="Original" />
            <p class="image-info">{{ formatBytes(sampleResult.originalSize) }}</p>
          </div>
          <div class="image-preview">
            <h4>Compressed</h4>
            <img [src]="sampleCompressedUrl" alt="Compressed" />
            <p class="image-info">{{ formatBytes(sampleResult.compressedSize) }}</p>
            <div class="download-pair">
              <button type="button" (click)="downloadAs(sampleResult.file, sampleResult.label, 'image/webp')" class="download-btn">Download (.webp)</button>
              <button type="button" (click)="downloadAs(sampleResult.file, sampleResult.label, 'image/jpeg')" class="download-btn">Download (.jpg)</button>
            </div>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="section">
          <h2>1. Basic Compression</h2>
          <p class="description">Simple compression with quality setting and live preview</p>
          <div class="controls-inline">
            <label>
              Quality: {{ (basicOptions.quality * 100).toFixed(0) }}%
              <input type="range" min="0.1" max="1" step="0.05" [(ngModel)]="basicOptions.quality" />
            </label>
          </div>
          <pixu-compressor
            [samples]="sampleImages"
            [options]="basicOptions"
            (source)="onBasicSource($event)"
            (compress)="handleBasicCompress($event)"
            (error)="handleError($event)"
            (progress)="basicProgress = $event"
          ></pixu-compressor>
          <div *ngIf="basicProgress > 0 && basicProgress < 1" class="progress-bar">
            <div class="progress-fill" [style.width.%]="basicProgress * 100"></div>
          </div>
          <div *ngIf="basicResult" class="image-comparison">
            <div class="image-preview">
              <h4>Original</h4>
              <img [src]="basicOriginalUrl" alt="Original" />
              <p class="image-info">{{ formatBytes(basicResult.originalSize) }}</p>
            </div>
            <div class="image-preview">
              <h4>Compressed</h4>
              <img [src]="basicCompressedUrl" alt="Compressed" />
              <p class="image-info">{{ formatBytes(basicResult.compressedSize) }} ({{ (basicResult.compressionRatio * 100).toFixed(1) }}% reduction)</p>
              <div class="download-pair">
                <button type="button" (click)="downloadAs(basicResult.file, 'compressed', 'image/webp')" class="download-btn">Download (.webp)</button>
                <button type="button" (click)="downloadAs(basicResult.file, 'compressed', 'image/jpeg')" class="download-btn">Download (.jpg)</button>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>2. Advanced Options</h2>
          <p class="description">Customize all compression settings with real-time updates</p>
          <div class="controls">
            <label>
              Quality: {{ (advancedOptions.quality * 100).toFixed(0) }}%
              <input type="range" min="0.1" max="1" step="0.05" [(ngModel)]="advancedOptions.quality" />
            </label>
            <label>
              Max Width: <input type="number" [(ngModel)]="advancedOptions.maxWidth" min="100" max="4000" />
            </label>
            <label>
              Max Height: <input type="number" [(ngModel)]="advancedOptions.maxHeight" min="100" max="4000" />
            </label>
            <label>
              Format:
              <select [(ngModel)]="advancedOptions.format">
                <option value="auto">Auto (Prefers PIXU)</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
                <option value="image/pixu">PIXU (Best)</option>
              </select>
            </label>
            <label>
              <input type="checkbox" [(ngModel)]="advancedOptions.stripMetadata" />
              Strip Metadata
            </label>
            <label>
              <input type="checkbox" [(ngModel)]="advancedOptions.enableSmartQuality" />
              Smart Quality
            </label>
          </div>
          <pixu-compressor
            [samples]="sampleImages"
            [options]="advancedOptions"
            (source)="onAdvancedSource($event)"
            (compress)="handleAdvancedCompress($event)"
            (error)="handleError($event)"
            (progress)="advancedProgress = $event"
          ></pixu-compressor>
          <div *ngIf="advancedProgress > 0 && advancedProgress < 1" class="progress-bar">
            <div class="progress-fill" [style.width.%]="advancedProgress * 100"></div>
          </div>
          <div *ngIf="advancedResult" class="result-card">
            <div class="stats-grid">
              <div class="stat-box">
                <span class="stat-label">Original Size</span>
                <span class="stat-value">{{ formatBytes(advancedResult.originalSize) }}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Compressed Size</span>
                <span class="stat-value highlight">{{ formatBytes(advancedResult.compressedSize) }}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Compression Ratio</span>
                <span class="stat-value success">{{ (advancedResult.compressionRatio * 100).toFixed(1) }}%</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Format</span>
                <span class="stat-value">{{ advancedResult.format }}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Dimensions</span>
                <span class="stat-value">{{ advancedResult.width }}×{{ advancedResult.height }}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Savings</span>
                <span class="stat-value success">{{ formatBytes(advancedResult.originalSize - advancedResult.compressedSize) }}</span>
              </div>
            </div>
            <div class="image-preview-grid">
              <div class="preview-item">
                <img [src]="advancedOriginalUrl" alt="Original" />
                <p>Original</p>
              </div>
              <div class="preview-item">
                <img [src]="advancedCompressedUrl" alt="Compressed" />
                <p>Compressed</p>
                <div class="download-pair">
                  <button type="button" (click)="downloadAs(advancedResult.file, 'advanced', 'image/webp')" class="download-btn-small">Download (.webp)</button>
                  <button type="button" (click)="downloadAs(advancedResult.file, 'advanced', 'image/jpeg')" class="download-btn-small">Download (.jpg)</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>3. Compression Presets</h2>
          <p class="description">Compare different presets side by side</p>
          <div class="preset-selector">
            <button
              *ngFor="let preset of presets"
              type="button"
              (click)="selectedPreset = preset"
              [class.active]="selectedPreset === preset"
              class="preset-btn"
            >
              {{ presetNames[preset] }}
            </button>
          </div>
          <pixu-compressor
            [samples]="sampleImages"
            [options]="presetOptions"
            (source)="onPresetSource($event)"
            (compress)="handlePresetCompress($event)"
            (error)="handleError($event)"
            (progress)="presetProgress = $event"
          ></pixu-compressor>
          <div *ngIf="presetProgress > 0 && presetProgress < 1" class="progress-bar">
            <div class="progress-fill" [style.width.%]="presetProgress * 100"></div>
          </div>
          <div *ngIf="presetResult" class="result-card">
            <div class="preset-info">
              <h3>{{ presetNames[selectedPreset] }} Preset</h3>
              <div class="stats-inline">
                <span><strong>Original:</strong> {{ formatBytes(presetResult.originalSize) }}</span>
                <span><strong>Compressed:</strong> {{ formatBytes(presetResult.compressedSize) }}</span>
                <span><strong>Savings:</strong> <span class="success">{{ formatBytes(presetResult.originalSize - presetResult.compressedSize) }}</span></span>
              </div>
            </div>
            <div class="image-preview-grid">
              <div class="preview-item">
                <img [src]="presetOriginalUrl" alt="Original" />
              </div>
              <div class="preview-item">
                <img [src]="presetCompressedUrl" alt="Compressed" />
                <div class="download-pair">
                  <button type="button" (click)="downloadAs(presetResult.file, 'preset-' + selectedPreset, 'image/webp')" class="download-btn-small">Download (.webp)</button>
                  <button type="button" (click)="downloadAs(presetResult.file, 'preset-' + selectedPreset, 'image/jpeg')" class="download-btn-small">Download (.jpg)</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>4. Image Filters</h2>
          <p class="description">Apply visual effects with instant preview</p>
          <div class="filter-grid">
            <label *ngFor="let filter of filters" class="filter-item">
              <input
                type="checkbox"
                [checked]="isFilterSelected(filter)"
                (change)="toggleFilter(filter, $event)"
              />
              <span>{{ filterNames[filter] }}</span>
            </label>
          </div>
          <div *ngIf="selectedFilters.length > 0" class="filter-preview">
            <p>Active Filters: {{ activeFilterLabels }}</p>
          </div>
          <pixu-compressor
            [samples]="sampleImages"
            [options]="filterOptions"
            (source)="onFilterSource($event)"
            (compress)="handleFilterCompress($event)"
            (error)="handleError($event)"
            (progress)="filterProgress = $event"
          ></pixu-compressor>
          <div *ngIf="filterProgress > 0 && filterProgress < 1" class="progress-bar">
            <div class="progress-fill" [style.width.%]="filterProgress * 100"></div>
          </div>
          <div *ngIf="filterResult" class="image-comparison">
            <div class="image-preview">
              <h4>Original</h4>
              <img [src]="filterOriginalUrl" alt="Original" />
            </div>
            <div class="image-preview">
              <h4>With Filters</h4>
              <img [src]="filterCompressedUrl" alt="Filtered" />
              <div class="download-pair">
                <button type="button" (click)="downloadAs(filterResult.file, 'filtered', 'image/webp')" class="download-btn">Download (.webp)</button>
                <button type="button" (click)="downloadAs(filterResult.file, 'filtered', 'image/jpeg')" class="download-btn">Download (.jpg)</button>
              </div>
            </div>
          </div>
        </div>

        <div class="section pix-section">
          <h2>5. PIXU Format - Revolutionary Compression</h2>
          <p class="description">Experience the best compression with Pixu's proprietary PIXU format (30-60% better than JPEG)</p>
          <div class="info-box pix-info">
            <p><strong>PIXU Format</strong> — Reconstructive format under TECR: typically 30–60% smaller than JPEG and 20–40% vs WebP at the same visual budget.</p>
          </div>
          <div class="controls">
            <label>
              Quality: {{ (pixOptions.quality * 100).toFixed(0) }}%
              <input type="range" min="0.1" max="1" step="0.05" [(ngModel)]="pixOptions.quality" />
            </label>
            <label>
              Max Width: <input type="number" [(ngModel)]="pixOptions.maxWidth" min="100" max="4000" />
            </label>
            <label>
              Max Height: <input type="number" [(ngModel)]="pixOptions.maxHeight" min="100" max="4000" />
            </label>
            <label>
              <input type="checkbox" [(ngModel)]="pixOptions.stripMetadata" />
              Strip Metadata
            </label>
            <label>
              <input type="checkbox" [(ngModel)]="pixOptions.enableSmartQuality" />
              Smart Quality
            </label>
          </div>
          <pixu-compressor
            [samples]="sampleImages"
            [options]="pixOptions"
            (source)="onPixSource($event)"
            (compress)="handlePixCompress($event)"
            (error)="handleError($event)"
            (progress)="pixProgress = $event"
          ></pixu-compressor>
          <div *ngIf="pixProgress > 0 && pixProgress < 1" class="progress-bar">
            <div class="progress-fill" [style.width.%]="pixProgress * 100"></div>
          </div>
          <div *ngIf="pixResult" class="result-card">
            <div class="pix-comparison">
              <h3>PIXU Format Results</h3>
              <div class="stats-grid">
                <div class="stat-box highlight-box">
                  <span class="stat-label">Original Size</span>
                  <span class="stat-value">{{ formatBytes(pixResult.originalSize) }}</span>
                </div>
                <div class="stat-box highlight-box">
                  <span class="stat-label">PIXU Compressed</span>
                  <span class="stat-value highlight">{{ formatBytes(pixResult.compressedSize) }}</span>
                </div>
                <div class="stat-box highlight-box">
                  <span class="stat-label">Compression Ratio</span>
                  <span class="stat-value success">{{ (pixResult.compressionRatio * 100).toFixed(1) }}%</span>
                </div>
                <div class="stat-box highlight-box">
                  <span class="stat-label">Format</span>
                  <span class="stat-value">{{ pixResult.format }}</span>
                </div>
                <div class="stat-box highlight-box">
                  <span class="stat-label">Savings</span>
                  <span class="stat-value success">{{ formatBytes(pixResult.originalSize - pixResult.compressedSize) }}</span>
                </div>
                <div class="stat-box highlight-box">
                  <span class="stat-label">Dimensions</span>
                  <span class="stat-value">{{ pixResult.width }}×{{ pixResult.height }}</span>
                </div>
              </div>
              <div class="image-preview-grid">
                <div class="preview-item">
                  <img [src]="pixOriginalUrl" alt="Original" />
                  <p>Original Image</p>
                  <p class="image-info">{{ formatBytes(pixResult.originalSize) }}</p>
                </div>
                <div class="preview-item">
                  <img [src]="pixCompressedUrl" alt="PIXU Compressed" />
                  <p>PIXU Format ({{ (pixResult.compressionRatio * 100).toFixed(1) }}% smaller)</p>
                  <p class="image-info">{{ formatBytes(pixResult.compressedSize) }}</p>
                  <div class="download-pair">
                    <button type="button" (click)="downloadAs(pixResult.file, 'pixu-compressed', 'image/webp')" class="download-btn">Download (.webp)</button>
                    <button type="button" (click)="downloadAs(pixResult.file, 'pixu-compressed', 'image/jpeg')" class="download-btn">Download (.jpg)</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>6. Smart Quality Selection</h2>
          <p class="description">Automatic quality optimization based on image content analysis</p>
          <div class="info-box">
            <p>Smart Quality analyzes content and selects quality for best compression while keeping visual fidelity.</p>
          </div>
          <pixu-compressor
            [samples]="sampleImages"
            [options]="smartQualityOptions"
            (compress)="handleSmartQualityCompress($event)"
            (error)="handleError($event)"
            (progress)="smartQualityProgress = $event"
          ></pixu-compressor>
          <div *ngIf="smartQualityProgress > 0 && smartQualityProgress < 1" class="progress-bar">
            <div class="progress-fill" [style.width.%]="smartQualityProgress * 100"></div>
          </div>
          <div *ngIf="smartQualityResult" class="result-card">
            <div class="smart-quality-info">
              <h3>Smart Quality Analysis</h3>
              <div class="stats-grid">
                <div class="stat-box">
                  <span class="stat-label">Original</span>
                  <span class="stat-value">{{ formatBytes(smartQualityResult.originalSize) }}</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">Compressed</span>
                  <span class="stat-value highlight">{{ formatBytes(smartQualityResult.compressedSize) }}</span>
                </div>
                <div class="stat-box">
                  <span class="stat-label">Optimization</span>
                  <span class="stat-value success">{{ (smartQualityResult.compressionRatio * 100).toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>7. Format Conversion</h2>
          <p class="description">Convert between formats with size comparison</p>
          <div class="controls">
            <label>
              Target Format:
              <select [(ngModel)]="conversionFormat">
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
                <option value="image/pixu">PIXU (Best)</option>
              </select>
            </label>
            <label>
              <input type="checkbox" [(ngModel)]="convertToJPEG" />
              Auto Convert PNG to JPEG
            </label>
          </div>
          <pixu-compressor
            [samples]="sampleImages"
            [options]="conversionOptions"
            (compress)="handleConversionCompress($event)"
            (error)="handleError($event)"
            (progress)="conversionProgress = $event"
          ></pixu-compressor>
          <div *ngIf="conversionProgress > 0 && conversionProgress < 1" class="progress-bar">
            <div class="progress-fill" [style.width.%]="conversionProgress * 100"></div>
          </div>
          <div *ngIf="conversionResult" class="result-card">
            <div class="format-comparison">
              <div class="format-item">
                <span class="format-label">Original Format</span>
                <span class="format-value">{{ conversionResult.format }}</span>
              </div>
              <div class="format-item">
                <span class="format-label">Size</span>
                <span class="format-value">{{ formatBytes(conversionResult.compressedSize) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>8. PNG Optimization</h2>
          <p class="description">Lossless PNG compression with color reduction</p>
          <div class="controls">
            <label>
              <input type="checkbox" [(ngModel)]="pngOptimization.enabled" />
              Enable PNG Optimization
            </label>
            <label *ngIf="pngOptimization.enabled">
              <input type="checkbox" [(ngModel)]="pngOptimization.reduceColors" />
              Reduce Colors
            </label>
            <label *ngIf="pngOptimization.enabled && pngOptimization.reduceColors">
              Max Colors: <input type="number" [(ngModel)]="pngOptimization.maxColors" min="2" max="256" />
            </label>
          </div>
          <pixu-compressor
            [samples]="sampleImages"
            [options]="pngCompressOptions"
            (compress)="handlePNGCompress($event)"
            (error)="handleError($event)"
            (progress)="pngProgress = $event"
          ></pixu-compressor>
          <div *ngIf="pngProgress > 0 && pngProgress < 1" class="progress-bar">
            <div class="progress-fill" [style.width.%]="pngProgress * 100"></div>
          </div>
          <div *ngIf="pngResult" class="result-card">
            <div class="stats-inline">
              <span><strong>Original:</strong> {{ formatBytes(pngResult.originalSize) }}</span>
              <span><strong>Optimized:</strong> {{ formatBytes(pngResult.compressedSize) }}</span>
              <span>
                <strong>Savings:</strong>
                <span [class.success]="pngSavings >= 0" [class.danger]="pngSavings < 0">{{ formatBytes(pngSavings) }}</span>
              </span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>9. Smart Cropping</h2>
          <p class="description">Intelligent image cropping with focus detection</p>
          <div class="controls">
            <label>
              Crop Width: <input type="number" [(ngModel)]="smartCrop.width" min="100" max="2000" />
            </label>
            <label>
              Crop Height: <input type="number" [(ngModel)]="smartCrop.height" min="100" max="2000" />
            </label>
            <label>
              Focus:
              <select [(ngModel)]="smartCrop.focus">
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </label>
          </div>
          <pixu-compressor
            [samples]="sampleImages"
            [options]="smartCropOptions"
            (compress)="handleSmartCropCompress($event)"
            (error)="handleError($event)"
            (progress)="smartCropProgress = $event"
          ></pixu-compressor>
          <div *ngIf="smartCropProgress > 0 && smartCropProgress < 1" class="progress-bar">
            <div class="progress-fill" [style.width.%]="smartCropProgress * 100"></div>
          </div>
          <div *ngIf="smartCropResult" class="result-card">
            <div class="stats-inline">
              <span><strong>Dimensions:</strong> {{ smartCropResult.width }}×{{ smartCropResult.height }}</span>
              <span><strong>Size:</strong> {{ formatBytes(smartCropResult.compressedSize) }}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>10. Watermark</h2>
          <p class="description">Add text or image watermarks with customization</p>
          <div class="controls">
            <label>
              Watermark Text: <input type="text" [(ngModel)]="watermarkText" placeholder="Enter text" />
            </label>
            <label>
              Position:
              <select [(ngModel)]="watermarkPosition">
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="center">Center</option>
              </select>
            </label>
            <label>
              Opacity: {{ (watermarkOpacity * 100).toFixed(0) }}%
              <input type="range" min="0.1" max="1" step="0.1" [(ngModel)]="watermarkOpacity" />
            </label>
          </div>
          <pixu-compressor
            [samples]="sampleImages"
            [options]="watermarkOptions"
            (compress)="handleWatermarkCompress($event)"
            (error)="handleError($event)"
            (progress)="watermarkProgress = $event"
          ></pixu-compressor>
          <div *ngIf="watermarkProgress > 0 && watermarkProgress < 1" class="progress-bar">
            <div class="progress-fill" [style.width.%]="watermarkProgress * 100"></div>
          </div>
          <div *ngIf="watermarkResult && watermarkText" class="result-card">
            <div class="image-preview-grid">
              <div class="preview-item">
                <img [src]="watermarkCompressedUrl" alt="Watermarked" />
                <p>Watermarked Image</p>
                <div class="download-pair">
                  <button type="button" (click)="downloadAs(watermarkResult.file, 'watermarked', 'image/webp')" class="download-btn-small">Download (.webp)</button>
                  <button type="button" (click)="downloadAs(watermarkResult.file, 'watermarked', 'image/jpeg')" class="download-btn-small">Download (.jpg)</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>11. Performance Monitoring</h2>
          <p class="description">Track compression metrics and performance in real-time</p>
          <pixu-compressor
            [samples]="sampleImages"
            [options]="performanceOptions"
            (compress)="handlePerformanceCompress($event)"
            (error)="handleError($event)"
            (progress)="performanceProgress = $event"
          ></pixu-compressor>
          <div *ngIf="performanceProgress > 0 && performanceProgress < 1" class="progress-bar">
            <div class="progress-fill" [style.width.%]="performanceProgress * 100"></div>
          </div>
          <div *ngIf="performanceResult" class="result-card">
            <div class="stats-grid">
              <div class="stat-box">
                <span class="stat-label">Original Size</span>
                <span class="stat-value">{{ formatBytes(performanceResult.originalSize) }}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Compressed Size</span>
                <span class="stat-value highlight">{{ formatBytes(performanceResult.compressedSize) }}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Compression Ratio</span>
                <span class="stat-value success">{{ (performanceResult.compressionRatio * 100).toFixed(1) }}%</span>
              </div>
            </div>
            <div *ngIf="performanceResult.metrics" class="metrics-card">
              <h3>Performance Metrics</h3>
              <div class="metrics-grid">
                <div class="metric-item">
                  <span class="metric-label">Duration</span>
                  <span class="metric-value">{{ (performanceResult.metrics.duration ?? 0).toFixed(2) }}ms</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Memory Used</span>
                  <span class="metric-value">{{ formatBytes(performanceResult.metrics.memoryUsed || 0) }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Throughput</span>
                  <span class="metric-value">{{ formatBytes(performanceResult.metrics.throughput || 0) }}/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>12. Batch Processing</h2>
          <p class="description">Compress multiple images at once with progress tracking</p>
          <div class="batch-controls">
            <input type="file" multiple (change)="handleBatchFiles($event)" accept="image/*" id="batch-input" />
            <label for="batch-input" class="file-input-label">Select Multiple Images</label>
          </div>
          <div *ngIf="batchProgress > 0 && batchProgress < 1" class="progress-bar">
            <div class="progress-fill" [style.width.%]="batchProgress * 100"></div>
            <span class="progress-text">{{ (batchProgress * 100) | number: '1.0-0' }}%</span>
          </div>
          <div *ngIf="batchResults.length > 0" class="batch-results">
            <h3>Batch Results ({{ batchResults.length }} images)</h3>
            <div class="batch-summary">
              <div class="summary-item">
                <span class="summary-label">Total Original</span>
                <span class="summary-value">{{ formatBytes(batchTotalOriginal) }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Total Compressed</span>
                <span class="summary-value highlight">{{ formatBytes(batchTotalCompressed) }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Total Savings</span>
                <span class="summary-value success">{{ formatBytes(batchTotalOriginal - batchTotalCompressed) }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Average Ratio</span>
                <span class="summary-value">{{ (batchAverageRatio * 100).toFixed(1) }}%</span>
              </div>
            </div>
            <div class="batch-list">
              <div *ngFor="let result of batchResults; let i = index" class="batch-item">
                <div class="batch-item-info">
                  <span class="batch-index">#{{ i + 1 }}</span>
                  <span class="batch-size">{{ formatBytes(result.originalSize) }} → {{ formatBytes(result.compressedSize) }}</span>
                  <span class="batch-ratio success">{{ (result.compressionRatio * 100).toFixed(1) }}%</span>
                </div>
                <div class="download-pair">
                  <button type="button" (click)="downloadAs(result.file, 'batch-' + i, 'image/webp')" class="download-btn-tiny">.webp</button>
                  <button type="button" (click)="downloadAs(result.file, 'batch-' + i, 'image/jpeg')" class="download-btn-tiny">.jpg</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="error" class="error-message">
        <p>{{ error }}</p>
        <button type="button" (click)="error = null">Close</button>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent {
  sampleImages = angularSampleImages;

  sampleLoading: string | null = null;
  sampleResult: (CompressionResult & { label: string }) | null = null;
  sampleOriginalUrl = '';
  sampleCompressedUrl = '';

  basicOptions = {
    quality: 0.8,
  };

  advancedOptions = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'auto' as SupportedFormat,
    stripMetadata: true,
    enableSmartQuality: false,
  };

  presets = ['web', 'print', 'social', 'thumbnail', 'email'];
  presetNames: Record<string, string> = {
    web: 'Web',
    print: 'Print',
    social: 'Social Media',
    thumbnail: 'Thumbnail',
    email: 'Email',
  };
  selectedPreset = 'web';

  filters: ImageFilter[] = ['grayscale', 'sepia', 'vintage', 'brightness', 'contrast', 'saturation', 'blur', 'sharpen'];
  filterNames: Record<string, string> = {
    grayscale: 'Grayscale',
    sepia: 'Sepia',
    vintage: 'Vintage',
    brightness: 'Brightness',
    contrast: 'Contrast',
    saturation: 'Saturation',
    blur: 'Blur',
    sharpen: 'Sharpen',
  };
  selectedFilters: ImageFilter[] = [];

  pixOptions = {
    quality: 0.85,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'image/pixu' as const,
    stripMetadata: true,
    enableSmartQuality: true,
  };

  conversionFormat: SupportedFormat = 'image/jpeg';
  convertToJPEG = false;

  pngOptimization = {
    enabled: false,
    reduceColors: false,
    maxColors: 128,
  };

  smartCrop = {
    width: 800,
    height: 600,
    focus: 'center' as const,
  };

  watermarkText = 'Pixu';
  watermarkPosition: NonNullable<CompressionOptions['watermark']>['position'] = 'bottom-right';
  watermarkOpacity = 0.7;

  basicResult: CompressionResult | null = null;
  advancedResult: CompressionResult | null = null;
  presetResult: CompressionResult | null = null;
  filterResult: CompressionResult | null = null;
  pixResult: CompressionResult | null = null;
  smartQualityResult: CompressionResult | null = null;
  conversionResult: CompressionResult | null = null;
  pngResult: CompressionResult | null = null;
  smartCropResult: CompressionResult | null = null;
  watermarkResult: CompressionResult | null = null;
  performanceResult: ResultWithMetrics | null = null;
  batchResults: CompressionResult[] = [];
  error: string | null = null;

  basicProgress = 0;
  advancedProgress = 0;
  presetProgress = 0;
  filterProgress = 0;
  pixProgress = 0;
  smartQualityProgress = 0;
  conversionProgress = 0;
  pngProgress = 0;
  smartCropProgress = 0;
  watermarkProgress = 0;
  performanceProgress = 0;
  batchProgress = 0;

  basicOriginalUrl = '';
  basicCompressedUrl = '';
  advancedOriginalUrl = '';
  advancedCompressedUrl = '';
  presetOriginalUrl = '';
  presetCompressedUrl = '';
  filterOriginalUrl = '';
  filterCompressedUrl = '';
  pixOriginalUrl = '';
  pixCompressedUrl = '';
  watermarkCompressedUrl = '';

  get presetOptions(): CompressionOptions {
    return { preset: this.selectedPreset as CompressionOptions['preset'] };
  }

  get filterOptions(): CompressionOptions {
    return { quality: 0.8, filters: this.selectedFilters };
  }

  get smartQualityOptions(): CompressionOptions {
    return { enableSmartQuality: true };
  }

  get conversionOptions(): CompressionOptions {
    return { format: this.conversionFormat, convertToJPEG: this.convertToJPEG };
  }

  get pngCompressOptions(): CompressionOptions {
    if (this.pngOptimization.enabled) {
      return {
        format: 'image/png',
        optimizePNG: { ...this.pngOptimization },
        strict: true,
      };
    }
    return {
      format: 'auto',
      strict: true,
    };
  }

  get smartCropOptions(): CompressionOptions {
    return {
      quality: 0.8,
      smartCrop: { ...this.smartCrop, enabled: true },
    };
  }

  get watermarkOptions(): CompressionOptions {
    return {
      quality: 0.8,
      watermark: this.watermarkText
        ? {
            text: this.watermarkText,
            position: this.watermarkPosition,
            opacity: this.watermarkOpacity,
          }
        : undefined,
    };
  }

  get performanceOptions(): CompressionOptions {
    return { quality: 0.8, monitorPerformance: true };
  }

  get activeFilterLabels(): string {
    return this.selectedFilters.map((f) => this.filterNames[f]).join(', ');
  }

  get pngSavings(): number {
    return this.pngResult
      ? this.pngResult.originalSize - this.pngResult.compressedSize
      : 0;
  }

  get batchTotalOriginal(): number {
    return this.batchResults.reduce((sum, r) => sum + r.originalSize, 0);
  }

  get batchTotalCompressed(): number {
    return this.batchResults.reduce((sum, r) => sum + r.compressedSize, 0);
  }

  get batchAverageRatio(): number {
    if (this.batchResults.length === 0) return 0;
    const total = this.batchResults.reduce((sum, r) => sum + r.compressionRatio, 0);
    return total / this.batchResults.length;
  }

  isFilterSelected(filter: ImageFilter): boolean {
    return this.selectedFilters.includes(filter);
  }

  toggleFilter(filter: ImageFilter, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedFilters = [...this.selectedFilters, filter];
    } else {
      this.selectedFilters = this.selectedFilters.filter((f) => f !== filter);
    }
  }

  private setOriginalUrl(key: 'basicOriginalUrl' | 'advancedOriginalUrl' | 'presetOriginalUrl' | 'filterOriginalUrl' | 'pixOriginalUrl', url: string) {
    const current = this[key];
    if (current) URL.revokeObjectURL(current);
    this[key] = url;
  }

  onBasicSource(payload: { url: string }) {
    this.setOriginalUrl('basicOriginalUrl', payload.url);
  }

  onAdvancedSource(payload: { url: string }) {
    this.setOriginalUrl('advancedOriginalUrl', payload.url);
  }

  onPresetSource(payload: { url: string }) {
    this.setOriginalUrl('presetOriginalUrl', payload.url);
  }

  onFilterSource(payload: { url: string }) {
    this.setOriginalUrl('filterOriginalUrl', payload.url);
  }

  onPixSource(payload: { url: string }) {
    this.setOriginalUrl('pixOriginalUrl', payload.url);
  }

  async compressSample(sample: (typeof this.sampleImages)[0]) {
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
      this.sampleCompressedUrl = await createPreviewObjectURL(result.file, result.format);
      this.sampleResult = { ...result, label: sample.label };
    } catch (err) {
      this.handleError(err instanceof Error ? err : new Error('Sample compression failed'));
    } finally {
      this.sampleLoading = null;
    }
  }

  async handleBasicCompress(result: CompressionResult) {
    this.basicResult = result;
    this.basicProgress = 1;
    if (this.basicCompressedUrl) URL.revokeObjectURL(this.basicCompressedUrl);
    if (result.file) this.basicCompressedUrl = await createPreviewObjectURL(result.file, result.format);
  }

  async handleAdvancedCompress(result: CompressionResult) {
    this.advancedResult = result;
    this.advancedProgress = 1;
    if (this.advancedCompressedUrl) URL.revokeObjectURL(this.advancedCompressedUrl);
    if (result.file) this.advancedCompressedUrl = await createPreviewObjectURL(result.file, result.format);
  }

  async handlePresetCompress(result: CompressionResult) {
    this.presetResult = result;
    this.presetProgress = 1;
    if (this.presetCompressedUrl) URL.revokeObjectURL(this.presetCompressedUrl);
    if (result.file) this.presetCompressedUrl = await createPreviewObjectURL(result.file, result.format);
  }

  async handleFilterCompress(result: CompressionResult) {
    this.filterResult = result;
    this.filterProgress = 1;
    if (this.filterCompressedUrl) URL.revokeObjectURL(this.filterCompressedUrl);
    if (result.file) this.filterCompressedUrl = await createPreviewObjectURL(result.file, result.format);
  }

  async handlePixCompress(result: CompressionResult) {
    this.pixResult = result;
    this.pixProgress = 1;
    if (this.pixCompressedUrl) URL.revokeObjectURL(this.pixCompressedUrl);
    if (result.file) this.pixCompressedUrl = await createPreviewObjectURL(result.file, result.format);
  }

  async handleSmartQualityCompress(result: CompressionResult) {
    this.smartQualityResult = result;
    this.smartQualityProgress = 1;
  }

  async handleConversionCompress(result: CompressionResult) {
    this.conversionResult = result;
    this.conversionProgress = 1;
  }

  async handlePNGCompress(result: CompressionResult) {
    this.pngResult = result;
    this.pngProgress = 1;
  }

  async handleSmartCropCompress(result: CompressionResult) {
    this.smartCropResult = result;
    this.smartCropProgress = 1;
  }

  async handleWatermarkCompress(result: CompressionResult) {
    this.watermarkResult = result;
    this.watermarkProgress = 1;
    if (result.file) {
      if (this.watermarkCompressedUrl) URL.revokeObjectURL(this.watermarkCompressedUrl);
      this.watermarkCompressedUrl = await createPreviewObjectURL(result.file, result.format);
    }
  }

  async handlePerformanceCompress(result: CompressionResult) {
    this.performanceResult = result as ResultWithMetrics;
    this.performanceProgress = 1;
  }

  async handleBatchFiles(e: Event) {
    const files = Array.from((e.target as HTMLInputElement).files || []);
    if (files.length === 0) return;

    this.batchProgress = 0;
    this.batchResults = [];

    try {
      let completed = 0;
      const results = await compressBatch(files, {
        quality: 0.8,
        concurrency: 3,
        onItemComplete: () => {
          completed++;
          this.batchProgress = completed / files.length;
        },
      });
      this.batchResults = results;
      this.batchProgress = 1;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Batch compression failed';
    }
  }

  handleError(err: Error) {
    this.error = err.message;
    console.error('Compression error:', err);
    setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  async downloadAs(file: File | Blob, name: string, format: DownloadImageFormat) {
    await downloadImageAs(file, `${name}-${Date.now()}`, format);
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
