<template>
  <CompressionDemo
    :options="options"
    title="Jacaré component API — live demo"
    subtitle="Same compress() used by PixuCompressor.jcr. Pick a sample or upload."
  />
</template>

<script setup lang="ts">
import CompressionDemo from './CompressionDemo.vue'

defineProps<{
  options?: Record<string, unknown>
}>()
</script>
