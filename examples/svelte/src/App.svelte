<script lang="ts">
  import { onMount } from 'svelte';
  import PixuCompressor from '../../../components/svelte/PixuCompressor.svelte';
  import type { CompressionResult } from 'pixu';
  import { compress } from 'pixu';
  import { sampleImages, fetchSampleFile } from '../../shared/samples';

  let basicOptions = { quality: 0.8 };
  let advancedOptions = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'auto',
    stripMetadata: true,
  };

  let presets = ['web', 'print', 'social', 'thumbnail', 'email'];
  let selectedPreset = 'web';

  let basicResult: CompressionResult | null = null;
  let advancedResult: CompressionResult | null = null;
  let presetResult: CompressionResult | null = null;
  let error: string | null = null;
  let sampleLoading: string | null = null;
  let sampleResult: (CompressionResult & { label: string }) | null = null;
  let sampleOriginalUrl = '';
  let sampleCompressedUrl = '';

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
      sampleCompressedUrl = URL.createObjectURL(result.file);
      sampleResult = { ...result, label: sample.label };
    } catch (err) {
      handleError(new CustomEvent('error', { detail: err instanceof Error ? err : new Error('Sample compression failed') }));
    } finally {
      sampleLoading = null;
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  function handleBasicCompress(event: CustomEvent<CompressionResult>) {
    basicResult = event.detail;
  }

  function handleAdvancedCompress(event: CustomEvent<CompressionResult>) {
    advancedResult = event.detail;
  }

  function handlePresetCompress(event: CustomEvent<CompressionResult>) {
    presetResult = event.detail;
  }

  function handleError(event: CustomEvent<Error>) {
    error = event.detail.message;
    console.error('Compression error:', event.detail);
    setTimeout(() => {
      error = null;
    }, 5000);
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
    <div class="section">
      <h2>Sample compression result</h2>
      <p class="description">{sampleResult.label} — {sampleResult.format} ({(sampleResult.compressionRatio * 100).toFixed(1)}% reduction)</p>
      <div class="sample-preview">
        <figure><img src={sampleOriginalUrl} alt="Original" /><figcaption>{formatBytes(sampleResult.originalSize)}</figcaption></figure>
        <figure><img src={sampleCompressedUrl} alt="Compressed" /><figcaption>{formatBytes(sampleResult.compressedSize)}</figcaption></figure>
      </div>
    </div>
  {/if}

  <div class="content">
    <!-- Basic Compression -->
    <div class="section">
      <h2>1. Basic Compression</h2>
      <p class="description">Simple compression with quality setting only</p>
      <PixuCompressor
        samples={sampleImages}
        options={basicOptions}
        on:compress={handleBasicCompress}
        on:error={handleError}
      />
      {#if basicResult}
        <div class="result-card">
          <h3>Result</h3>
          <div class="stats">
            <div class="stat">
              <span class="label">Original:</span>
              <span class="value">{formatBytes(basicResult.originalSize)}</span>
            </div>
            <div class="stat">
              <span class="label">Compressed:</span>
              <span class="value">{formatBytes(basicResult.compressedSize)}</span>
            </div>
            <div class="stat">
              <span class="label">Ratio:</span>
              <span class="value">{(basicResult.compressionRatio * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Advanced Options -->
    <div class="section">
      <h2>2. Advanced Options</h2>
      <p class="description">Customizable quality, dimensions, format, and metadata</p>
      <div class="controls">
        <label>
          Quality: {(advancedOptions.quality * 100).toFixed(0)}%
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            bind:value={advancedOptions.quality}
          />
        </label>
        <label>
          Max Width:
          <input
            type="number"
            bind:value={advancedOptions.maxWidth}
            min="100"
            max="4000"
          />
        </label>
        <label>
          Format:
          <select bind:value={advancedOptions.format}>
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
            bind:checked={advancedOptions.stripMetadata}
          />
          Strip Metadata
        </label>
      </div>
      <PixuCompressor
        samples={sampleImages}
        options={advancedOptions}
        on:compress={handleAdvancedCompress}
        on:error={handleError}
      />
      {#if advancedResult}
        <div class="result-card">
          <h3>Result</h3>
          <div class="stats">
            <div class="stat">
              <span class="label">Original:</span>
              <span class="value">{formatBytes(advancedResult.originalSize)}</span>
            </div>
            <div class="stat">
              <span class="label">Compressed:</span>
              <span class="value">{formatBytes(advancedResult.compressedSize)}</span>
            </div>
            <div class="stat">
              <span class="label">Format:</span>
              <span class="value">{advancedResult.format}</span>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Presets -->
    <div class="section">
      <h2>3. Compression Presets</h2>
      <p class="description">Pre-configured settings for common use cases</p>
      <div class="preset-selector">
        {#each presets as preset}
          <button
            class="preset-btn {selectedPreset === preset ? 'active' : ''}"
            on:click={() => selectedPreset = preset}
          >
            {preset}
          </button>
        {/each}
      </div>
      <PixuCompressor
        samples={sampleImages}
        options={{ preset: selectedPreset }}
        on:compress={handlePresetCompress}
        on:error={handleError}
      />
      {#if presetResult}
        <div class="result-card">
          <h3>Result</h3>
          <div class="stats">
            <div class="stat">
              <span class="label">Preset:</span>
              <span class="value">{selectedPreset}</span>
            </div>
            <div class="stat">
              <span class="label">Original:</span>
              <span class="value">{formatBytes(presetResult.originalSize)}</span>
            </div>
            <div class="stat">
              <span class="label">Compressed:</span>
              <span class="value">{formatBytes(presetResult.compressedSize)}</span>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  {#if error}
    <div class="error-message">
      <p>{error}</p>
      <button on:click={() => error = null}>Close</button>
    </div>
  {/if}
</div>

