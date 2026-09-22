# React Component

Use Pixu with React for easy image compression in your React applications.

## Live Demo

<ReactDemo :options="{ format: 'image/pixu', enableSmartQuality: true, quality: 0.8 }" />

## Installation

```bash
npm install @pantanal/pixu react react-dom
```

## Basic Usage

Import and use the `PixuCompressor` component:

```tsx
import React from 'react';
import PixuCompressor from 'pixu/components/react/PixuCompressor';
import 'pixu/components/react/PixuCompressor.css';
import type { CompressionResult } from '@pantanal/pixu';

function App() {
  const handleCompress = (result: CompressionResult) => {
    console.log('Compressed:', result);
  };

  const handleError = (error: Error) => {
    console.error('Error:', error);
  };

  return (
    <PixuCompressor
      options={{
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1080,
      }}
      onCompress={handleCompress}
      onError={handleError}
    />
  );
}

export default App;
```

## Props

### options

Type: `CompressionOptions`

Compression options. See [CompressionOptions](/api/types#compressionoptions).

### autoCompress

Type: `boolean`

Default: `true`

Automatically compress when a file is selected.

### samples

Type: `SampleImageOption[]`

Optional bundled photos displayed as thumbnails in the upload area. Click to compress without file picker.

```tsx
<PixuCompressor
  samples={sampleImages}
  options={{ format: 'image/pixu' }}
/>
```

See [Framework Examples](/examples/).

### onCompress

Type: `(result: CompressionResult) => void`

Callback fired when compression completes successfully.

### onError

Type: `(error: Error) => void`

Callback fired when compression fails.

### onProgress

Type: `(progress: number) => void`

Callback fired during compression to report progress.

## Advanced Example

```tsx
import React, { useState } from 'react';
import PixuCompressor from 'pixu/components/react/PixuCompressor';
import 'pixu/components/react/PixuCompressor.css';
import type { CompressionResult } from '@pantanal/pixu';

function App() {
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [progress, setProgress] = useState(0);

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
    console.log('Compression completed:', compressionResult);
  };

  const handleError = (error: Error) => {
    console.error('Compression failed:', error);
    alert(`Error: ${error.message}`);
  };

  const handleProgress = (p: number) => {
    setProgress(p);
    console.log('Progress:', p);
  };

  const download = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(result.file);
    link.download = 'compressed.jpg';
    link.click();
  };

  return (
    <div>
      <PixuCompressor
        options={options}
        autoCompress={true}
        onCompress={handleCompress}
        onError={handleError}
        onProgress={handleProgress}
      />
      
      {result && (
        <div>
          <p>Compression ratio: {(result.compressionRatio * 100).toFixed(1)}%</p>
          <p>Progress: {(progress * 100).toFixed(0)}%</p>
          <button onClick={download}>Download</button>
        </div>
      )}
    </div>
  );
}

export default App;
```

## With TypeScript

The component is fully typed:

```tsx
import React from 'react';
import PixuCompressor from 'pixu/components/react/PixuCompressor';
import type { CompressionOptions, CompressionResult } from '@pantanal/pixu';

interface AppProps {
  // your props
}

const App: React.FC<AppProps> = () => {
  const options: CompressionOptions = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
  };

  const handleCompress = (result: CompressionResult) => {
    // result is fully typed
    console.log(result.compressedSize);
    console.log(result.format);
  };

  return (
    <PixuCompressor
      options={options}
      onCompress={handleCompress}
    />
  );
};

export default App;
```

## Customization

The component uses CSS classes. You can override styles:

```css
.pixu-compressor {
  /* Your custom styles */
}

.upload-area {
  border-color: #3b82f6;
}

.btn-primary {
  background: #3b82f6;
}
```

## Features

- Drag and drop support
- Progress tracking
- Error handling
- Download compressed image
- Responsive design
- TypeScript support
- Hooks-based API

