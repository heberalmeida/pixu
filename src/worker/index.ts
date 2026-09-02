import type { WorkerMessage, WorkerResponse, CompressionOptions, CompressionResult } from '../types';
import { PixuCompressor } from '../core/compressor';

let compressor: PixuCompressor | null = null;

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
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

      const response: WorkerResponse = {
        id,
        type: 'success',
        payload: result,
      };

      self.postMessage(response);
    } else if (type === 'abort') {
      if (compressor) {
        compressor.abort();
      }
      const response: WorkerResponse = {
        id,
        type: 'success',
      };
      self.postMessage(response);
    }
  } catch (error) {
    const response: WorkerResponse = {
      id,
      type: 'error',
      payload: error instanceof Error ? error : new Error('Unknown error'),
    };
    self.postMessage(response);
  }
};

