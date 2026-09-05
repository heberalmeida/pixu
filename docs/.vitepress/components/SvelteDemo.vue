<template>
  <CompressionDemo
    :options="options"
    title="Svelte API — live demo"
    subtitle="Same Pixu compress() used by the Svelte component. Pick a sample or upload."
  />
</template>

<script setup lang="ts">
import CompressionDemo from './CompressionDemo.vue'

defineProps<{
  options?: Record<string, unknown>
}>()
</script>
