import React, { useState, useCallback } from 'react';
import PixuCompressor from '../../../components/react/PixuCompressor';
import '../../../components/react/PixuCompressor.css';
import './App.css';
import type { CompressionResult } from 'pixu';
import { compress } from 'pixu';
import { sampleImages, fetchSampleFile } from '../../shared/samples';

const App: React.FC = () => {
  const [basicResult, setBasicResult] = useState<CompressionResult | null>(null);
  const [advancedResult, setAdvancedResult] = useState<CompressionResult | null>(null);
  const [presetResult, setPresetResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sampleLoading, setSampleLoading] = useState<string | null>(null);
  const [sampleResult, setSampleResult] = useState<(CompressionResult & { label: string }) | null>(null);
  const [sampleOriginalUrl, setSampleOriginalUrl] = useState('');
  const [sampleCompressedUrl, setSampleCompressedUrl] = useState('');

  const [advancedOptions, setAdvancedOptions] = useState({
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'auto' as const,
    stripMetadata: true,
  });

  const [selectedPreset, setSelectedPreset] = useState('web');
  const presets = ['web', 'print', 'social', 'thumbnail', 'email'];

  const formatBytes = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }, []);

  const handleError = useCallback((err: Error) => {
    setError(err.message);
    console.error('Compression error:', err);
    setTimeout(() => setError(null), 5000);
  }, []);

  const compressSample = useCallback(async (sample: typeof sampleImages[0]) => {
    setSampleLoading(sample.id);
    try {
      const file = await fetchSampleFile(sample);
      if (sampleOriginalUrl) URL.revokeObjectURL(sampleOriginalUrl);
      if (sampleCompressedUrl) URL.revokeObjectURL(sampleCompressedUrl);
      setSampleOriginalUrl(URL.createObjectURL(file));
      const result = await compress(file, {
        quality: 0.85,
        format: 'image/pixu',
        stripMetadata: true,
        enableSmartQuality: true,
      });
      setSampleCompressedUrl(URL.createObjectURL(result.file));
      setSampleResult({ ...result, label: sample.label });
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Sample compression failed'));
    } finally {
      setSampleLoading(null);
    }
  }, [handleError, sampleCompressedUrl, sampleOriginalUrl]);

  return (
    <div className="container">
      <header className="pixu-header">
        <img src="/logo.png" alt="Pixu" className="pixu-logo" />
        <div className="pixu-brand">
          <h1>Pixu × React</h1>
          <p>Documentation-style examples — same layout as the Pixu docs</p>
        </div>
      </header>

      <section className="pixu-gallery">
        <span className="pixu-samples-label">Real sample images — click to compress with PIXU</span>
        <div className="pixu-gallery-grid">
          {sampleImages.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className={`pixu-gallery-card${sampleLoading === sample.id ? ' loading' : ''}`}
              disabled={sampleLoading === sample.id}
              onClick={() => compressSample(sample)}
            >
              <img src={sample.url} alt={sample.label} loading="lazy" />
              <span>{sampleLoading === sample.id ? 'Compressing…' : sample.label}</span>
            </button>
          ))}
        </div>
      </section>

      {sampleResult && (
        <div className="section sample-result">
          <h2>Sample compression result</h2>
          <p className="description">
            {sampleResult.label} — {sampleResult.format} ({(sampleResult.compressionRatio * 100).toFixed(1)}% reduction)
          </p>
          <div className="sample-preview">
            <figure>
              <img src={sampleOriginalUrl} alt="Original" />
              <figcaption>{formatBytes(sampleResult.originalSize)}</figcaption>
            </figure>
            <figure>
              <img src={sampleCompressedUrl} alt="Compressed" />
              <figcaption>{formatBytes(sampleResult.compressedSize)}</figcaption>
            </figure>
          </div>
        </div>
      )}

      <div className="content">
        {/* Basic Compression */}
        <div className="section">
          <h2>1. Basic Compression</h2>
          <p className="description">Simple compression with quality setting only</p>
          <PixuCompressor
            samples={sampleImages}
            options={{ quality: 0.8 }}
            onCompress={setBasicResult}
            onError={handleError}
          />
          {basicResult && (
            <div className="result-card">
              <h3>Result</h3>
              <div className="stats">
                <div className="stat">
                  <span className="label">Original:</span>
                  <span className="value">{formatBytes(basicResult.originalSize)}</span>
                </div>
                <div className="stat">
                  <span className="label">Compressed:</span>
                  <span className="value">{formatBytes(basicResult.compressedSize)}</span>
                </div>
                <div className="stat">
                  <span className="label">Ratio:</span>
                  <span className="value">{(basicResult.compressionRatio * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Options */}
        <div className="section">
          <h2>2. Advanced Options</h2>
          <p className="description">Customizable quality, dimensions, format, and metadata</p>
          <div className="controls">
            <label>
              Quality: {(advancedOptions.quality * 100).toFixed(0)}%
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={advancedOptions.quality}
                onChange={(e) => setAdvancedOptions({ ...advancedOptions, quality: parseFloat(e.target.value) })}
              />
            </label>
            <label>
              Max Width:
              <input
                type="number"
                value={advancedOptions.maxWidth}
                onChange={(e) => setAdvancedOptions({ ...advancedOptions, maxWidth: parseInt(e.target.value) })}
                min="100"
                max="4000"
              />
            </label>
            <label>
              Format:
              <select
                value={advancedOptions.format}
                onChange={(e) => setAdvancedOptions({ ...advancedOptions, format: e.target.value as any })}
              >
                <option value="auto">Auto (prefers PIX)</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
                <option value="image/pixu">PIXU (.pixu)</option>
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={advancedOptions.stripMetadata}
                onChange={(e) => setAdvancedOptions({ ...advancedOptions, stripMetadata: e.target.checked })}
              />
              Strip Metadata
            </label>
          </div>
          <PixuCompressor
            samples={sampleImages}
            options={advancedOptions}
            onCompress={setAdvancedResult}
            onError={handleError}
          />
          {advancedResult && (
            <div className="result-card">
              <h3>Result</h3>
              <div className="stats">
                <div className="stat">
                  <span className="label">Original:</span>
                  <span className="value">{formatBytes(advancedResult.originalSize)}</span>
                </div>
                <div className="stat">
                  <span className="label">Compressed:</span>
                  <span className="value">{formatBytes(advancedResult.compressedSize)}</span>
                </div>
                <div className="stat">
                  <span className="label">Format:</span>
                  <span className="value">{advancedResult.format}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Presets */}
        <div className="section">
          <h2>3. Compression Presets</h2>
          <p className="description">Pre-configured settings for common use cases</p>
          <div className="preset-selector">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => setSelectedPreset(preset)}
                className={`preset-btn ${selectedPreset === preset ? 'active' : ''}`}
              >
                {preset}
              </button>
            ))}
          </div>
          <PixuCompressor
            samples={sampleImages}
            options={{ preset: selectedPreset as any }}
            onCompress={setPresetResult}
            onError={handleError}
          />
          {presetResult && (
            <div className="result-card">
              <h3>Result</h3>
              <div className="stats">
                <div className="stat">
                  <span className="label">Preset:</span>
                  <span className="value">{selectedPreset}</span>
                </div>
                <div className="stat">
                  <span className="label">Original:</span>
                  <span className="value">{formatBytes(presetResult.originalSize)}</span>
                </div>
                <div className="stat">
                  <span className="label">Compressed:</span>
                  <span className="value">{formatBytes(presetResult.compressedSize)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default App;

