import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { CompressionOptions, CompressionResult } from 'pixu';

interface SampleImageOption {
  id: string;
  label: string;
  url: string;
  file: string;
}

interface PixuCompressorProps {
  options?: CompressionOptions;
  autoCompress?: boolean;
  samples?: SampleImageOption[];
  onCompress?: (result: CompressionResult) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
  onSource?: (payload: { file: File; url: string }) => void;
}

const PixuCompressor: React.FC<PixuCompressorProps> = ({
  options = {},
  autoCompress = true,
  samples,
  onCompress,
  onError,
  onProgress,
  onSource,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = useCallback((bytes: number): string => {
    if (!Number.isFinite(bytes) || bytes === 0) return '0 Bytes';
    const sign = bytes < 0 ? '-' : '';
    const abs = Math.abs(bytes);
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.min(sizes.length - 1, Math.floor(Math.log(abs) / Math.log(k)));
    return `${sign}${Math.round((abs / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  }, []);

  const processFile = useCallback(async (selectedFile: File) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setResult(null);

    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
      setOriginalUrl(null);
    }
    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
      setCompressedUrl(null);
    }

    try {
      const buffer = await selectedFile.arrayBuffer();
      const type = selectedFile.type || 'image/jpeg';
      const previewBlob = new Blob([buffer.slice(0)], { type });
      const appPreviewBlob = new Blob([buffer.slice(0)], { type });
      const fileForCompress = new File([buffer.slice(0)], selectedFile.name, {
        type,
        lastModified: selectedFile.lastModified,
      });

      setFile(fileForCompress);
      setOriginalUrl(URL.createObjectURL(previewBlob));
      onSource?.({
        file: fileForCompress,
        url: URL.createObjectURL(appPreviewBlob),
      });

      if (!autoCompress) {
        setLoading(false);
        return;
      }

      const { compress } = await import('pixu');

      const compressionResult = await compress(fileForCompress, {
        ...options,
        onProgress: (p: number) => {
          setProgress(p);
          onProgress?.(p);
        },
      });

      setResult(compressionResult);
      setCompressedUrl(URL.createObjectURL(compressionResult.file));
      onCompress?.(compressionResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Compression failed';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [options, autoCompress, onCompress, onError, onProgress, onSource, originalUrl, compressedUrl]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer?.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      processFile(droppedFile);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const loadSample = useCallback(async (sample: SampleImageOption) => {
    const res = await fetch(sample.url);
    if (!res.ok) return;
    const blob = await res.blob();
    const file = new File([blob], sample.file, { type: blob.type || 'image/jpeg' });
    await processFile(file);
  }, [processFile]);

  const downloadFile = useCallback(() => {
    if (!result || !compressedUrl) return;
    
    const link = document.createElement('a');
    link.href = compressedUrl;
    link.download = `compressed-${file?.name || 'image'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [result, compressedUrl, file]);

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
      setOriginalUrl(null);
    }
    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
      setCompressedUrl(null);
    }
  }, [originalUrl, compressedUrl]);

  useEffect(() => {
    return () => {
      if (originalUrl) {
        URL.revokeObjectURL(originalUrl);
      }
      if (compressedUrl) {
        URL.revokeObjectURL(compressedUrl);
      }
    };
  }, [originalUrl, compressedUrl]);

  const originalSize = file?.size || 0;
  const originalDimensions = originalUrl ? 'Loading...' : '';

  if (!file) {
    return (
      <div className="pixu-compressor">
        <div
          className="upload-area"
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="file-input"
            style={{ display: 'none' }}
          />
          <div className="upload-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p className="upload-text">Click or drag image here to compress</p>
            <p className="upload-hint">Supports JPEG, PNG, WEBP, AVIF, PIXU</p>
          </div>
          {samples?.length ? (
            <div className="sample-gallery" onClick={(e) => e.stopPropagation()}>
              <p className="sample-label">Or try a real sample</p>
              <div className="sample-grid">
                {samples.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    className="sample-card"
                    onClick={() => loadSample(sample)}
                  >
                    <img src={sample.url} alt={sample.label} loading="lazy" />
                    <span>{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="pixu-compressor">
      <div className="compression-container">
        <div className="image-preview-section">
          <div className="image-preview">
            <h4>Original</h4>
            {originalUrl && <img src={originalUrl} alt="Original" />}
            <div className="image-info">
              <span>{formatBytes(originalSize)}</span>
              <span>{originalDimensions}</span>
            </div>
          </div>
          {result && (
            <div className="image-preview">
              <h4>Compressed</h4>
              {compressedUrl && <img src={compressedUrl} alt="Compressed" />}
              <div className="image-info">
                <span>{formatBytes(result.compressedSize)}</span>
                <span>{result.width}x{result.height}</span>
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="progress-section">
            <progress value={progress} max={1} className="progress-bar"></progress>
            <p className="progress-text">Compressing... {Math.round(progress * 100)}%</p>
          </div>
        )}

        {result && (
          <div className="result-section">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Compression Ratio</span>
                <span className="stat-value">{(result.compressionRatio * 100).toFixed(1)}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Size Reduction</span>
                <span className="stat-value">{formatBytes(originalSize - result.compressedSize)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Format</span>
                <span className="stat-value">{result.format}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Quality</span>
                <span className="stat-value">
                  {result.metadata?.quality == null
                    ? '—'
                    : `${Math.round(result.metadata.quality * 100)}%`}
                </span>
              </div>
            </div>
            <div className="actions">
              <button onClick={downloadFile} className="btn btn-primary">
                Download Compressed
              </button>
              <button onClick={reset} className="btn btn-secondary">
                Compress Another
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-section">
            <p className="error-message">{error}</p>
            <button onClick={reset} className="btn btn-secondary">
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PixuCompressor;

