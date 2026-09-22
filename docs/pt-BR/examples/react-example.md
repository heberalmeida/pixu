# Exemplos React

Mesmo layout da documentação deste site. Demo ao vivo de `compress()` abaixo; app completo em `examples/react/`.

## Demo ao vivo

<ReactDemo :options="{ format: 'image/pixu', enableSmartQuality: true, quality: 0.85 }" />

## Projeto completo

```bash
npm run build
cd examples/react && npm install && npm run dev
```

`http://localhost:3001`

[Todos os exemplos de frameworks →](/pt-BR/examples/)

## Componentee React básico

```tsx
import React from 'react';
import PixuCompressor from 'pixu/components/react/PixuCompressor';
import 'pixu/components/react/PixuCompressor.css';

const sampleImages = [
  { id: 'landscape', label: 'Mountains', url: '/photo-landscape.jpg', file: 'photo-landscape.jpg' },
];

function App() {
  return (
    <PixuCompressor
      samples={sampleImages}
      options={{ quality: 0.85, format: 'image/pixu' }}
      onCompress={(result) => {
        console.log('Compressed:', result);
      }}
    />
  );
}

export default App;
```

## Com opções

```tsx
import React from 'react';
import PixuCompressor from 'pixu/components/react/PixuCompressor';
import 'pixu/components/react/PixuCompressor.css';
import type { CompressionResult } from '@pantanal/pixu';

function App() {
  const options = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'image/pixu' as const, // Using PIX format for best compression
    stripMetadata: true,
  };

  const handleCompress = (result: CompressionResult) => {
    console.log('Compression completed:', result);
  };

  const handleError = (error: Error) => {
    console.error('Error:', error);
  };

  const handleProgress = (progress: number) => {
    console.log('Progress:', progress);
  };

  return (
    <PixuCompressor
      options={options}
      onCompress={handleCompress}
      onError={handleError}
      onProgress={handleProgress}
    />
  );
}

export default App;
```

## Com formato PIXU (melhor compressão)

```tsx
import React from 'react';
import PixuCompressor from 'pixu/components/react/PixuCompressor';
import 'pixu/components/react/PixuCompressor.css';
import type { CompressionResult } from '@pantanal/pixu';

function App() {
  const handleCompress = (result: CompressionResult) => {
    console.log('PIX compression completed:', result);
    console.log('Size reduction:', (result.compressionRatio * 100).toFixed(1) + '%');
  };

  return (
    <PixuCompressor
      options={{ quality: 0.8, format: 'image/pixu' }}
      onCompress={handleCompress}
    />
  );
}

export default App;
```

## Com preset

```tsx
import React from 'react';
import PixuCompressor from 'pixu/components/react/PixuCompressor';
import 'pixu/components/react/PixuCompressor.css';
import type { CompressionResult } from '@pantanal/pixu';

function App() {
  const handleCompress = (result: CompressionResult) => {
    console.log('Web preset result:', result);
  };

  return (
    <PixuCompressor
      options={{ preset: 'web' }}
      onCompress={handleCompress}
    />
  );
}

export default App;
```

## Com filtros

```tsx
import React from 'react';
import PixuCompressor from 'pixu/components/react/PixuCompressor';
import 'pixu/components/react/PixuCompressor.css';
import type { CompressionResult } from '@pantanal/pixu';

function App() {
  const handleCompress = (result: CompressionResult) => {
    console.log('Filtered result:', result);
  };

  return (
    <PixuCompressor
      options={{
        quality: 0.8,
        filters: ['grayscale'],
      }}
      onCompress={handleCompress}
    />
  );
}

export default App;
```

## Exemplo completo

```tsx
import React, { useState } from 'react';
import PixuCompressor from 'pixu/components/react/PixuCompressor';
import 'pixu/components/react/PixuCompressor.css';
import type { CompressionResult } from '@pantanal/pixu';

function App() {
  const [result, setResult] = useState<CompressionResult | null>(null);

  const options = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'auto' as const,
    stripMetadata: true,
    enableSmartQuality: true,
  };

  const handleCompress = (compressionResult: CompressionResult) => {
    setResult(compressionResult);
  };

  const handleError = (error: Error) => {
    alert(`Error: ${error.message}`);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="container">
      <h1>Image Compressor</h1>
      
      <PixuCompressor
        options={options}
        onCompress={handleCompress}
        onError={handleError}
      />
      
      {result && (
        <div className="result">
          <h2>Compression Results</h2>
          <ul>
            <li>Original size: {formatBytes(result.originalSize)}</li>
            <li>Compressed size: {formatBytes(result.compressedSize)}</li>
            <li>Ratio: {(result.compressionRatio * 100).toFixed(1)}%</li>
            <li>Format: {result.format}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
```

## Com hooks

```tsx
import React, { useState, useCallback } from 'react';
import PixuCompressor from 'pixu/components/react/PixuCompressor';
import 'pixu/components/react/PixuCompressor.css';
import type { CompressionResult } from '@pantanal/pixu';

function useImageCompression() {
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleCompress = useCallback((compressionResult: CompressionResult) => {
    setResult(compressionResult);
    setLoading(false);
  }, []);

  const handleError = useCallback((err: Error) => {
    setError(err);
    setLoading(false);
  }, []);

  return {
    result,
    loading,
    error,
    handleCompress,
    handleError,
  };
}

function App() {
  const { result, handleCompress, handleError } = useImageCompression();

  return (
    <PixuCompressor
      options={{ quality: 0.8 }}
      onCompress={handleCompress}
      onError={handleError}
    />
  );
}

export default App;
```

