<template>
  <div class="vue-demo pixu-doc-demo">
    <div class="demo-header">
      <h4>{{ title }}</h4>
      <p>{{ subtitle }}</p>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <PixuCompressor
      v-else
      :samples="samples"
      :options="demoOptions"
      @compress="handleCompress"
      @error="handleError"
      @progress="handleProgress"
    />

    <div v-if="lastResult" class="result-info">
      <h5>Compression Results</h5>
      <div class="result-stats">
        <div class="stat-row">
          <span class="stat-label">Original Size:</span>
          <span class="stat-value">{{ formatBytes(lastResult.originalSize) }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Compressed Size:</span>
          <span class="stat-value">{{ formatBytes(lastResult.compressedSize) }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Compression Ratio:</span>
          <span class="stat-value">{{ (lastResult.compressionRatio * 100).toFixed(1) }}%</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Format:</span>
          <span class="stat-value">{{ lastResult.format }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Dimensions:</span>
          <span class="stat-value">{{ lastResult.width }}×{{ lastResult.height }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PixuCompressor from '../../../components/vue/PixuCompressor.vue'
import type { CompressionResult } from '@pantanal/pixu'
import { docSampleImages } from '../samples'

const props = withDefaults(defineProps<{
  options?: Record<string, unknown>
  title?: string
  subtitle?: string
}>(), {
  title: 'Vue component — live',
  subtitle: 'PixuCompressor with real sample images',
})

const error = ref<string | null>(null)
const lastResult = ref<CompressionResult | null>(null)
const samples = docSampleImages

const demoOptions = computed(() => ({
  format: 'image/pixu',
  enableSmartQuality: true,
  maxWidth: 1920,
  maxHeight: 1080,
  ...props.options,
}))

const handleCompress = (result: CompressionResult) => {
  lastResult.value = result
  error.value = null
}

const handleError = (err: Error) => {
  error.value = err.message
}

const handleProgress = (_progress: number) => {}

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes === 0) return '0 B'
  const sign = bytes < 0 ? '-' : ''
  const abs = Math.abs(bytes)
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(abs) / Math.log(k)))
  return `${sign}${Math.round((abs / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
}
</script>

<style scoped>
.error-message {
  padding: 1rem;
  background: var(--vp-c-danger-soft, rgba(226, 75, 75, 0.12));
  border: 1px solid var(--vp-c-danger-1, #e24b4b);
  border-radius: 6px;
  color: var(--vp-c-danger-1, #e24b4b);
  margin-bottom: 1rem;
}

.result-info {
  margin-top: 1.25rem;
  padding: 1rem;
  background: var(--vp-c-bg);
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
}

.result-info h5 {
  margin: 0 0 0.85rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 0.5rem;
}

.result-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.35rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.stat-value {
  font-size: 0.9rem;
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
</style>
