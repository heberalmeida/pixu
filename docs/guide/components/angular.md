# Angular Component

Use Pixu with Angular for easy image compression in your Angular applications.

## Live Demo

<AngularDemo :options="{ format: 'image/pixu', enableSmartQuality: true }" />

## Installation

```bash
npm install pixu @angular/core @angular/common
```

## Basic Usage

Import and use the `PixuCompressorComponent`:

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

Compression options. See [CompressionOptions](/api/types#compressionoptions).

### autoCompress

Type: `boolean`

Default: `true`

Automatically compress when a file is selected.

### samples

Type: `{ id: string; label: string; url: string; file: string }[]`

Optional sample images. Use `assets/` paths in Angular (e.g. `assets/photo-landscape.jpg`).

```html
<pixu-compressor
  [samples]="sampleImages"
  [options]="{ format: 'image/pixu' }"
></pixu-compressor>
```

See [Framework Examples](/examples/).

## Outputs

### compress

Emitted when compression completes successfully.

```typescript
@Output() compress = new EventEmitter<CompressionResult>();
```

### error

Emitted when compression fails.

```typescript
@Output() error = new EventEmitter<Error>();
```

### progress

Emitted during compression to report progress.

```typescript
@Output() progress = new EventEmitter<number>();
```

## Advanced Example

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

## Features

- Drag and drop support
- Progress tracking
- Error handling
- Download compressed image
- Responsive design
- TypeScript support
- Standalone component

