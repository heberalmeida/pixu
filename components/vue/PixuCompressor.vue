<template>
  <div class="pixu-compressor">
    <div v-if="!file" class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
      <input
        ref="fileInput"
        type="file"
        @change="handleFileChange"
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
      <div v-if="samples?.length" class="sample-gallery" @click.stop>
        <p class="sample-label">Or try a real sample</p>
        <div class="sample-grid">
          <button
            v-for="sample in samples"
            :key="sample.id"
            type="button"
            class="sample-card"
            @click="loadSample(sample)"
          >
            <img :src="sample.url" :alt="sample.label" loading="lazy" />
            <span>{{ sample.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="compression-container">
      <div class="image-preview-section">
        <div class="image-preview">
          <h4>Original</h4>
          <img v-if="originalUrl" :src="originalUrl" :key="originalUrl" alt="Original" />
          <div class="image-info">
            <span>{{ formatBytes(originalSize) }}</span>
          </div>
        </div>
        <div class="image-preview" v-if="result">
          <h4>Compressed</h4>
          <img v-if="compressedUrl" :src="compressedUrl" :key="compressedUrl" alt="Compressed" />
          <div class="image-info">
            <span>{{ formatBytes(result.compressedSize) }}</span>
            <span>{{ result.width }}x{{ result.height }}</span>
          </div>
        </div>
      </div>

      <div v-if="loading" class="progress-section">
        <progress :value="progress" max="1" class="progress-bar"></progress>
        <p class="progress-text">Compressing... {{ Math.round(progress * 100) }}%</p>
      </div>

      <div v-if="result" class="result-section">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Compression Ratio</span>
            <span class="stat-value">{{ (result.compressionRatio * 100).toFixed(1) }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Size Reduction</span>
            <span
              class="stat-value"
              :class="originalSize - result.compressedSize >= 0 ? 'success' : 'danger'"
            >{{ formatBytes(originalSize - result.compressedSize) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Format</span>
            <span class="stat-value">{{ result.format }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Quality</span>
            <span class="stat-value">{{ qualityPercent }}</span>
          </div>
        </div>
        <div class="actions">
          <button @click="downloadFile" class="btn btn-primary">Download Compressed</button>
          <button @click="reset" class="btn btn-secondary">Compress Another</button>
        </div>
      </div>

      <div v-if="error" class="error-section">
        <p class="error-message">{{ error }}</p>
        <button @click="reset" class="btn btn-secondary">Try Again</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import type { CompressionOptions, CompressionResult } from 'pixu';

interface SampleImageOption {
  id: string;
  label: string;
  url: string;
  file: string;
}

const props = withDefaults(defineProps<{
  options?: CompressionOptions;
  autoCompress?: boolean;
  samples?: SampleImageOption[];
}>(), {
  autoCompress: true,
});

const emit = defineEmits<{
  compress: [result: CompressionResult];
  error: [error: Error];
  progress: [progress: number];
  source: [payload: { file: File; url: string }];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);
const loading = ref(false);
const progress = ref(0);
const error = ref<string | null>(null);
const result = ref<CompressionResult | null>(null);
const originalUrl = ref<string | null>(null);
const compressedUrl = ref<string | null>(null);

const originalSize = computed(() => file.value?.size || 0);
const qualityPercent = computed(() => {
  const q = result.value?.metadata?.quality;
  return q == null ? '—' : `${Math.round(q * 100)}%`;
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const selectedFile = target.files?.[0];
  if (!selectedFile) return;
  await processFile(selectedFile);
  target.value = '';
};

const handleDrop = async (e: DragEvent) => {
  e.preventDefault();
  const droppedFile = e.dataTransfer?.files[0];
  if (droppedFile && droppedFile.type.startsWith('image/')) {
    await processFile(droppedFile);
  }
};

const loadSample = async (sample: SampleImageOption) => {
  const res = await fetch(sample.url);
  if (!res.ok) return;
  const blob = await res.blob();
  const sampleFile = new File([blob], sample.file, { type: blob.type || 'image/jpeg' });
  await processFile(sampleFile);
};

const runCompress = async (fileForCompress: File) => {
  const { compress } = await import('pixu');
  if (compressedUrl.value) {
    URL.revokeObjectURL(compressedUrl.value);
    compressedUrl.value = null;
  }
  const compressionResult = await compress(fileForCompress, {
    ...props.options,
    onProgress: (p: number) => {
      progress.value = p;
      emit('progress', p);
    },
  });
  result.value = compressionResult;
  compressedUrl.value = URL.createObjectURL(compressionResult.file);
  emit('compress', compressionResult);
};

const processFile = async (selectedFile: File) => {
  loading.value = true;
  error.value = null;
  progress.value = 0;
  result.value = null;

  if (originalUrl.value) {
    URL.revokeObjectURL(originalUrl.value);
    originalUrl.value = null;
  }
  if (compressedUrl.value) {
    URL.revokeObjectURL(compressedUrl.value);
    compressedUrl.value = null;
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

    file.value = fileForCompress;
    originalUrl.value = URL.createObjectURL(previewBlob);
    emit('source', {
      file: fileForCompress,
      url: URL.createObjectURL(appPreviewBlob),
    });

    if (!props.autoCompress) {
      loading.value = false;
      return;
    }

    await runCompress(fileForCompress);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Compression failed';
    error.value = errorMessage;
    emit('error', err instanceof Error ? err : new Error(errorMessage));
  } finally {
    loading.value = false;
  }
};

let lastOptionsKey = JSON.stringify(props.options ?? {});
watch(
  () => JSON.stringify(props.options ?? {}),
  async (nextKey) => {
    if (nextKey === lastOptionsKey) return;
    lastOptionsKey = nextKey;
    if (!file.value || !props.autoCompress || loading.value) return;
    loading.value = true;
    error.value = null;
    progress.value = 0;
    try {
      await runCompress(file.value);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Compression failed';
      error.value = errorMessage;
      emit('error', err instanceof Error ? err : new Error(errorMessage));
    } finally {
      loading.value = false;
    }
  }
);

const downloadFile = () => {
  if (!result.value) return;
  
  const link = document.createElement('a');
  link.href = compressedUrl.value || '';
  link.download = `compressed-${file.value?.name || 'image'}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const reset = () => {
  file.value = null;
  result.value = null;
  error.value = null;
  progress.value = 0;
  if (originalUrl.value) {
    URL.revokeObjectURL(originalUrl.value);
    originalUrl.value = null;
  }
  if (compressedUrl.value) {
    URL.revokeObjectURL(compressedUrl.value);
    compressedUrl.value = null;
  }
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

onUnmounted(() => {
  if (originalUrl.value) {
    URL.revokeObjectURL(originalUrl.value);
  }
  if (compressedUrl.value) {
    URL.revokeObjectURL(compressedUrl.value);
  }
});
</script>

<style scoped>
.pixu-compressor {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.upload-area {
  border: 2px dashed var(--vp-c-divider);
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--vp-c-bg-soft);
}

.upload-area:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-content svg {
  color: var(--vp-c-text-2);
}

.upload-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin: 0;
}

.upload-hint {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

.sample-gallery {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--vp-c-divider, rgba(123, 63, 239, 0.25));
}

.sample-label {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-2, #8b95a8);
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
  border: 1px solid var(--vp-c-divider, rgba(123, 63, 239, 0.25));
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
}

.sample-card:hover {
  border-color: var(--vp-c-brand, #00ccff);
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
  color: var(--vp-c-text-1, #eef2ff);
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
  color: var(--vp-c-text-1);
}

.image-preview img {
  width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  max-height: 400px;
  object-fit: contain;
}

.image-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
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
  color: var(--vp-c-text-2);
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
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-brand);
}

.stat-value.success {
  color: #27ae60;
}

.stat-value.danger {
  color: #c0392b;
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
  background: var(--vp-c-brand);
  color: white;
}

.btn-primary:hover {
  background: var(--vp-c-brand-dark);
}

.btn-secondary {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.btn-secondary:hover {
  background: var(--vp-c-bg);
}

.error-section {
  padding: 1.5rem;
  background: var(--vp-c-red-soft);
  border: 1px solid var(--vp-c-red);
  border-radius: 6px;
  text-align: center;
}

.error-message {
  color: var(--vp-c-red);
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

