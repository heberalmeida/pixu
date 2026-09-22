# Componente Angular

Use o Pixu com Angular para comprimir imagens facilmente nas suas aplicações Angular.

## Demo ao vivo

<AngularDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

## Instalação

```bash
npm install pixu @angular/core @angular/common
```

## Uso básico

Importe e use o `PixuCompressorComponent`:

```typescript
import { Component } from '@angular/core';
import { PixuCompressorComponent } from 'pixu/components/angular/pixu-compressor.component';
import type { CompressionResult } from 'pixu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PixuCompressorComponent],
  template: `
    <pixu-compressor
      [options]="compressionOptions"
      (compress)="handleCompress($event)"
      (error)="handleError($event)"
    ></pixu-compressor>
  `
})
export class AppComponent {
  compressionOptions = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
  };

  handleCompress(result: CompressionResult) {
    console.log('Compressed:', result);
  }

  handleError(error: Error) {
    console.error('Error:', error);
  }
}
```

## Inputs

### options

Type: `CompressionOptions`

Opções de compressão. Veja [CompressionOptions](/pt-BR/api/types#compressionoptions).

### autoCompress

Type: `boolean`

Default: `true`

Comprime automaticamente ao selecionar um arquivo.

### samples

Type: `{ id: string; label: string; url: string; file: string }[]`

Imagens de exemplo opcionais. No Angular use caminhos em `assets/` (ex.: `assets/photo-landscape.jpg`).

```html
<pixu-compressor
  [samples]="sampleImages"
  [options]="{ format: 'image/pixu' }"
></pixu-compressor>
```

See [Exemplos de frameworks](/pt-BR/examples/).

## Outputs

### compress

Emitido quando a compressão conclui com sucesso.

```typescript
@Output() compress = new EventEmitter<CompressionResult>();
```

### error

Emitido quando a compressão falha.

```typescript
@Output() error = new EventEmitter<Error>();
```

### progress

Emitido durante a compressão para reportar o progresso.

```typescript
@Output() progress = new EventEmitter<number>();
```

## Exemplo avançado

```typescript
import { Component } from '@angular/core';
import { PixuCompressorComponent } from 'pixu/components/angular/pixu-compressor.component';
import type { CompressionResult } from 'pixu';

@Component({
  selector: 'app-image-compressor',
  standalone: true,
  imports: [PixuCompressorComponent],
  template: `
    <pixu-compressor
      [options]="options"
      [autoCompress]="true"
      (compress)="onCompress($event)"
      (error)="onError($event)"
      (progress)="onProgress($event)"
    ></pixu-compressor>
    
    <div *ngIf="result">
      <p>Compression ratio: {{ (result.compressionRatio * 100).toFixed(1) }}%</p>
      <button (click)="download()">Download</button>
    </div>
  `
})
export class ImageCompressorComponent {
  options = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'auto' as const,
    stripMetadata: true,
    enableSmartQuality: true,
  };

  result: CompressionResult | null = null;

  onCompress(compressionResult: CompressionResult) {
    this.result = compressionResult;
  }

  onError(error: Error) {
    console.error('Compression failed:', error);
  }

  onProgress(progress: number) {
    console.log('Progress:', progress);
  }

  download() {
    if (!this.result) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(this.result.file);
    link.download = 'compressed.jpg';
    link.click();
  }
}
```

## Recursos

- Suporte a arrastar e soltar
- Acompanhamento de progresso
- Tratamento de erros
- Download da imagem comprimida
- Design responsivo
- Suporte a TypeScript
- Componente standalone

