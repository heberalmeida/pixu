<script lang="ts">
  import PixuCompressor from '../../../components/svelte/PixuCompressor.svelte';
  import type { CompressionResult } from '@pantanal/pixu';
  import { compress, compressBatch, downloadImageAs, createPreviewObjectURL } from '@pantanal/pixu';
  import type { DownloadImageFormat } from '@pantanal/pixu';
  import { sampleImages, fetchSampleFile } from '../../shared/samples';

  let sampleLoading: string | null = null;
  let sampleResult: (CompressionResult & { label: string }) | null = null;
  let sampleOriginalUrl = '';
  let sampleCompressedUrl = '';

  let basicOptions = {
    quality: 0.8,
  };

  let advancedOptions = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'auto' as const,
    stripMetadata: true,
    enableSmartQuality: false,
  };

  const presets = ['web', 'print', 'social', 'thumbnail', 'email'];
  const presetNames: Record<string, string> = {
    web: 'Web',
    print: 'Print',
    social: 'Social Media',
    thumbnail: 'Thumbnail',
    email: 'Email',
  };
  let selectedPreset = 'web';

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
  let selectedFilters: string[] = [];

  let pixOptions = {
    quality: 0.85,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'image/pixu' as const,
    stripMetadata: true,
    enableSmartQuality: true,
  };

  let conversionFormat = 'image/jpeg';
  let convertToJPEG = false;

  let pngOptimization = {
    enabled: false,
    reduceColors: false,
    maxColors: 128,
  };

  $: pngCompressOptions = pngOptimization.enabled
    ? {
        format: 'image/png' as const,
        optimizePNG: { ...pngOptimization },
        strict: true,
      }
    : {
        format: 'auto' as const,
        strict: true,
      };

  let smartCrop = {
    width: 800,
    height: 600,
    focus: 'center' as const,
  };

  let watermarkText = 'Pixu';
  let watermarkPosition = 'bottom-right';
  let watermarkOpacity = 0.7;

  let basicResult: CompressionResult | null = null;
  let advancedResult: CompressionResult | null = null;
  let presetResult: CompressionResult | null = null;
  let filterResult: CompressionResult | null = null;
  let pixResult: CompressionResult | null = null;
  let smartQualityResult: CompressionResult | null = null;
  let conversionResult: CompressionResult | null = null;
  let pngResult: CompressionResult | null = null;
  $: pngSavings = pngResult ? pngResult.originalSize - pngResult.compressedSize : 0;
  let smartCropResult: CompressionResult | null = null;
  let watermarkResult: CompressionResult | null = null;
  let performanceResult: CompressionResult | null = null;
  let batchResults: CompressionResult[] = [];
  let error: string | null = null;

  let basicProgress = 0;
  let advancedProgress = 0;
  let presetProgress = 0;
  let filterProgress = 0;
  let pixProgress = 0;
  let smartQualityProgress = 0;
  let conversionProgress = 0;
  let pngProgress = 0;
  let smartCropProgress = 0;
  let watermarkProgress = 0;
  let performanceProgress = 0;
  let batchProgress = 0;

  let basicOriginalUrl = '';
  let basicCompressedUrl = '';
  let advancedOriginalUrl = '';
  let advancedCompressedUrl = '';
  let presetOriginalUrl = '';
  let presetCompressedUrl = '';
  let filterOriginalUrl = '';
  let filterCompressedUrl = '';
  let pixOriginalUrl = '';
  let pixCompressedUrl = '';
  let watermarkCompressedUrl = '';

  $: batchTotalOriginal = batchResults.reduce((sum, r) => sum + r.originalSize, 0);
  $: batchTotalCompressed = batchResults.reduce((sum, r) => sum + r.compressedSize, 0);
  $: batchAverageRatio = batchResults.length === 0
    ? 0
    : batchResults.reduce((sum, r) => sum + r.compressionRatio, 0) / batchResults.length;

  function setOriginalUrl(target: 'basic' | 'advanced' | 'preset' | 'filter' | 'pix', url: string) {
    const map = {
      basic: () => { if (basicOriginalUrl) URL.revokeObjectURL(basicOriginalUrl); basicOriginalUrl = url; },
      advanced: () => { if (advancedOriginalUrl) URL.revokeObjectURL(advancedOriginalUrl); advancedOriginalUrl = url; },
      preset: () => { if (presetOriginalUrl) URL.revokeObjectURL(presetOriginalUrl); presetOriginalUrl = url; },
      filter: () => { if (filterOriginalUrl) URL.revokeObjectURL(filterOriginalUrl); filterOriginalUrl = url; },
      pix: () => { if (pixOriginalUrl) URL.revokeObjectURL(pixOriginalUrl); pixOriginalUrl = url; },
    };
    map[target]();
  }

  function onBasicSource(e: CustomEvent<{ url: string }>) { setOriginalUrl('basic', e.detail.url); }
  function onAdvancedSource(e: CustomEvent<{ url: string }>) { setOriginalUrl('advanced', e.detail.url); }
  function onPresetSource(e: CustomEvent<{ url: string }>) { setOriginalUrl('preset', e.detail.url); }
  function onFilterSource(e: CustomEvent<{ url: string }>) { setOriginalUrl('filter', e.detail.url); }
  function onPixSource(e: CustomEvent<{ url: string }>) { setOriginalUrl('pix', e.detail.url); }

  function handleBasicCompress(e: CustomEvent<CompressionResult>) {
    const result = e.detail;
    basicResult = result;
    basicProgress = 1;
    if (basicCompressedUrl) URL.revokeObjectURL(basicCompressedUrl);
    if (result.file) basicCompressedUrl = await createPreviewObjectURL(result.file, result.format);
  }

  function handleAdvancedCompress(e: CustomEvent<CompressionResult>) {
    const result = e.detail;
    advancedResult = result;
    advancedProgress = 1;
    if (advancedCompressedUrl) URL.revokeObjectURL(advancedCompressedUrl);
    if (result.file) advancedCompressedUrl = await createPreviewObjectURL(result.file, result.format);
  }

  function handlePresetCompress(e: CustomEvent<CompressionResult>) {
    const result = e.detail;
    presetResult = result;
    presetProgress = 1;
    if (presetCompressedUrl) URL.revokeObjectURL(presetCompressedUrl);
    if (result.file) presetCompressedUrl = await createPreviewObjectURL(result.file, result.format);
  }

  function handleFilterCompress(e: CustomEvent<CompressionResult>) {
    const result = e.detail;
    filterResult = result;
    filterProgress = 1;
    if (filterCompressedUrl) URL.revokeObjectURL(filterCompressedUrl);
    if (result.file) filterCompressedUrl = await createPreviewObjectURL(result.file, result.format);
  }

  function handlePixCompress(e: CustomEvent<CompressionResult>) {
    const result = e.detail;
    pixResult = result;
    pixProgress = 1;
    if (pixCompressedUrl) URL.revokeObjectURL(pixCompressedUrl);
    if (result.file) pixCompressedUrl = await createPreviewObjectURL(result.file, result.format);
  }

  function handleSmartQualityCompress(e: CustomEvent<CompressionResult>) {
    smartQualityResult = e.detail;
    smartQualityProgress = 1;
  }

  function handleConversionCompress(e: CustomEvent<CompressionResult>) {
    conversionResult = e.detail;
    conversionProgress = 1;
  }

  function handlePNGCompress(e: CustomEvent<CompressionResult>) {
    pngResult = e.detail;
    pngProgress = 1;
  }

  function handleSmartCropCompress(e: CustomEvent<CompressionResult>) {
    smartCropResult = e.detail;
    smartCropProgress = 1;
  }

  function handleWatermarkCompress(e: CustomEvent<CompressionResult>) {
    const result = e.detail;
    watermarkResult = result;
    watermarkProgress = 1;
    if (result.file) {
      watermarkCompressedUrl = await createPreviewObjectURL(result.file, result.format);
    }
  }

  function handlePerformanceCompress(e: CustomEvent<CompressionResult>) {
    performanceResult = e.detail;
    performanceProgress = 1;
  }

  async function handleBatchFiles(e: Event) {
    const files = Array.from((e.target as HTMLInputElement).files || []);
    if (files.length === 0) return;

    batchProgress = 0;
    batchResults = [];

    try {
      let completed = 0;
      const results = await compressBatch(files, {
        quality: 0.8,
        concurrency: 3,
        onItemComplete: () => {
          completed++;
          batchProgress = completed / files.length;
        },
      });
      batchResults = results;
      batchProgress = 1;
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Batch compression failed'));
    }
  }

  function handleError(err: Error | CustomEvent<Error>) {
    const message = err instanceof CustomEvent ? err.detail.message : err.message;
    error = message;
    console.error('Compression error:', err instanceof CustomEvent ? err.detail : err);
    setTimeout(() => {
      error = null;
    }, 5000);
  }

  async function compressSample(sample: typeof sampleImages[0]) {
    sampleLoading = sample.id;
    try {
      const file = await fetchSampleFile(sample);
      if (sampleOriginalUrl) URL.revokeObjectURL(sampleOriginalUrl);
      if (sampleCompressedUrl) URL.revokeObjectURL(sampleCompressedUrl);
      sampleOriginalUrl = URL.createObjectURL(file);
      const result = await compress(file, {
        quality: 0.85,
        format: 'image/pixu',
        stripMetadata: true,
        enableSmartQuality: true,
      });
      sampleCompressedUrl = await createPreviewObjectURL(result.file, result.format);
      sampleResult = { ...result, label: sample.label };
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Sample compression failed'));
    } finally {
      sampleLoading = null;
    }
  }

  async function downloadAs(file: File | Blob, name: string, format: DownloadImageFormat) {
    await downloadImageAs(file, `${name}-${Date.now()}`, format);
  }

  function formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes === 0) return '0 Bytes';
    const sign = bytes < 0 ? '-' : '';
    const abs = Math.abs(bytes);
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.min(sizes.length - 1, Math.floor(Math.log(abs) / Math.log(k)));
    return `${sign}${Math.round((abs / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  }
</script>

<div class="container">
  <header class="pixu-header">
    <img src="/logo.png" alt="Pixu" class="pixu-logo" />
    <div class="pixu-brand">
      <h1>Pixu × Svelte</h1>
      <p>Documentation-style examples — same layout as the Pixu docs</p>
    </div>
  </header>

  <section class="pixu-gallery">
    <span class="pixu-samples-label">Real sample images — click to compress with PIXU</span>
    <div class="pixu-gallery-grid">
      {#each sampleImages as sample (sample.id)}
        <button
          type="button"
          class="pixu-gallery-card"
          class:loading={sampleLoading === sample.id}
          disabled={sampleLoading === sample.id}
          on:click={() => compressSample(sample)}
        >
          <img src={sample.url} alt={sample.label} loading="lazy" />
          <span>{sampleLoading === sample.id ? 'Compressing…' : sample.label}</span>
        </button>
      {/each}
    </div>
  </section>

  {#if sampleResult}
    <div class="section sample-result">
      <h2>Sample compression result</h2>
      <p class="description">{sampleResult.label} — {sampleResult.format} ({(sampleResult.compressionRatio * 100).toFixed(1)}% reduction)</p>
      <div class="image-comparison">
        <div class="image-preview">
          <h4>Original</h4>
          <img src={sampleOriginalUrl} alt="Original" />
          <p class="image-info">{formatBytes(sampleResult.originalSize)}</p>
        </div>
        <div class="image-preview">
          <h4>Compressed</h4>
          <img src={sampleCompressedUrl} alt="Compressed" />
          <p class="image-info">{formatBytes(sampleResult.compressedSize)}</p>
          <div class="download-pair">
            <button type="button" on:click={() => downloadAs(sampleResult.file, sampleResult.label, 'image/webp')} class="download-btn">Download (.webp)</button>
            <button type="button" on:click={() => downloadAs(sampleResult.file, sampleResult.label, 'image/jpeg')} class="download-btn">Download (.jpg)</button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <div class="content">
    <div class="section">
      <h2>1. Basic Compression</h2>
      <p class="description">Simple compression with quality setting and live preview</p>
      <div class="controls-inline">
        <label>
          Quality: {(basicOptions.quality * 100).toFixed(0)}%
          <input type="range" min="0.1" max="1" step="0.05" bind:value={basicOptions.quality} />
        </label>
      </div>
      <PixuCompressor
        samples={sampleImages}
        options={basicOptions}
        on:source={onBasicSource}
        on:compress={handleBasicCompress}
        on:error={handleError}
        on:progress={(e) => (basicProgress = e.detail)}
      />
      {#if basicProgress > 0 && basicProgress < 1}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {basicProgress * 100}%"></div>
        </div>
      {/if}
      {#if basicResult}
        <div class="image-comparison">
          <div class="image-preview">
            <h4>Original</h4>
            <img src={basicOriginalUrl} alt="Original" />
            <p class="image-info">{formatBytes(basicResult.originalSize)}</p>
          </div>
          <div class="image-preview">
            <h4>Compressed</h4>
            <img src={basicCompressedUrl} alt="Compressed" />
            <p class="image-info">{formatBytes(basicResult.compressedSize)} ({(basicResult.compressionRatio * 100).toFixed(1)}% reduction)</p>
            <div class="download-pair">
              <button type="button" on:click={() => downloadAs(basicResult.file, 'compressed', 'image/webp')} class="download-btn">Download (.webp)</button>
              <button type="button" on:click={() => downloadAs(basicResult.file, 'compressed', 'image/jpeg')} class="download-btn">Download (.jpg)</button>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="section">
      <h2>2. Advanced Options</h2>
      <p class="description">Customize all compression settings with real-time updates</p>
      <div class="controls">
        <label>
          Quality: {(advancedOptions.quality * 100).toFixed(0)}%
          <input type="range" min="0.1" max="1" step="0.05" bind:value={advancedOptions.quality} />
        </label>
        <label>
          Max Width: <input type="number" bind:value={advancedOptions.maxWidth} min="100" max="4000" />
        </label>
        <label>
          Max Height: <input type="number" bind:value={advancedOptions.maxHeight} min="100" max="4000" />
        </label>
        <label>
          Format:
          <select bind:value={advancedOptions.format}>
            <option value="auto">Auto (Prefers PIXU)</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
            <option value="image/pixu">PIXU (Best)</option>
          </select>
        </label>
        <label>
          <input type="checkbox" bind:checked={advancedOptions.stripMetadata} />
          Strip Metadata
        </label>
        <label>
          <input type="checkbox" bind:checked={advancedOptions.enableSmartQuality} />
          Smart Quality
        </label>
      </div>
      <PixuCompressor
        samples={sampleImages}
        options={advancedOptions}
        on:source={onAdvancedSource}
        on:compress={handleAdvancedCompress}
        on:error={handleError}
        on:progress={(e) => (advancedProgress = e.detail)}
      />
      {#if advancedProgress > 0 && advancedProgress < 1}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {advancedProgress * 100}%"></div>
        </div>
      {/if}
      {#if advancedResult}
        <div class="result-card">
          <div class="stats-grid">
            <div class="stat-box">
              <span class="stat-label">Original Size</span>
              <span class="stat-value">{formatBytes(advancedResult.originalSize)}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Compressed Size</span>
              <span class="stat-value highlight">{formatBytes(advancedResult.compressedSize)}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Compression Ratio</span>
              <span class="stat-value success">{(advancedResult.compressionRatio * 100).toFixed(1)}%</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Format</span>
              <span class="stat-value">{advancedResult.format}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Dimensions</span>
              <span class="stat-value">{advancedResult.width}×{advancedResult.height}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Savings</span>
              <span class="stat-value success">{formatBytes(advancedResult.originalSize - advancedResult.compressedSize)}</span>
            </div>
          </div>
          <div class="image-preview-grid">
            <div class="preview-item">
              <img src={advancedOriginalUrl} alt="Original" />
              <p>Original</p>
            </div>
            <div class="preview-item">
              <img src={advancedCompressedUrl} alt="Compressed" />
              <p>Compressed</p>
              <div class="download-pair">
                <button type="button" on:click={() => downloadAs(advancedResult.file, 'advanced', 'image/webp')} class="download-btn-small">Download (.webp)</button>
                <button type="button" on:click={() => downloadAs(advancedResult.file, 'advanced', 'image/jpeg')} class="download-btn-small">Download (.jpg)</button>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="section">
      <h2>3. Compression Presets</h2>
      <p class="description">Compare different presets side by side</p>
      <div class="preset-selector">
        {#each presets as preset}
          <button
            on:click={() => (selectedPreset = preset)}
            class="preset-btn"
            class:active={selectedPreset === preset}
          >
            {presetNames[preset]}
          </button>
        {/each}
      </div>
      <PixuCompressor
        samples={sampleImages}
        options={{ preset: selectedPreset }}
        on:source={onPresetSource}
        on:compress={handlePresetCompress}
        on:error={handleError}
        on:progress={(e) => (presetProgress = e.detail)}
      />
      {#if presetProgress > 0 && presetProgress < 1}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {presetProgress * 100}%"></div>
        </div>
      {/if}
      {#if presetResult}
        <div class="result-card">
          <div class="preset-info">
            <h3>{presetNames[selectedPreset]} Preset</h3>
            <div class="stats-inline">
              <span><strong>Original:</strong> {formatBytes(presetResult.originalSize)}</span>
              <span><strong>Compressed:</strong> {formatBytes(presetResult.compressedSize)}</span>
              <span><strong>Savings:</strong> <span class="success">{formatBytes(presetResult.originalSize - presetResult.compressedSize)}</span></span>
            </div>
          </div>
          <div class="image-preview-grid">
            <div class="preview-item">
              <img src={presetOriginalUrl} alt="Original" />
            </div>
            <div class="preview-item">
              <img src={presetCompressedUrl} alt="Compressed" />
              <div class="download-pair">
                <button type="button" on:click={() => downloadAs(presetResult.file, `preset-${selectedPreset}`, 'image/webp')} class="download-btn-small">Download (.webp)</button>
                <button type="button" on:click={() => downloadAs(presetResult.file, `preset-${selectedPreset}`, 'image/jpeg')} class="download-btn-small">Download (.jpg)</button>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="section">
      <h2>4. Image Filters</h2>
      <p class="description">Apply visual effects with instant preview</p>
      <div class="filter-grid">
        {#each filters as filter}
          <label class="filter-item">
            <input type="checkbox" value={filter} bind:group={selectedFilters} />
            <span>{filterNames[filter]}</span>
          </label>
        {/each}
      </div>
      {#if selectedFilters.length > 0}
        <div class="filter-preview">
          <p>Active Filters: {selectedFilters.map((f) => filterNames[f]).join(', ')}</p>
        </div>
      {/if}
      <PixuCompressor
        samples={sampleImages}
        options={{ quality: 0.8, filters: selectedFilters }}
        on:source={onFilterSource}
        on:compress={handleFilterCompress}
        on:error={handleError}
        on:progress={(e) => (filterProgress = e.detail)}
      />
      {#if filterProgress > 0 && filterProgress < 1}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {filterProgress * 100}%"></div>
        </div>
      {/if}
      {#if filterResult}
        <div class="image-comparison">
          <div class="image-preview">
            <h4>Original</h4>
            <img src={filterOriginalUrl} alt="Original" />
          </div>
          <div class="image-preview">
            <h4>With Filters</h4>
            <img src={filterCompressedUrl} alt="Filtered" />
            <div class="download-pair">
              <button type="button" on:click={() => downloadAs(filterResult.file, 'filtered', 'image/webp')} class="download-btn">Download (.webp)</button>
              <button type="button" on:click={() => downloadAs(filterResult.file, 'filtered', 'image/jpeg')} class="download-btn">Download (.jpg)</button>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="section pix-section">
      <h2>5. PIXU Format - Revolutionary Compression</h2>
      <p class="description">Experience the best compression with Pixu's proprietary PIXU format (30-60% better than JPEG)</p>
      <div class="info-box pix-info">
        <p><strong>PIXU Format</strong> — Reconstructive format under TECR: typically 30–60% smaller than JPEG and 20–40% vs WebP at the same visual budget.</p>
      </div>
      <div class="controls">
        <label>
          Quality: {(pixOptions.quality * 100).toFixed(0)}%
          <input type="range" min="0.1" max="1" step="0.05" bind:value={pixOptions.quality} />
        </label>
        <label>
          Max Width: <input type="number" bind:value={pixOptions.maxWidth} min="100" max="4000" />
        </label>
        <label>
          Max Height: <input type="number" bind:value={pixOptions.maxHeight} min="100" max="4000" />
        </label>
        <label>
          <input type="checkbox" bind:checked={pixOptions.stripMetadata} />
          Strip Metadata
        </label>
        <label>
          <input type="checkbox" bind:checked={pixOptions.enableSmartQuality} />
          Smart Quality
        </label>
      </div>
      <PixuCompressor
        samples={sampleImages}
        options={pixOptions}
        on:source={onPixSource}
        on:compress={handlePixCompress}
        on:error={handleError}
        on:progress={(e) => (pixProgress = e.detail)}
      />
      {#if pixProgress > 0 && pixProgress < 1}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {pixProgress * 100}%"></div>
        </div>
      {/if}
      {#if pixResult}
        <div class="result-card">
          <div class="pix-comparison">
            <h3>PIXU Format Results</h3>
            <div class="stats-grid">
              <div class="stat-box highlight-box">
                <span class="stat-label">Original Size</span>
                <span class="stat-value">{formatBytes(pixResult.originalSize)}</span>
              </div>
              <div class="stat-box highlight-box">
                <span class="stat-label">PIXU Compressed</span>
                <span class="stat-value highlight">{formatBytes(pixResult.compressedSize)}</span>
              </div>
              <div class="stat-box highlight-box">
                <span class="stat-label">Compression Ratio</span>
                <span class="stat-value success">{(pixResult.compressionRatio * 100).toFixed(1)}%</span>
              </div>
              <div class="stat-box highlight-box">
                <span class="stat-label">Format</span>
                <span class="stat-value">{pixResult.format}</span>
              </div>
              <div class="stat-box highlight-box">
                <span class="stat-label">Savings</span>
                <span class="stat-value success">{formatBytes(pixResult.originalSize - pixResult.compressedSize)}</span>
              </div>
              <div class="stat-box highlight-box">
                <span class="stat-label">Dimensions</span>
                <span class="stat-value">{pixResult.width}×{pixResult.height}</span>
              </div>
            </div>
            <div class="image-preview-grid">
              <div class="preview-item">
                <img src={pixOriginalUrl} alt="Original" />
                <p>Original Image</p>
                <p class="image-info">{formatBytes(pixResult.originalSize)}</p>
              </div>
              <div class="preview-item">
                <img src={pixCompressedUrl} alt="PIXU Compressed" />
                <p>PIXU Format ({(pixResult.compressionRatio * 100).toFixed(1)}% smaller)</p>
                <p class="image-info">{formatBytes(pixResult.compressedSize)}</p>
                <div class="download-pair">
                  <button type="button" on:click={() => downloadAs(pixResult.file, 'pixu-compressed', 'image/webp')} class="download-btn">Download (.webp)</button>
                  <button type="button" on:click={() => downloadAs(pixResult.file, 'pixu-compressed', 'image/jpeg')} class="download-btn">Download (.jpg)</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="section">
      <h2>6. Smart Quality Selection</h2>
      <p class="description">Automatic quality optimization based on image content analysis</p>
      <div class="info-box">
        <p>Smart Quality analyzes content and selects quality for best compression while keeping visual fidelity.</p>
      </div>
      <PixuCompressor
        samples={sampleImages}
        options={{ enableSmartQuality: true }}
        on:compress={handleSmartQualityCompress}
        on:error={handleError}
        on:progress={(e) => (smartQualityProgress = e.detail)}
      />
      {#if smartQualityProgress > 0 && smartQualityProgress < 1}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {smartQualityProgress * 100}%"></div>
        </div>
      {/if}
      {#if smartQualityResult}
        <div class="result-card">
          <div class="smart-quality-info">
            <h3>Smart Quality Analysis</h3>
            <div class="stats-grid">
              <div class="stat-box">
                <span class="stat-label">Original</span>
                <span class="stat-value">{formatBytes(smartQualityResult.originalSize)}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Compressed</span>
                <span class="stat-value highlight">{formatBytes(smartQualityResult.compressedSize)}</span>
              </div>
              <div class="stat-box">
                <span class="stat-label">Optimization</span>
                <span class="stat-value success">{(smartQualityResult.compressionRatio * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="section">
      <h2>7. Format Conversion</h2>
      <p class="description">Convert between formats with size comparison</p>
      <div class="controls">
        <label>
          Target Format:
          <select bind:value={conversionFormat}>
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
            <option value="image/pixu">PIXU (Best)</option>
          </select>
        </label>
        <label>
          <input type="checkbox" bind:checked={convertToJPEG} />
          Auto Convert PNG to JPEG
        </label>
      </div>
      <PixuCompressor
        samples={sampleImages}
        options={{ format: conversionFormat, convertToJPEG }}
        on:compress={handleConversionCompress}
        on:error={handleError}
        on:progress={(e) => (conversionProgress = e.detail)}
      />
      {#if conversionProgress > 0 && conversionProgress < 1}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {conversionProgress * 100}%"></div>
        </div>
      {/if}
      {#if conversionResult}
        <div class="result-card">
          <div class="format-comparison">
            <div class="format-item">
              <span class="format-label">Original Format</span>
              <span class="format-value">{conversionResult.format}</span>
            </div>
            <div class="format-item">
              <span class="format-label">Size</span>
              <span class="format-value">{formatBytes(conversionResult.compressedSize)}</span>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="section">
      <h2>8. PNG Optimization</h2>
      <p class="description">Lossless PNG compression with color reduction</p>
      <div class="controls">
        <label>
          <input type="checkbox" bind:checked={pngOptimization.enabled} />
          Enable PNG Optimization
        </label>
        {#if pngOptimization.enabled}
          <label>
            <input type="checkbox" bind:checked={pngOptimization.reduceColors} />
            Reduce Colors
          </label>
        {/if}
        {#if pngOptimization.enabled && pngOptimization.reduceColors}
          <label>
            Max Colors: <input type="number" bind:value={pngOptimization.maxColors} min="2" max="256" />
          </label>
        {/if}
      </div>
      <PixuCompressor
        samples={sampleImages}
        options={pngCompressOptions}
        on:compress={handlePNGCompress}
        on:error={handleError}
        on:progress={(e) => (pngProgress = e.detail)}
      />
      {#if pngProgress > 0 && pngProgress < 1}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {pngProgress * 100}%"></div>
        </div>
      {/if}
      {#if pngResult}
        <div class="result-card">
          <div class="stats-inline">
            <span><strong>Original:</strong> {formatBytes(pngResult.originalSize)}</span>
            <span><strong>Optimized:</strong> {formatBytes(pngResult.compressedSize)}</span>
            <span>
              <strong>Savings:</strong>
              <span class={pngSavings >= 0 ? 'success' : 'danger'}>{formatBytes(pngSavings)}</span>
            </span>
          </div>
        </div>
      {/if}
    </div>

    <div class="section">
      <h2>9. Smart Cropping</h2>
      <p class="description">Intelligent image cropping with focus detection</p>
      <div class="controls">
        <label>
          Crop Width: <input type="number" bind:value={smartCrop.width} min="100" max="2000" />
        </label>
        <label>
          Crop Height: <input type="number" bind:value={smartCrop.height} min="100" max="2000" />
        </label>
        <label>
          Focus:
          <select bind:value={smartCrop.focus}>
            <option value="center">Center</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </label>
      </div>
      <PixuCompressor
        samples={sampleImages}
        options={{ quality: 0.8, smartCrop: { ...smartCrop, enabled: true } }}
        on:compress={handleSmartCropCompress}
        on:error={handleError}
        on:progress={(e) => (smartCropProgress = e.detail)}
      />
      {#if smartCropProgress > 0 && smartCropProgress < 1}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {smartCropProgress * 100}%"></div>
        </div>
      {/if}
      {#if smartCropResult}
        <div class="result-card">
          <div class="stats-inline">
            <span><strong>Dimensions:</strong> {smartCropResult.width}×{smartCropResult.height}</span>
            <span><strong>Size:</strong> {formatBytes(smartCropResult.compressedSize)}</span>
          </div>
        </div>
      {/if}
    </div>

    <div class="section">
      <h2>10. Watermark</h2>
      <p class="description">Add text or image watermarks with customization</p>
      <div class="controls">
        <label>
          Watermark Text: <input type="text" bind:value={watermarkText} placeholder="Enter text" />
        </label>
        <label>
          Position:
          <select bind:value={watermarkPosition}>
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="center">Center</option>
          </select>
        </label>
        <label>
          Opacity: {(watermarkOpacity * 100).toFixed(0)}%
          <input type="range" min="0.1" max="1" step="0.1" bind:value={watermarkOpacity} />
        </label>
      </div>
      <PixuCompressor
        samples={sampleImages}
        options={{
          quality: 0.8,
          watermark: watermarkText
            ? {
                text: watermarkText,
                position: watermarkPosition,
                opacity: watermarkOpacity,
              }
            : undefined,
        }}
        on:compress={handleWatermarkCompress}
        on:error={handleError}
        on:progress={(e) => (watermarkProgress = e.detail)}
      />
      {#if watermarkProgress > 0 && watermarkProgress < 1}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {watermarkProgress * 100}%"></div>
        </div>
      {/if}
      {#if watermarkResult && watermarkText}
        <div class="result-card">
          <div class="image-preview-grid">
            <div class="preview-item">
              <img src={watermarkCompressedUrl} alt="Watermarked" />
              <p>Watermarked Image</p>
              <div class="download-pair">
                <button type="button" on:click={() => downloadAs(watermarkResult.file, 'watermarked', 'image/webp')} class="download-btn-small">Download (.webp)</button>
                <button type="button" on:click={() => downloadAs(watermarkResult.file, 'watermarked', 'image/jpeg')} class="download-btn-small">Download (.jpg)</button>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="section">
      <h2>11. Performance Monitoring</h2>
      <p class="description">Track compression metrics and performance in real-time</p>
      <PixuCompressor
        samples={sampleImages}
        options={{ quality: 0.8, monitorPerformance: true }}
        on:compress={handlePerformanceCompress}
        on:error={handleError}
        on:progress={(e) => (performanceProgress = e.detail)}
      />
      {#if performanceProgress > 0 && performanceProgress < 1}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {performanceProgress * 100}%"></div>
        </div>
      {/if}
      {#if performanceResult}
        <div class="result-card">
          <div class="stats-grid">
            <div class="stat-box">
              <span class="stat-label">Original Size</span>
              <span class="stat-value">{formatBytes(performanceResult.originalSize)}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Compressed Size</span>
              <span class="stat-value highlight">{formatBytes(performanceResult.compressedSize)}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Compression Ratio</span>
              <span class="stat-value success">{(performanceResult.compressionRatio * 100).toFixed(1)}%</span>
            </div>
          </div>
          {#if performanceResult.metrics}
            <div class="metrics-card">
              <h3>Performance Metrics</h3>
              <div class="metrics-grid">
                <div class="metric-item">
                  <span class="metric-label">Duration</span>
                  <span class="metric-value">{performanceResult.metrics.duration?.toFixed(2) || 0}ms</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Memory Used</span>
                  <span class="metric-value">{formatBytes(performanceResult.metrics.memoryUsed || 0)}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Throughput</span>
                  <span class="metric-value">{formatBytes(performanceResult.metrics.throughput || 0)}/s</span>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <div class="section">
      <h2>12. Batch Processing</h2>
      <p class="description">Compress multiple images at once with progress tracking</p>
      <div class="batch-controls">
        <input type="file" multiple on:change={handleBatchFiles} accept="image/*" id="batch-input" />
        <label for="batch-input" class="file-input-label">Select Multiple Images</label>
      </div>
      {#if batchProgress > 0 && batchProgress < 1}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {batchProgress * 100}%"></div>
          <span class="progress-text">{Math.round(batchProgress * 100)}%</span>
        </div>
      {/if}
      {#if batchResults.length > 0}
        <div class="batch-results">
          <h3>Batch Results ({batchResults.length} images)</h3>
          <div class="batch-summary">
            <div class="summary-item">
              <span class="summary-label">Total Original</span>
              <span class="summary-value">{formatBytes(batchTotalOriginal)}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Compressed</span>
              <span class="summary-value highlight">{formatBytes(batchTotalCompressed)}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Savings</span>
              <span class="summary-value success">{formatBytes(batchTotalOriginal - batchTotalCompressed)}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Average Ratio</span>
              <span class="summary-value">{(batchAverageRatio * 100).toFixed(1)}%</span>
            </div>
          </div>
          <div class="batch-list">
            {#each batchResults as result, index}
              <div class="batch-item">
                <div class="batch-item-info">
                  <span class="batch-index">#{index + 1}</span>
                  <span class="batch-size">{formatBytes(result.originalSize)} → {formatBytes(result.compressedSize)}</span>
                  <span class="batch-ratio success">{(result.compressionRatio * 100).toFixed(1)}%</span>
                </div>
                <div class="download-pair">
                  <button type="button" on:click={() => downloadAs(result.file, `batch-${index}`, 'image/webp')} class="download-btn-tiny">.webp</button>
                  <button type="button" on:click={() => downloadAs(result.file, `batch-${index}`, 'image/jpeg')} class="download-btn-tiny">.jpg</button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>

  {#if error}
    <div class="error-message">
      <p>{error}</p>
      <button on:click={() => (error = null)}>Close</button>
    </div>
  {/if}
</div>
