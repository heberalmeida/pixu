<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { CompressionOptions, CompressionResult } from 'pixu';

  export let options: CompressionOptions = {};
  export let autoCompress: boolean = true;
  export let samples: { id: string; label: string; url: string; file: string }[] = [];

  let file: File | null = null;
  let loading: boolean = false;
  let progress: number = 0;
  let error: string | null = null;
  let result: CompressionResult | null = null;
  let originalUrl: string | null = null;
  let compressedUrl: string | null = null;
  let originalSize: number = 0;
  let originalDimensions: string = '';
  let fileInput: HTMLInputElement;
  let compressFn: any = null;

  const createEvent = (name: string, detail: any) => {
    return new CustomEvent(name, { detail });
  };

  onMount(async () => {
    try {
      const module = await import('pixu');
      compressFn = module.compress;
    } catch (err) {
      console.error('Failed to load pixu:', err);
    }
  });

  onDestroy(() => {
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }
    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
    }
  });

  function triggerFileInput() {
    fileInput?.click();
  }

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0];
    if (selectedFile) {
      await processFile(selectedFile);
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    const droppedFile = event.dataTransfer?.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      await processFile(droppedFile);
    }
  }

  async function loadSample(sample: { id: string; label: string; url: string; file: string }) {
    const res = await fetch(sample.url);
    if (!res.ok) return;
    const blob = await res.blob();
    const file = new File([blob], sample.file, { type: blob.type || 'image/jpeg' });
    await processFile(file);
  }

  async function processFile(selectedFile: File) {
    file = selectedFile;
    loading = true;
    error = null;
    progress = 0;

    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }
    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
    }

    originalUrl = URL.createObjectURL(selectedFile);
    originalSize = selectedFile.size;

    if (!autoCompress) {
      loading = false;
      return;
    }

    try {
      if (!compressFn) {
        const module = await import('pixu');
        compressFn = module.compress;
      }

      const compressionResult = await compressFn(selectedFile, {
        ...options,
        onProgress: (p: number) => {
          progress = p;
          dispatch('progress', p);
        },
      });

      result = compressionResult;
      compressedUrl = URL.createObjectURL(compressionResult.file);
      dispatch('compress', compressionResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Compression failed';
      error = errorMessage;
      dispatch('error', err instanceof Error ? err : new Error(errorMessage));
    } finally {
      loading = false;
    }
  }

  function downloadFile() {
    if (!result || !compressedUrl) return;
    
    const link = document.createElement('a');
    link.href = compressedUrl;
    link.download = `compressed-${file?.name || 'image'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function reset() {
    file = null;
    result = null;
    error = null;
    progress = 0;
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
      originalUrl = null;
    }
    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
      compressedUrl = null;
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  function dispatch(name: string, detail: any) {
    const event = new CustomEvent(name, { detail });
    document.dispatchEvent(event);
  }
</script>

<div class="pixu-compressor">
  {#if !file}
    <div class="upload-area" on:click={triggerFileInput} on:dragover={handleDragOver} on:drop={handleDrop}>
      <input
        bind:this={fileInput}
        type="file"
        on:change={handleFileChange}
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
      {#if samples.length}
        <div class="sample-gallery" on:click|stopPropagation>
          <p class="sample-label">Or try a real sample</p>
          <div class="sample-grid">
            {#each samples as sample (sample.id)}
              <button type="button" class="sample-card" on:click={() => loadSample(sample)}>
                <img src={sample.url} alt={sample.label} loading="lazy" />
                <span>{sample.label}</span>
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="compression-container">
      <div class="image-preview-section">
        <div class="image-preview">
          <h4>Original</h4>
          {#if originalUrl}
            <img src={originalUrl} alt="Original" />
          {/if}
          <div class="image-info">
            <span>{formatBytes(originalSize)}</span>
            <span>{originalDimensions}</span>
          </div>
        </div>
        {#if result}
          <div class="image-preview">
            <h4>Compressed</h4>
            {#if compressedUrl}
              <img src={compressedUrl} alt="Compressed" />
            {/if}
            <div class="image-info">
              <span>{formatBytes(result.compressedSize)}</span>
              <span>{result.width}x{result.height}</span>
            </div>
          </div>
        {/if}
      </div>

      {#if loading}
        <div class="progress-section">
          <progress value={progress} max={1} class="progress-bar"></progress>
          <p class="progress-text">Compressing... {Math.round(progress * 100)}%</p>
        </div>
      {/if}

      {#if result}
        <div class="result-section">
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Compression Ratio</span>
              <span class="stat-value">{(result.compressionRatio * 100).toFixed(1)}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Size Reduction</span>
              <span class="stat-value">{formatBytes(originalSize - result.compressedSize)}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Format</span>
              <span class="stat-value">{result.format}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Quality</span>
              <span class="stat-value">{((result.metadata?.quality || 0) * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div class="actions">
            <button on:click={downloadFile} class="btn btn-primary">Download Compressed</button>
            <button on:click={reset} class="btn btn-secondary">Compress Another</button>
          </div>
        </div>
      {/if}

      {#if error}
        <div class="error-section">
          <p class="error-message">{error}</p>
          <button on:click={reset} class="btn btn-secondary">Try Again</button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
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
    background: rgba(18, 24, 38, 0.6);
    cursor: pointer;
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
    color: #eef2ff;
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
</style>

