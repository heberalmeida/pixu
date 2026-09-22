<template>
  <div class="container">
    <header class="pixu-header">
      <img src="/logo.png" alt="Pixu" class="pixu-logo" />
      <div class="pixu-brand">
        <h1>Pixu × Vue</h1>
        <p>Documentation-style examples — same layout as the Pixu docs</p>
      </div>
    </header>

    <section class="pixu-gallery">
      <span class="pixu-samples-label">Real sample images — click to compress with PIXU</span>
      <div class="pixu-gallery-grid">
        <button
          v-for="sample in sampleImages"
          :key="sample.id"
          type="button"
          class="pixu-gallery-card"
          :class="{ loading: sampleLoading === sample.id }"
          :disabled="sampleLoading === sample.id"
          @click="compressSample(sample)"
        >
          <img :src="sample.url" :alt="sample.label" loading="lazy" />
          <span>{{ sampleLoading === sample.id ? 'Compressing…' : sample.label }}</span>
        </button>
      </div>
    </section>

    <div v-if="sampleResult" class="section sample-result">
      <h2>Sample compression result</h2>
      <p class="description">{{ sampleResult.label }} — {{ sampleResult.format }} ({{ (sampleResult.compressionRatio * 100).toFixed(1) }}% reduction)</p>
      <div class="image-comparison">
        <div class="image-preview">
          <h4>Original</h4>
          <img :src="sampleOriginalUrl" alt="Original" />
          <p class="image-info">{{ formatBytes(sampleResult.originalSize) }}</p>
        </div>
        <div class="image-preview">
          <h4>Compressed</h4>
          <img :src="sampleCompressedUrl" alt="Compressed" />
          <p class="image-info">{{ formatBytes(sampleResult.compressedSize) }}</p>
          <button @click="downloadImage(sampleResult.file, sampleResult.label, sampleResult.format)" class="download-btn">{{ downloadLabel(sampleResult.format) }}</button>
        </div>
      </div>
    </div>

    <div class="content">
      <!-- Basic Compression with Image Preview -->
      <div class="section">
        <h2>1. Basic Compression</h2>
        <p class="description">Simple compression with quality setting and live preview</p>
        <div class="controls-inline">
          <label>
            Quality: {{ (basicOptions.quality * 100).toFixed(0) }}%
            <input type="range" min="0.1" max="1" step="0.05" v-model.number="basicOptions.quality" />
          </label>
        </div>
        <PixuCompressor :samples="sampleImages"
          :options="basicOptions"
          @source="onBasicSource"
          @compress="handleBasicCompress"
          @error="handleError"
          @progress="(p) => basicProgress = p"
        />
        <div v-if="basicProgress > 0 && basicProgress < 1" class="progress-bar">
          <div class="progress-fill" :style="{ width: (basicProgress * 100) + '%' }"></div>
        </div>
        <div v-if="basicResult" class="image-comparison">
          <div class="image-preview">
            <h4>Original</h4>
            <img :src="basicOriginalUrl" alt="Original" />
            <p class="image-info">{{ formatBytes(basicResult.originalSize) }}</p>
          </div>
          <div class="image-preview">
            <h4>Compressed</h4>
            <img :src="basicCompressedUrl" alt="Compressed" />
            <p class="image-info">{{ formatBytes(basicResult.compressedSize) }} ({{ (basicResult.compressionRatio * 100).toFixed(1) }}% reduction)</p>
            <button @click="downloadImage(basicResult.file, 'compressed', basicResult.format)" class="download-btn">{{ downloadLabel(basicResult.format) }}</button>
          </div>
        </div>
      </div>

      <!-- Advanced Options with Live Preview -->
      <div class="section">
        <h2>2. Advanced Options</h2>
        <p class="description">Customize all compression settings with real-time updates</p>
        <div class="controls">
          <label>
            Quality: {{ (advancedOptions.quality * 100).toFixed(0) }}%
            <input type="range" min="0.1" max="1" step="0.05" v-model.number="advancedOptions.quality" />
          </label>
          <label>
            Max Width: <input type="number" v-model.number="advancedOptions.maxWidth" min="100" max="4000" />
          </label>
          <label>
            Max Height: <input type="number" v-model.number="advancedOptions.maxHeight" min="100" max="4000" />
          </label>
          <label>
            Format:
            <select v-model="advancedOptions.format">
              <option value="auto">Auto (Prefers PIXU)</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WebP</option>
              <option value="image/pixu">PIXU (Best)</option>
            </select>
          </label>
          <label>
            <input type="checkbox" v-model="advancedOptions.stripMetadata" />
            Strip Metadata
          </label>
          <label>
            <input type="checkbox" v-model="advancedOptions.enableSmartQuality" />
            Smart Quality
          </label>
        </div>
        <PixuCompressor :samples="sampleImages"
          :options="advancedOptions"
          @source="onAdvancedSource"
          @compress="handleAdvancedCompress"
          @error="handleError"
          @progress="(p) => advancedProgress = p"
        />
        <div v-if="advancedProgress > 0 && advancedProgress < 1" class="progress-bar">
          <div class="progress-fill" :style="{ width: (advancedProgress * 100) + '%' }"></div>
        </div>
        <div v-if="advancedResult" class="result-card">
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
              <img :src="advancedOriginalUrl" alt="Original" />
              <p>Original</p>
            </div>
            <div class="preview-item">
              <img :src="advancedCompressedUrl" alt="Compressed" />
              <p>Compressed</p>
              <button @click="downloadImage(advancedResult.file, 'advanced', advancedResult.format)" class="download-btn-small">{{ downloadLabel(advancedResult.format) }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Presets with Visual Comparison -->
      <div class="section">
        <h2>3. Compression Presets</h2>
        <p class="description">Compare different presets side by side</p>
        <div class="preset-selector">
          <button
            v-for="preset in presets"
            :key="preset"
            @click="selectedPreset = preset"
            :class="{ active: selectedPreset === preset }"
            class="preset-btn"
          >
            {{ presetNames[preset] }}
          </button>
        </div>
        <PixuCompressor :samples="sampleImages"
          :options="{ preset: selectedPreset }"
          @source="onPresetSource"
          @compress="handlePresetCompress"
          @error="handleError"
          @progress="(p) => presetProgress = p"
        />
        <div v-if="presetProgress > 0 && presetProgress < 1" class="progress-bar">
          <div class="progress-fill" :style="{ width: (presetProgress * 100) + '%' }"></div>
        </div>
        <div v-if="presetResult" class="result-card">
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
              <img :src="presetOriginalUrl" alt="Original" />
            </div>
            <div class="preview-item">
              <img :src="presetCompressedUrl" alt="Compressed" />
              <button @click="downloadImage(presetResult.file, `preset-${selectedPreset}`, presetResult.format)" class="download-btn-small">{{ downloadLabel(presetResult.format) }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters with Live Preview -->
      <div class="section">
        <h2>4. Image Filters</h2>
        <p class="description">Apply visual effects with instant preview</p>
        <div class="filter-grid">
          <label v-for="filter in filters" :key="filter" class="filter-item">
            <input type="checkbox" :value="filter" v-model="selectedFilters" />
            <span>{{ filterNames[filter] }}</span>
          </label>
        </div>
        <div v-if="selectedFilters.length > 0" class="filter-preview">
          <p>Active Filters: {{ selectedFilters.map(f => filterNames[f]).join(', ') }}</p>
        </div>
        <PixuCompressor :samples="sampleImages"
          :options="{ quality: 0.8, filters: selectedFilters }"
          @source="onFilterSource"
          @compress="handleFilterCompress"
          @error="handleError"
          @progress="(p) => filterProgress = p"
        />
        <div v-if="filterProgress > 0 && filterProgress < 1" class="progress-bar">
          <div class="progress-fill" :style="{ width: (filterProgress * 100) + '%' }"></div>
        </div>
        <div v-if="filterResult" class="image-comparison">
          <div class="image-preview">
            <h4>Original</h4>
            <img :src="filterOriginalUrl" alt="Original" />
          </div>
          <div class="image-preview">
            <h4>With Filters</h4>
            <img :src="filterCompressedUrl" alt="Filtered" />
            <button @click="downloadImage(filterResult.file, 'filtered', filterResult.format)" class="download-btn">{{ downloadLabel(filterResult.format) }}</button>
          </div>
        </div>
      </div>

      <!-- PIXU Format - Revolutionary Compression -->
      <div class="section pix-section">
        <h2>5. PIXU Format - Revolutionary Compression</h2>
        <p class="description">Experience the best compression with Pixu's proprietary PIXU format (30-60% better than JPEG)</p>
        <div class="info-box pix-info">
          <p><strong>PIXU Format</strong> — Reconstructive format under TECR: typically 30–60% smaller than JPEG and 20–40% vs WebP at the same visual budget.</p>
        </div>
        <div class="controls">
          <label>
            Quality: {{ (pixOptions.quality * 100).toFixed(0) }}%
            <input type="range" min="0.1" max="1" step="0.05" v-model.number="pixOptions.quality" />
          </label>
          <label>
            Max Width: <input type="number" v-model.number="pixOptions.maxWidth" min="100" max="4000" />
          </label>
          <label>
            Max Height: <input type="number" v-model.number="pixOptions.maxHeight" min="100" max="4000" />
          </label>
          <label>
            <input type="checkbox" v-model="pixOptions.stripMetadata" />
            Strip Metadata
          </label>
          <label>
            <input type="checkbox" v-model="pixOptions.enableSmartQuality" />
            Smart Quality
          </label>
        </div>
        <PixuCompressor :samples="sampleImages"
          :options="pixOptions"
          @source="onPixSource"
          @compress="handlePixCompress"
          @error="handleError"
          @progress="(p) => pixProgress = p"
        />
        <div v-if="pixProgress > 0 && pixProgress < 1" class="progress-bar">
          <div class="progress-fill" :style="{ width: (pixProgress * 100) + '%' }"></div>
        </div>
        <div v-if="pixResult" class="result-card">
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
                <img :src="pixOriginalUrl" alt="Original" />
                <p>Original Image</p>
                <p class="image-info">{{ formatBytes(pixResult.originalSize) }}</p>
              </div>
              <div class="preview-item">
                <img :src="pixCompressedUrl" alt="PIXU Compressed" />
                <p>PIXU Format ({{ (pixResult.compressionRatio * 100).toFixed(1) }}% smaller)</p>
                <p class="image-info">{{ formatBytes(pixResult.compressedSize) }}</p>
                <button @click="downloadImage(pixResult.file, 'pixu-compressed', pixResult.format)" class="download-btn">{{ downloadLabel(pixResult.format) }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Smart Quality with Analysis -->
      <div class="section">
        <h2>6. Smart Quality Selection</h2>
        <p class="description">Automatic quality optimization based on image content analysis</p>
        <div class="info-box">
          <p>Smart Quality analyzes content and selects quality for best compression while keeping visual fidelity.</p>
        </div>
        <PixuCompressor :samples="sampleImages"
          :options="{ enableSmartQuality: true }"
          @compress="handleSmartQualityCompress"
          @error="handleError"
          @progress="(p) => smartQualityProgress = p"
        />
        <div v-if="smartQualityProgress > 0 && smartQualityProgress < 1" class="progress-bar">
          <div class="progress-fill" :style="{ width: (smartQualityProgress * 100) + '%' }"></div>
        </div>
        <div v-if="smartQualityResult" class="result-card">
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

      <!-- Format Conversion with Comparison -->
      <div class="section">
        <h2>7. Format Conversion</h2>
        <p class="description">Convert between formats with size comparison</p>
        <div class="controls">
          <label>
            Target Format:
            <select v-model="conversionFormat">
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WebP</option>
              <option value="image/pixu">PIXU (Best)</option>
            </select>
          </label>
          <label>
            <input type="checkbox" v-model="convertToJPEG" />
            Auto Convert PNG to JPEG
          </label>
        </div>
        <PixuCompressor :samples="sampleImages"
          :options="{ format: conversionFormat, convertToJPEG }"
          @compress="handleConversionCompress"
          @error="handleError"
          @progress="(p) => conversionProgress = p"
        />
        <div v-if="conversionProgress > 0 && conversionProgress < 1" class="progress-bar">
          <div class="progress-fill" :style="{ width: (conversionProgress * 100) + '%' }"></div>
        </div>
        <div v-if="conversionResult" class="result-card">
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

      <!-- PNG Optimization -->
      <div class="section">
        <h2>8. PNG Optimization</h2>
        <p class="description">Lossless PNG compression with color reduction</p>
        <div class="controls">
          <label>
            <input type="checkbox" v-model="pngOptimization.enabled" />
            Enable PNG Optimization
          </label>
          <label v-if="pngOptimization.enabled">
            <input type="checkbox" v-model="pngOptimization.reduceColors" />
            Reduce Colors
          </label>
          <label v-if="pngOptimization.enabled && pngOptimization.reduceColors">
            Max Colors: <input type="number" v-model.number="pngOptimization.maxColors" min="2" max="256" />
          </label>
        </div>
        <PixuCompressor :samples="sampleImages"
          :options="pngCompressOptions"
          @compress="handlePNGCompress"
          @error="handleError"
          @progress="(p) => pngProgress = p"
        />
        <div v-if="pngProgress > 0 && pngProgress < 1" class="progress-bar">
          <div class="progress-fill" :style="{ width: (pngProgress * 100) + '%' }"></div>
        </div>
        <div v-if="pngResult" class="result-card">
          <div class="stats-inline">
            <span><strong>Original:</strong> {{ formatBytes(pngResult.originalSize) }}</span>
            <span><strong>Optimized:</strong> {{ formatBytes(pngResult.compressedSize) }}</span>
            <span>
              <strong>Savings:</strong>
              <span :class="pngSavings >= 0 ? 'success' : 'danger'">{{ formatBytes(pngSavings) }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Smart Crop -->
      <div class="section">
        <h2>9. Smart Cropping</h2>
        <p class="description">Intelligent image cropping with focus detection</p>
        <div class="controls">
          <label>
            Crop Width: <input type="number" v-model.number="smartCrop.width" min="100" max="2000" />
          </label>
          <label>
            Crop Height: <input type="number" v-model.number="smartCrop.height" min="100" max="2000" />
          </label>
          <label>
            Focus:
            <select v-model="smartCrop.focus">
              <option value="center">Center</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </label>
        </div>
        <PixuCompressor :samples="sampleImages"
          :options="{ quality: 0.8, smartCrop: { ...smartCrop, enabled: true } }"
          @compress="handleSmartCropCompress"
          @error="handleError"
          @progress="(p) => smartCropProgress = p"
        />
        <div v-if="smartCropProgress > 0 && smartCropProgress < 1" class="progress-bar">
          <div class="progress-fill" :style="{ width: (smartCropProgress * 100) + '%' }"></div>
        </div>
        <div v-if="smartCropResult" class="result-card">
          <div class="stats-inline">
            <span><strong>Dimensions:</strong> {{ smartCropResult.width }}×{{ smartCropResult.height }}</span>
            <span><strong>Size:</strong> {{ formatBytes(smartCropResult.compressedSize) }}</span>
          </div>
        </div>
      </div>

      <!-- Watermark -->
      <div class="section">
        <h2>10. Watermark</h2>
        <p class="description">Add text or image watermarks with customization</p>
        <div class="controls">
          <label>
            Watermark Text: <input type="text" v-model="watermarkText" placeholder="Enter text" />
          </label>
          <label>
            Position:
            <select v-model="watermarkPosition">
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="center">Center</option>
            </select>
          </label>
          <label>
            Opacity: {{ (watermarkOpacity * 100).toFixed(0) }}%
            <input type="range" min="0.1" max="1" step="0.1" v-model.number="watermarkOpacity" />
          </label>
        </div>
        <PixuCompressor :samples="sampleImages"
          :options="{
            quality: 0.8,
            watermark: watermarkText ? {
              text: watermarkText,
              position: watermarkPosition,
              opacity: watermarkOpacity
            } : undefined
          }"
          @compress="handleWatermarkCompress"
          @error="handleError"
          @progress="(p) => watermarkProgress = p"
        />
        <div v-if="watermarkProgress > 0 && watermarkProgress < 1" class="progress-bar">
          <div class="progress-fill" :style="{ width: (watermarkProgress * 100) + '%' }"></div>
        </div>
        <div v-if="watermarkResult && watermarkText" class="result-card">
          <div class="image-preview-grid">
            <div class="preview-item">
              <img :src="watermarkCompressedUrl" alt="Watermarked" />
              <p>Watermarked Image</p>
              <button @click="downloadImage(watermarkResult.file, 'watermarked', watermarkResult.format)" class="download-btn-small">{{ downloadLabel(watermarkResult.format) }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Monitoring -->
      <div class="section">
        <h2>11. Performance Monitoring</h2>
        <p class="description">Track compression metrics and performance in real-time</p>
        <PixuCompressor :samples="sampleImages"
          :options="{ quality: 0.8, monitorPerformance: true }"
          @compress="handlePerformanceCompress"
          @error="handleError"
          @progress="(p) => performanceProgress = p"
        />
        <div v-if="performanceProgress > 0 && performanceProgress < 1" class="progress-bar">
          <div class="progress-fill" :style="{ width: (performanceProgress * 100) + '%' }"></div>
        </div>
        <div v-if="performanceResult" class="result-card">
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
          <div v-if="performanceResult.metrics" class="metrics-card">
            <h3>Performance Metrics</h3>
            <div class="metrics-grid">
              <div class="metric-item">
                <span class="metric-label">Duration</span>
                <span class="metric-value">{{ performanceResult.metrics.duration?.toFixed(2) || 0 }}ms</span>
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

      <!-- Batch Processing -->
      <div class="section">
        <h2>12. Batch Processing</h2>
        <p class="description">Compress multiple images at once with progress tracking</p>
        <div class="batch-controls">
          <input type="file" multiple @change="handleBatchFiles" accept="image/*" id="batch-input" />
          <label for="batch-input" class="file-input-label">Select Multiple Images</label>
        </div>
        <div v-if="batchProgress > 0 && batchProgress < 1" class="progress-bar">
          <div class="progress-fill" :style="{ width: (batchProgress * 100) + '%' }"></div>
          <span class="progress-text">{{ Math.round(batchProgress * 100) }}%</span>
        </div>
        <div v-if="batchResults.length > 0" class="batch-results">
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
            <div v-for="(result, index) in batchResults" :key="index" class="batch-item">
              <div class="batch-item-info">
                <span class="batch-index">#{{ index + 1 }}</span>
                <span class="batch-size">{{ formatBytes(result.originalSize) }} → {{ formatBytes(result.compressedSize) }}</span>
                <span class="batch-ratio success">{{ (result.compressionRatio * 100).toFixed(1) }}%</span>
              </div>
              <button @click="downloadImage(result.file, `batch-${index}`, result.format)" class="download-btn-tiny">{{ downloadLabel(result.format) }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="error = null">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PixuCompressor from '../../../components/vue/PixuCompressor.vue';
import type { CompressionResult } from 'pixu';
import { compress, compressBatch, buildDownloadName, getOutputExtension, createPreviewObjectURL } from 'pixu';
import { sampleImages, fetchSampleFile } from '../../shared/samples';

const sampleLoading = ref<string | null>(null);
const sampleResult = ref<(CompressionResult & { label: string }) | null>(null);
const sampleOriginalUrl = ref('');
const sampleCompressedUrl = ref('');

const basicOptions = ref({
  quality: 0.8,
});

const advancedOptions = ref({
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
  format: 'auto' as const,
  stripMetadata: true,
  enableSmartQuality: false,
});

const presets = ['web', 'print', 'social', 'thumbnail', 'email'];
const presetNames: Record<string, string> = {
  web: 'Web',
  print: 'Print',
  social: 'Social Media',
  thumbnail: 'Thumbnail',
  email: 'Email',
};
const selectedPreset = ref('web');

const filters = ['grayscale', 'sepia', 'vintage', 'brightness', 'contrast', 'saturation', 'blur', 'sharpen'];
const filterNames: Record<string, string> = {
  grayscale: 'Grayscale',
  sepia: 'Sepia',
  vintage: 'Vintage',
  brightness: 'Brightness',
  contrast: 'Contrast',
  saturation: 'Saturation',
  blur: 'Blur',
  sharpen: 'Sharpen',
};
const selectedFilters = ref<string[]>([]);

const pixOptions = ref({
  quality: 0.85,
  maxWidth: 1920,
  maxHeight: 1080,
  format: 'image/pixu' as const,
  stripMetadata: true,
  enableSmartQuality: true,
});

const conversionFormat = ref('image/jpeg');
const convertToJPEG = ref(false);

const pngOptimization = ref({
  enabled: false,
  reduceColors: false,
  maxColors: 128,
});

const pngCompressOptions = computed(() => {
  if (pngOptimization.value.enabled) {
    return {
      format: 'image/png' as const,
      optimizePNG: { ...pngOptimization.value },
      strict: true,
    };
  }
  return {
    format: 'auto' as const,
    strict: true,
  };
});

const smartCrop = ref({
  width: 800,
  height: 600,
  focus: 'center' as const,
});

const watermarkText = ref('Pixu');
const watermarkPosition = ref('bottom-right');
const watermarkOpacity = ref(0.7);

// Results
const basicResult = ref<CompressionResult | null>(null);
const advancedResult = ref<CompressionResult | null>(null);
const presetResult = ref<CompressionResult | null>(null);
const filterResult = ref<CompressionResult | null>(null);
const pixResult = ref<CompressionResult | null>(null);
const smartQualityResult = ref<CompressionResult | null>(null);
const conversionResult = ref<CompressionResult | null>(null);
const pngResult = ref<CompressionResult | null>(null);
const pngSavings = computed(() =>
  pngResult.value
    ? pngResult.value.originalSize - pngResult.value.compressedSize
    : 0
);
const smartCropResult = ref<CompressionResult | null>(null);
const watermarkResult = ref<CompressionResult | null>(null);
const performanceResult = ref<CompressionResult | null>(null);
const batchResults = ref<CompressionResult[]>([]);
const error = ref<string | null>(null);

// Progress tracking
const basicProgress = ref(0);
const advancedProgress = ref(0);
const presetProgress = ref(0);
const filterProgress = ref(0);
const pixProgress = ref(0);
const smartQualityProgress = ref(0);
const conversionProgress = ref(0);
const pngProgress = ref(0);
const smartCropProgress = ref(0);
const watermarkProgress = ref(0);
const performanceProgress = ref(0);
const batchProgress = ref(0);

// Image URLs
const basicOriginalUrl = ref('');
const basicCompressedUrl = ref('');
const advancedOriginalUrl = ref('');
const advancedCompressedUrl = ref('');
const presetOriginalUrl = ref('');
const presetCompressedUrl = ref('');
const filterOriginalUrl = ref('');
const filterCompressedUrl = ref('');
const pixOriginalUrl = ref('');
const pixCompressedUrl = ref('');
const watermarkCompressedUrl = ref('');

// Computed
const batchTotalOriginal = computed(() => 
  batchResults.value.reduce((sum: number, r: CompressionResult) => sum + r.originalSize, 0)
);

const batchTotalCompressed = computed(() => 
  batchResults.value.reduce((sum: number, r: CompressionResult) => sum + r.compressedSize, 0)
);

const batchAverageRatio = computed(() => {
  if (batchResults.value.length === 0) return 0;
  const total = batchResults.value.reduce((sum: number, r: CompressionResult) => sum + r.compressionRatio, 0);
  return total / batchResults.value.length;
});

// Handlers
const setOriginalUrl = (target: typeof basicOriginalUrl, url: string) => {
  if (target.value) URL.revokeObjectURL(target.value);
  target.value = url;
};

const onBasicSource = (payload: { url: string }) => setOriginalUrl(basicOriginalUrl, payload.url);
const onAdvancedSource = (payload: { url: string }) => setOriginalUrl(advancedOriginalUrl, payload.url);
const onPresetSource = (payload: { url: string }) => setOriginalUrl(presetOriginalUrl, payload.url);
const onFilterSource = (payload: { url: string }) => setOriginalUrl(filterOriginalUrl, payload.url);
const onPixSource = (payload: { url: string }) => setOriginalUrl(pixOriginalUrl, payload.url);

const handleBasicCompress = async (result: CompressionResult) => {
  basicResult.value = result;
  basicProgress.value = 1;
  if (basicCompressedUrl.value) URL.revokeObjectURL(basicCompressedUrl.value);
  if (result.file) basicCompressedUrl.value = await createPreviewObjectURL(result.file, result.format);
};

const handleAdvancedCompress = async (result: CompressionResult) => {
  advancedResult.value = result;
  advancedProgress.value = 1;
  if (advancedCompressedUrl.value) URL.revokeObjectURL(advancedCompressedUrl.value);
  if (result.file) advancedCompressedUrl.value = await createPreviewObjectURL(result.file, result.format);
};

const handlePresetCompress = async (result: CompressionResult) => {
  presetResult.value = result;
  presetProgress.value = 1;
  if (presetCompressedUrl.value) URL.revokeObjectURL(presetCompressedUrl.value);
  if (result.file) presetCompressedUrl.value = await createPreviewObjectURL(result.file, result.format);
};

const handleFilterCompress = async (result: CompressionResult) => {
  filterResult.value = result;
  filterProgress.value = 1;
  if (filterCompressedUrl.value) URL.revokeObjectURL(filterCompressedUrl.value);
  if (result.file) filterCompressedUrl.value = await createPreviewObjectURL(result.file, result.format);
};

const handlePixCompress = async (result: CompressionResult) => {
  pixResult.value = result;
  pixProgress.value = 1;
  if (pixCompressedUrl.value) URL.revokeObjectURL(pixCompressedUrl.value);
  if (result.file) pixCompressedUrl.value = await createPreviewObjectURL(result.file, result.format);
};

const handleSmartQualityCompress = (result: CompressionResult) => {
  smartQualityResult.value = result;
  smartQualityProgress.value = 1;
};

const handleConversionCompress = (result: CompressionResult) => {
  conversionResult.value = result;
  conversionProgress.value = 1;
};

const handlePNGCompress = (result: CompressionResult) => {
  pngResult.value = result;
  pngProgress.value = 1;
};

const handleSmartCropCompress = (result: CompressionResult) => {
  smartCropResult.value = result;
  smartCropProgress.value = 1;
};

const handleWatermarkCompress = async (result: CompressionResult) => {
  watermarkResult.value = result;
  watermarkProgress.value = 1;
  if (result.file) {
    watermarkCompressedUrl.value = await createPreviewObjectURL(result.file, result.format);
  }
};

const handlePerformanceCompress = (result: CompressionResult) => {
  performanceResult.value = result;
  performanceProgress.value = 1;
};

const handleBatchFiles = async (e: Event) => {
  const files = Array.from((e.target as HTMLInputElement).files || []);
  if (files.length === 0) return;

  batchProgress.value = 0;
  batchResults.value = [];

  try {
    let completed = 0;
    const results = await compressBatch(files, {
      quality: 0.8,
      concurrency: 3,
      onItemComplete: () => {
        completed++;
        batchProgress.value = completed / files.length;
      },
    });
    batchResults.value = results;
    batchProgress.value = 1;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Batch compression failed';
  }
};

const handleError = (err: Error) => {
  error.value = err.message;
  console.error('Compression error:', err);
  setTimeout(() => {
    error.value = null;
  }, 5000);
};

const compressSample = async (sample: typeof sampleImages[0]) => {
  sampleLoading.value = sample.id;
  try {
    const file = await fetchSampleFile(sample);
    if (sampleOriginalUrl.value) URL.revokeObjectURL(sampleOriginalUrl.value);
    if (sampleCompressedUrl.value) URL.revokeObjectURL(sampleCompressedUrl.value);
    sampleOriginalUrl.value = URL.createObjectURL(file);
    const result = await compress(file, {
      quality: 0.85,
      format: 'image/pixu',
      stripMetadata: true,
      enableSmartQuality: true,
    });
    sampleCompressedUrl.value = await createPreviewObjectURL(result.file, result.format);
    sampleResult.value = { ...result, label: sample.label };
  } catch (err) {
    handleError(err instanceof Error ? err : new Error('Sample compression failed'));
  } finally {
    sampleLoading.value = null;
  }
};

const downloadImage = (file: File | Blob, name: string, format?: string) => {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = buildDownloadName(`${name}-${Date.now()}`, format || file.type);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const downloadLabel = (format?: string) => {
  const ext = getOutputExtension(format);
  return `Download (${ext})`;
};

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes === 0) return '0 Bytes';
  const sign = bytes < 0 ? '-' : '';
  const abs = Math.abs(bytes);
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(abs) / Math.log(k)));
  return `${sign}${Math.round((abs / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};
</script>

<style scoped>
.section {
  background: var(--pixu-surface);
  border: 1px solid var(--pixu-border);
  border-radius: var(--pixu-radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--pixu-shadow);
}

.section:hover {
  border-color: rgba(123, 63, 239, 0.35);
}

.section h2 {
  margin-bottom: 0.35rem;
  color: var(--pixu-text);
  font-size: 1.35rem;
  font-weight: 700;
  border-bottom: 1px solid var(--pixu-border);
  padding-bottom: 0.65rem;
}

.description {
  margin-bottom: 1.25rem;
  color: var(--pixu-muted);
  font-size: 0.95rem;
}

.controls,
.controls-inline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: var(--pixu-surface-2);
  border: 1px solid var(--pixu-border);
  border-radius: 10px;
}

.controls-inline {
  grid-template-columns: 1fr;
}

.controls label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
}

.controls input[type="range"] {
  width: 100%;
  accent-color: var(--pixu-purple);
}

.controls input[type="number"],
.controls input[type="text"],
.controls select {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.controls input:focus,
.controls select:focus {
  outline: none;
  border-color: var(--pixu-purple);
}

.controls input[type="checkbox"] {
  width: auto;
  margin-right: 0.5rem;
  accent-color: var(--pixu-purple);
  transform: scale(1.2);
}

.preset-selector {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 0.875rem 1.75rem;
  border: 2px solid var(--pixu-purple);
  background: var(--pixu-surface);
  color: var(--pixu-purple);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s;
}

.preset-btn:hover {
  background: var(--pixu-purple);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.preset-btn.active {
  background: var(--pixu-gradient);
  color: white;
  border-color: transparent;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--pixu-surface-2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-item:hover {
  background: #e9ecef;
}

.filter-item input[type="checkbox"] {
  accent-color: var(--pixu-purple);
}

.filter-preview {
  padding: 1rem;
  background: #e8f5e9;
  border-radius: 8px;
  margin-bottom: 1rem;
  color: #2e7d32;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--pixu-purple) 0%, #764ba2 100%);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #555;
}

.result-card {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: var(--pixu-surface-2);
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--pixu-surface);
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--pixu-muted);
  font-weight: 500;
}

.stat-value {
  font-size: 1.25rem;
  color: var(--pixu-text);
  font-weight: 700;
}

.stat-value.highlight {
  color: var(--pixu-purple);
}

.stat-value.success {
  color: #27ae60;
}

.stat-value.danger,
.stats-inline .danger {
  color: #c0392b;
}

.stats-inline {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.stats-inline span {
  font-size: 0.95rem;
  color: #555;
}

.stats-inline .success {
  color: #27ae60;
  font-weight: 600;
}

.image-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.image-preview {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.image-preview h4 {
  margin: 0;
  color: var(--pixu-text);
  font-size: 1rem;
}

.image-preview img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-info {
  font-size: 0.85rem;
  color: var(--pixu-muted);
  margin: 0;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.preview-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-item img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.download-btn,
.download-btn-small,
.download-btn-tiny {
  padding: 0.75rem 1.5rem;
  background: var(--pixu-gradient);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  margin-top: 0.5rem;
}

.download-btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.download-btn-tiny {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
}

.download-btn:hover,
.download-btn-small:hover,
.download-btn-tiny:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.info-box {
  padding: 1rem;
  background: #e3f2fd;
  border-radius: 8px;
  margin-bottom: 1rem;
  color: #1976d2;
}

.pix-section {
  border: 1px solid var(--pixu-purple);
  background: var(--pixu-surface);
}

.pix-info {
  background: rgba(123, 63, 239, 0.08);
  color: var(--pixu-text);
  border: 1px solid rgba(123, 63, 239, 0.25);
  padding: 1.25rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
}

.pix-info p {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.6;
}

.pix-comparison h3 {
  margin-bottom: 1.5rem;
  color: var(--pixu-purple);
  font-size: 1.5rem;
  text-align: center;
}

.highlight-box {
  border: 2px solid var(--pixu-purple);
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
}

.metrics-card {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: var(--pixu-surface);
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.metrics-card h3 {
  margin-bottom: 1rem;
  color: var(--pixu-text);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--pixu-surface-2);
  border-radius: 6px;
}

.metric-label {
  font-weight: 500;
  color: #555;
}

.metric-value {
  font-weight: 700;
  color: var(--pixu-purple);
}

.batch-controls {
  margin-bottom: 1.5rem;
}

.file-input-label {
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--pixu-gradient);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.file-input-label:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

#batch-input {
  display: none;
}

.batch-results {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: var(--pixu-surface-2);
  border-radius: 12px;
}

.batch-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--pixu-surface);
  border-radius: 8px;
}

.summary-label {
  font-size: 0.85rem;
  color: var(--pixu-muted);
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--pixu-text);
}

.batch-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.batch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--pixu-surface);
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.batch-item-info {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.batch-index {
  font-weight: 700;
  color: var(--pixu-purple);
}

.batch-size {
  color: #555;
}

.batch-ratio {
  font-weight: 600;
}

.error-message {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: #e74c3c;
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 400px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.error-message button {
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  background: var(--pixu-surface);
  color: #e74c3c;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

@media (max-width: 768px) {
  .controls,
  .controls-inline {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .image-comparison {
    grid-template-columns: 1fr;
  }

  .image-preview-grid {
    grid-template-columns: 1fr;
  }
}
</style>
