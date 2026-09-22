# Componente React

Use o Pixu com React para comprimir imagens com facilidade em suas aplicações React.

## Demo ao Vivo

<ReactDemo :options="{ format: 'image/pixu', enableSmartQuality: true, quality: 0.8 }" />

## Instalação

```bash
npm install pixu react react-dom
```

## Uso Básico

Importe e use o componente `PixuCompressor`:

```tsx
import React from 'react';
import PixuCompressor from 'pixu/components/react/PixuCompressor';
import 'pixu/components/react/PixuCompressor.css';
import type { CompressionResult } from 'pixu';

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

Tipo: `CompressionOptions`

Opções de compressão. Veja [CompressionOptions](/pt-BR/api/types#compressionoptions).

### autoCompress

Tipo: `boolean`

Padrão: `true`

Comprime automaticamente quando um arquivo é selecionado.

### samples

Tipo: `SampleImageOption[]`

Fotos inclusas opcionais exibidas como miniaturas na área de upload. Clique para comprimir sem o seletor de arquivos.

```tsx
<PixuCompressor
  samples={sampleImages}
  options={{ format: 'image/pixu' }}
/>
```

Veja [Exemplos de Frameworks](/pt-BR/examples/).

### onCompress

Tipo: `(result: CompressionResult) => void`

Callback disparado quando a compressão é concluída com sucesso.

### onError

Tipo: `(error: Error) => void`

Callback disparado quando a compressão falha.

### onProgress

Tipo: `(progress: number) => void`

Callback disparado durante a compressão para reportar o progresso.

## Exemplo Avançado

```tsx
import React, { useState } from 'react';
import PixuCompressor from 'pixu/components/react/PixuCompressor';
import 'pixu/components/react/PixuCompressor.css';
import type { CompressionResult } from 'pixu';

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

## Com TypeScript

O componente é totalmente tipado:

```tsx
import React from 'react';
import PixuCompressor from 'pixu/components/react/PixuCompressor';
import type { CompressionOptions, CompressionResult } from 'pixu';

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

## Personalização

O componente usa classes CSS. Você pode sobrescrever os estilos:

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

## Recursos

- Suporte a arrastar e soltar
- Acompanhamento de progresso
- Tratamento de erros
- Download da imagem comprimida
- Design responsivo
- Suporte a TypeScript
- API baseada em hooks
