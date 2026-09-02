import type { CompressionOptions, CompressionResult, WorkerMessage, WorkerResponse } from '../types';

export class WorkerCompressor {
  private worker: Worker;
  private messageId = 0;
  private pendingMessages = new Map<string, {
    resolve: (value: CompressionResult) => void;
    reject: (error: Error) => void;
  }>();

  constructor(workerUrl?: string | URL) {
    if (workerUrl) {
      this.worker = new Worker(workerUrl, { type: 'module' });
    } else {
      const workerCode = `
        import { PixuCompressor } from './core/compressor.js';
        
        let compressor = null;
        
        self.onmessage = async (event) => {
          const { id, type, payload } = event.data;
          
          try {
            if (type === 'compress' && payload) {
              if (!compressor) {
                compressor = new PixuCompressor();
              }
              
              const { file, fileName, fileType, options } = payload;
              const blob = new Blob([file], { type: fileType });
              const fileObj = new File([blob], fileName, { type: fileType });
              
              const result = await compressor.compress(fileObj, options);
              
              self.postMessage({ id, type: 'success', payload: result });
            } else if (type === 'abort') {
              if (compressor) {
                compressor.abort();
              }
              self.postMessage({ id, type: 'success' });
            }
          } catch (error) {
            self.postMessage({ 
              id, 
              type: 'error', 
              payload: error instanceof Error ? error : new Error('Unknown error')
            });
          }
        };
      `;
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
    }

    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { id, type, payload } = event.data;
      const pending = this.pendingMessages.get(id);

      if (pending) {
        this.pendingMessages.delete(id);

        if (type === 'success') {
          pending.resolve(payload as CompressionResult);
        } else if (type === 'error') {
          pending.reject(payload as Error);
        }
      }
    };

    this.worker.onerror = (error) => {
      console.error('Worker error:', error);
      for (const pending of this.pendingMessages.values()) {
        pending.reject(new Error('Worker error occurred'));
      }
      this.pendingMessages.clear();
    };
  }

  async compress(
    file: File | Blob,
    options: CompressionOptions = {}
  ): Promise<CompressionResult> {
    const id = `msg_${this.messageId++}`;
    const arrayBuffer = await file.arrayBuffer();

    return new Promise((resolve, reject) => {
      this.pendingMessages.set(id, { resolve, reject });

      const message: WorkerMessage = {
        id,
        type: 'compress',
        payload: {
          file: arrayBuffer,
          fileName: file instanceof File ? file.name : 'image',
          fileType: file.type,
          options,
        },
      };

      this.worker.postMessage(message);
    });
  }

  abort(): void {
    const id = `abort_${this.messageId++}`;
    const message: WorkerMessage = { id, type: 'abort' };
    this.worker.postMessage(message);
  }

  terminate(): void {
    this.worker.terminate();
    for (const pending of this.pendingMessages.values()) {
      pending.reject(new Error('Worker terminated'));
    }
    this.pendingMessages.clear();
  }
}

