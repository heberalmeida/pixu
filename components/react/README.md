# Pixu React Component

React component for Pixu image compression.

## Installation

```bash
npm install @pantanal/pixu react react-dom
```

## Usage

```tsx
import React from 'react';
import PixuCompressor from 'pixu/components/react/PixuCompressor';
import 'pixu/components/react/PixuCompressor.css';

function App() {
  return (
    <PixuCompressor
      options={{ quality: 0.8 }}
      onCompress={(result) => {
        console.log('Compressed:', result);
      }}
    />
  );
}

export default App;
```

## Documentation

See [React Component Guide](/guide/components/react) for complete documentation.

