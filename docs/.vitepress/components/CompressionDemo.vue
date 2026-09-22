<template>
  <div class="compression-demo pixu-doc-demo">
    <div class="demo-header">
      <h4>{{ title }}</h4>
      <p>{{ subtitle }}</p>
    </div>

    <span class="pixu-samples-label">Try a sample image</span>
    <div class="pixu-gallery-grid">
      <button
        v-for="sample in samples"
        :key="sample.id"
        type="button"
        class="pixu-gallery-card"
        :disabled="loading"
        @click="compressSample(sample)"
      >
        <img :src="sample.url" :alt="sample.label" loading="lazy" />
        <span>{{ sample.label }}</span>
      </button>
    </div>

    <div class="demo-controls">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept="image/*"
        class="file-input"
      />
      <div v-if="file" class="file-info">
        <p>Selected: {{ file.name }} ({{ formatBytes(file.size) }})</p>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <progress :value="progress" max="1"></progress>
      <p>Compressing... {{ Math.round(progress * 100) }}%</p>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-if="result" class="result">
      <div class="comparison">
        <div class="image-container">
          <h4>Original</h4>
          <img :src="originalUrl" alt="Original" />
          <p>{{ formatBytes(result.originalSize) }}</p>
        </div>
        <div class="image-container">
          <h4>Compressed</h4>
          <img :src="compressedUrl" alt="Compressed" />
          <p>{{ formatBytes(result.compressedSize) }}</p>
        </div>
      </div>
      <div class="stats">
        <p><strong>Compression Ratio:</strong> {{ (result.compressionRatio * 100).toFixed(1) }}%</p>
        <p><strong>Format:</strong> {{ result.format }}</p>
        <p><strong>Dimensions:</strong> {{ result.width }}×{{ result.height }}</p>
      </div>
      <button type="button" class="download-btn" @click="download">{{ downloadButtonLabel }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { docSampleImages, fetchDocSample, type DocSampleImage } from '../samples'

const props = withDefaults(defineProps<{
  options?: Record<string, unknown>
  title?: string
  subtitle?: string
}>(), {
  title: 'Try it live',
  subtitle: 'Pick a sample or upload your own image',
})

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const loading = ref(false)
const progress = ref(0)
const error = ref<string | null>(null)
const result = ref<any>(null)
const originalUrl = ref<string | null>(null)
const compressedUrl = ref<string | null>(null)
const samples = docSampleImages

const defaultOptions = {
  format: 'image/pixu',
  enableSmartQuality: true,
  stripMetadata: true,
}

async function loadPixu() {
  const module = await import('pixu')
  return module
}

async function runCompress(selected: File) {
  loading.value = true
  error.value = null
  progress.value = 0
  result.value = null

  if (originalUrl.value) {
    URL.revokeObjectURL(originalUrl.value)
    originalUrl.value = null
  }
  if (compressedUrl.value) {
    URL.revokeObjectURL(compressedUrl.value)
    compressedUrl.value = null
  }

  try {
    const buffer = await selected.arrayBuffer()
    const type = selected.type || 'image/jpeg'
    const previewBlob = new Blob([buffer.slice(0)], { type })
    const fileForCompress = new File([buffer], selected.name, {
      type,
      lastModified: selected.lastModified,
    })

    file.value = fileForCompress
    originalUrl.value = URL.createObjectURL(previewBlob)

    const { compress, createPreviewObjectURL } = await loadPixu()
    const compressionResult = await compress(fileForCompress, {
      ...defaultOptions,
      ...props.options,
      onProgress: (p: number) => {
        progress.value = p
      },
    })
    result.value = compressionResult
    if (compressedUrl.value) URL.revokeObjectURL(compressedUrl.value)
    compressedUrl.value = await createPreviewObjectURL(
      compressionResult.file,
      compressionResult.format
    )
  } catch (err) {
    console.error('Compression error:', err)
    error.value = err instanceof Error
      ? err.message
      : 'Compression failed. Run npm run build from the repo root.'
  } finally {
    loading.value = false
  }
}

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (!selectedFile) return
  await runCompress(selectedFile)
  target.value = ''
}

const compressSample = async (sample: DocSampleImage) => {
  try {
    const sampleFile = await fetchDocSample(sample)
    await runCompress(sampleFile)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load sample'
  }
}

const download = async () => {
  if (!result.value || !compressedUrl.value) return
  const { buildDownloadName } = await loadPixu()
  const a = document.createElement('a')
  a.href = compressedUrl.value
  a.download = buildDownloadName('compressed', result.value.format)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const downloadButtonLabel = computed(() => {
  if (!result.value?.format) return 'Download'
  // sync fallback until module loads; button only shown when result exists
  const format = result.value.format
  if (format === 'image/pixu') return 'Download (.pixu)'
  if (format === 'image/jpeg') return 'Download (.jpg)'
  if (format === 'image/png') return 'Download (.png)'
  if (format === 'image/webp') return 'Download (.webp)'
  if (format === 'image/avif') return 'Download (.avif)'
  const sub = String(format).split('/')[1] || 'bin'
  return `Download (.${sub === 'jpeg' ? 'jpg' : sub})`
})

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes === 0) return '0 B'
  const sign = bytes < 0 ? '-' : ''
  const abs = Math.abs(bytes)
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(abs) / Math.log(k)))
  return `${sign}${Math.round((abs / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
}

onUnmounted(() => {
  if (originalUrl.value) URL.revokeObjectURL(originalUrl.value)
  if (compressedUrl.value) URL.revokeObjectURL(compressedUrl.value)
})
</script>

<style scoped>
.demo-controls {
  margin-bottom: 1rem;
}

.file-input {
  padding: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.file-info {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.loading {
  margin: 1rem 0;
}

.loading progress {
  width: 100%;
  height: 8px;
}

.error {
  color: var(--vp-c-danger-1, #e24b4b);
  padding: 1rem;
  background: var(--vp-c-danger-soft, rgba(226, 75, 75, 0.12));
  border-radius: 6px;
}

.result {
  margin-top: 1rem;
}

.comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.image-container {
  text-align: center;
}

.image-container h4 {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.image-container img {
  max-width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}

.stats {
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
}

.stats p {
  margin: 0.4rem 0;
}

.download-btn {
  margin-top: 0.85rem;
  padding: 0.55rem 1.1rem;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 640px) {
  .comparison {
    grid-template-columns: 1fr;
  }
}
</style>
