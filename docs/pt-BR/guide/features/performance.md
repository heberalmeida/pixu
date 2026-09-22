# Monitoramento de Desempenho

Acompanhe métricas de desempenho da compressão.

## Ativar Monitoramento

<CompressionDemo :options="{ quality: 0.8, monitorPerformance: true }" />

<VueDemo :options="{ quality: 0.8, monitorPerformance: true }" />

```typescript
const result = await compress(file, {
  quality: 0.8,
  monitorPerformance: true,
});
```

## Acessar Métricas

```typescript
if (result.metrics) {
  console.log('Duration:', result.metrics.duration);
  console.log('Throughput:', result.metrics.throughput);
  console.log('Memory used:', result.metrics.memoryUsed);
}
```

## Métricas Disponíveis

```typescript
interface CompressionMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  throughput?: number;
  memoryUsed?: number;
  memoryPeak?: number;
}
```

## Helpers de Formatação

```typescript
import { formatBytes, formatDuration } from 'pixu';

const result = await compress(file, {
  monitorPerformance: true,
});

if (result.metrics) {
  console.log('Duration:', formatDuration(result.metrics.duration || 0));
  console.log('Throughput:', formatBytes(result.metrics.throughput || 0) + '/s');
  console.log('Memory:', formatBytes(result.metrics.memoryUsed || 0));
}
```

## Exemplos Completos

```typescript
import { compress, formatBytes, formatDuration } from 'pixu';

async function compressWithMetrics(file: File) {
  const result = await compress(file, {
    quality: 0.8,
    maxWidth: 1920,
    monitorPerformance: true,
    onProgress: (progress) => {
      console.log(`Progress: ${(progress * 100).toFixed(0)}%`);
    },
  });

  if (result.metrics) {
    console.log('Compression Metrics:');
    console.log(`  Start time: ${new Date(result.metrics.startTime).toISOString()}`);
    if (result.metrics.endTime) {
      console.log(`  End time: ${new Date(result.metrics.endTime).toISOString()}`);
    }
    console.log(`  Duration: ${formatDuration(result.metrics.duration || 0)}`);
    console.log(`  Original: ${formatBytes(result.originalSize)}`);
    console.log(`  Compressed: ${formatBytes(result.compressedSize)}`);
    console.log(`  Ratio: ${(result.compressionRatio * 100).toFixed(1)}%`);
    if (result.metrics.throughput) {
      console.log(`  Throughput: ${formatBytes(result.metrics.throughput)}/s`);
    }
    if (result.metrics.memoryUsed) {
      console.log(`  Memory used: ${formatBytes(result.metrics.memoryUsed)}`);
    }
    if (result.metrics.memoryPeak) {
      console.log(`  Memory peak: ${formatBytes(result.metrics.memoryPeak)}`);
    }
  }

  return result;
}

async function benchmarkCompression(file: File, options: any[]) {
  const results: Array<{ options: any; metrics: any; result: any }> = [];

  for (const optionSet of options) {
    const result = await compress(file, {
      ...optionSet,
      monitorPerformance: true,
    });

    results.push({
      options: optionSet,
      metrics: result.metrics,
      result,
    });

    if (result.metrics) {
      console.log(`Options: ${JSON.stringify(optionSet)}`);
      console.log(`  Duration: ${formatDuration(result.metrics.duration || 0)}`);
      console.log(`  Size: ${formatBytes(result.compressedSize)}`);
      console.log(`  Ratio: ${(result.compressionRatio * 100).toFixed(1)}%`);
    }
  }

  return results;
}

async function comparePerformance(file: File) {
  const options = [
    { quality: 0.6, maxWidth: 1920 },
    { quality: 0.8, maxWidth: 1920 },
    { quality: 0.9, maxWidth: 1920 },
    { quality: 0.8, maxWidth: 1280 },
    { quality: 0.8, maxWidth: 2560 },
  ];

  return benchmarkCompression(file, options);
}
```
