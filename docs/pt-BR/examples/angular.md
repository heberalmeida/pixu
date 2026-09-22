# Exemplos Angular

Mesmo layout de documentação deste site. Demo ao vivo abaixo; app completo em `examples/angular/`.

## Demo ao vivo

<AngularDemo :options="{ format: 'image/pixu', enableSmartQuality: true, quality: 0.85 }" />

## Projeto completo

```bash
npm run build
cd examples/angular && npm install && npm start
```

`http://localhost:4200` — imagens de amostra em `src/assets/`.

[Todos os exemplos por framework →](/pt-BR/examples/)

## Componente Angular básico

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
      [samples]="sampleImages"
      [options]="{ quality: 0.85, format: 'image/pixu' }"
      (compress)="handleCompress($event)"
    ></pixu-compressor>
  `
})
export class AppComponent {
  handleCompress(result: CompressionResult) {
    console.log('Compressed:', result);
  }
}
```

## Com opções

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
      (compress)="handleCompress($event)"
      (error)="handleError($event)"
      (progress)="handleProgress($event)"
    ></pixu-compressor>
  `
})
export class ImageCompressorComponent {
  options = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'auto' as const,
    stripMetadata: true,
  };

  handleCompress(result: CompressionResult) {
    console.log('Compression completed:', result);
  }

  handleError(error: Error) {
    console.error('Error:', error);
  }

  handleProgress(progress: number) {
    console.log('Progress:', progress);
  }
}
```

## Exemplo completo

```typescript
import { Component } from '@angular/core';
import { PixuCompressorComponent } from 'pixu/components/angular/pixu-compressor.component';
import { CommonModule } from '@angular/common';
import type { CompressionResult } from 'pixu';

@Component({
  selector: 'app-image-compressor',
  standalone: true,
  imports: [PixuCompressorComponent, CommonModule],
  template: `
    <div class="container">
      <h1>Image Compressor</h1>
      
      <pixu-compressor
        [options]="compressionOptions"
        (compress)="handleCompress($event)"
        (error)="handleError($event)"
        (progress)="handleProgress($event)"
      ></pixu-compressor>
      
      <div *ngIf="result" class="result">
        <h2>Compression Results</h2>
        <ul>
          <li>Original size: {{ formatBytes(result.originalSize) }}</li>
          <li>Compressed size: {{ formatBytes(result.compressedSize) }}</li>
          <li>Ratio: {{ (result.compressionRatio * 100).toFixed(1) }}%</li>
          <li>Format: {{ result.format }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .result {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f9fafb;
      border-radius: 8px;
    }

    .result ul {
      list-style: none;
      padding: 0;
    }

    .result li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #e5e7eb;
    }
  `]
})
export class ImageCompressorComponent {
  compressionOptions = {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'auto' as const,
    stripMetadata: true,
    enableSmartQuality: true,
  };

  result: CompressionResult | null = null;

  handleCompress(compressionResult: CompressionResult) {
    this.result = compressionResult;
  }

  handleError(error: Error) {
    alert(`Error: ${error.message}`);
  }

  handleProgress(progress: number) {
    console.log('Progress:', progress);
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
```
