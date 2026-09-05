<template>
  <CompressionDemo
    :options="options"
    title="React API — live demo"
    subtitle="Same Pixu compress() used by the React component. Pick a sample or upload."
  />
</template>

<script setup lang="ts">
import CompressionDemo from './CompressionDemo.vue'

defineProps<{
  options?: Record<string, unknown>
}>()
</script>
