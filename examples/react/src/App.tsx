import React, { useState, useCallback, useMemo, ChangeEvent } from 'react';
import PixuCompressor from '../../../components/react/PixuCompressor';
import '../../../components/react/PixuCompressor.css';
import type { CompressionResult } from '@pantanal/pixu';
import { compress, compressBatch, downloadImageAs, createPreviewObjectURL } from '@pantanal/pixu';
import type { DownloadImageFormat } from '@pantanal/pixu';
import { sampleImages, fetchSampleFile } from '../../shared/samples';

const presets = ['web', 'print', 'social', 'thumbnail', 'email'] as const;
const presetNames: Record<string, string> = {
  web: 'Web',
  print: 'Print',
  social: 'Social Media',
  thumbnail: 'Thumbnail',
  email: 'Email',
};

type PerformanceMetrics = {
  duration?: number;
  memoryUsed?: number;
  throughput?: number;
};

type PerformanceCompressionResult = CompressionResult & {
  metrics?: PerformanceMetrics;
};

const filters = ['grayscale', 'sepia', 'vintage', 'brightness', 'contrast', 'saturation', 'blur', 'sharpen'] as const;
const filterNames: Record<string, string> = {
  grayscale: 'Grayscale',
  sepia: 'Sepia',
  vintage: 'Vintage',
  brightness: 'Brightness',
  contrast: 'Contrast',
  saturation: 'Saturation',
  blur: 'Blur',
  sharpen: 'Sharpen',
};

const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes === 0) return '0 Bytes';
  const sign = bytes < 0 ? '-' : '';
  const abs = Math.abs(bytes);
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(abs) / Math.log(k)));
  return `${sign}${Math.round((abs / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

const downloadAs = async (file: File | Blob, name: string, format: DownloadImageFormat) => {
  await downloadImageAs(file, `${name}-${Date.now()}`, format);
};

const App: React.FC = () => {
  const [sampleLoading, setSampleLoading] = useState<string | null>(null);
  const [sampleResult, setSampleResult] = useState<(CompressionResult & { label: string }) | null>(null);
  const [sampleOriginalUrl, setSampleOriginalUrl] = useState('');
  const [sampleCompressedUrl, setSampleCompressedUrl] = useState('');

  const [basicOptions, setBasicOptions] = useState({ quality: 0.8 });
  const [advancedOptions, setAdvancedOptions] = useState({
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'auto' as string,
    stripMetadata: true,
    enableSmartQuality: false,
  });
  const [selectedPreset, setSelectedPreset] = useState('web');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [pixOptions, setPixOptions] = useState({
    quality: 0.85,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'image/pixu' as const,
    stripMetadata: true,
    enableSmartQuality: true,
  });
  const [conversionFormat, setConversionFormat] = useState('image/jpeg');
  const [convertToJPEG, setConvertToJPEG] = useState(false);
  const [pngOptimization, setPngOptimization] = useState({
    enabled: false,
    reduceColors: false,
    maxColors: 128,
  });
  const [smartCrop, setSmartCrop] = useState({
    width: 800,
    height: 600,
    focus: 'center' as const,
  });
  const [watermarkText, setWatermarkText] = useState('Pixu');
  const [watermarkPosition, setWatermarkPosition] = useState('bottom-right');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.7);

  const [basicResult, setBasicResult] = useState<CompressionResult | null>(null);
  const [advancedResult, setAdvancedResult] = useState<CompressionResult | null>(null);
  const [presetResult, setPresetResult] = useState<CompressionResult | null>(null);
  const [filterResult, setFilterResult] = useState<CompressionResult | null>(null);
  const [pixResult, setPixResult] = useState<CompressionResult | null>(null);
  const [smartQualityResult, setSmartQualityResult] = useState<CompressionResult | null>(null);
  const [conversionResult, setConversionResult] = useState<CompressionResult | null>(null);
  const [pngResult, setPngResult] = useState<CompressionResult | null>(null);
  const [smartCropResult, setSmartCropResult] = useState<CompressionResult | null>(null);
  const [watermarkResult, setWatermarkResult] = useState<CompressionResult | null>(null);
  const [performanceResult, setPerformanceResult] = useState<PerformanceCompressionResult | null>(null);
  const [batchResults, setBatchResults] = useState<CompressionResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [basicProgress, setBasicProgress] = useState(0);
  const [advancedProgress, setAdvancedProgress] = useState(0);
  const [presetProgress, setPresetProgress] = useState(0);
  const [filterProgress, setFilterProgress] = useState(0);
  const [pixProgress, setPixProgress] = useState(0);
  const [smartQualityProgress, setSmartQualityProgress] = useState(0);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [pngProgress, setPngProgress] = useState(0);
  const [smartCropProgress, setSmartCropProgress] = useState(0);
  const [watermarkProgress, setWatermarkProgress] = useState(0);
  const [performanceProgress, setPerformanceProgress] = useState(0);
  const [batchProgress, setBatchProgress] = useState(0);

  const [basicOriginalUrl, setBasicOriginalUrl] = useState('');
  const [basicCompressedUrl, setBasicCompressedUrl] = useState('');
  const [advancedOriginalUrl, setAdvancedOriginalUrl] = useState('');
  const [advancedCompressedUrl, setAdvancedCompressedUrl] = useState('');
  const [presetOriginalUrl, setPresetOriginalUrl] = useState('');
  const [presetCompressedUrl, setPresetCompressedUrl] = useState('');
  const [filterOriginalUrl, setFilterOriginalUrl] = useState('');
  const [filterCompressedUrl, setFilterCompressedUrl] = useState('');
  const [pixOriginalUrl, setPixOriginalUrl] = useState('');
  const [pixCompressedUrl, setPixCompressedUrl] = useState('');
  const [watermarkCompressedUrl, setWatermarkCompressedUrl] = useState('');

  const pngCompressOptions = useMemo(() => {
    if (pngOptimization.enabled) {
      return {
        format: 'image/png' as const,
        optimizePNG: { ...pngOptimization },
        strict: true,
      };
    }
    return {
      format: 'auto' as const,
      strict: true,
    };
  }, [pngOptimization]);

  const pngSavings = useMemo(
    () => (pngResult ? pngResult.originalSize - pngResult.compressedSize : 0),
    [pngResult]
  );

  const batchTotalOriginal = useMemo(
    () => batchResults.reduce((sum, r) => sum + r.originalSize, 0),
    [batchResults]
  );

  const batchTotalCompressed = useMemo(
    () => batchResults.reduce((sum, r) => sum + r.compressedSize, 0),
    [batchResults]
  );

  const batchAverageRatio = useMemo(() => {
    if (batchResults.length === 0) return 0;
    const total = batchResults.reduce((sum, r) => sum + r.compressionRatio, 0);
    return total / batchResults.length;
  }, [batchResults]);

  const setOriginalUrl = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>, url: string) => {
      setter((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    },
    []
  );

  const onBasicSource = useCallback(
    (payload: { url: string }) => setOriginalUrl(setBasicOriginalUrl, payload.url),
    [setOriginalUrl]
  );
  const onAdvancedSource = useCallback(
    (payload: { url: string }) => setOriginalUrl(setAdvancedOriginalUrl, payload.url),
    [setOriginalUrl]
  );
  const onPresetSource = useCallback(
    (payload: { url: string }) => setOriginalUrl(setPresetOriginalUrl, payload.url),
    [setOriginalUrl]
  );
  const onFilterSource = useCallback(
    (payload: { url: string }) => setOriginalUrl(setFilterOriginalUrl, payload.url),
    [setOriginalUrl]
  );
  const onPixSource = useCallback(
    (payload: { url: string }) => setOriginalUrl(setPixOriginalUrl, payload.url),
    [setOriginalUrl]
  );

  const handleBasicCompress = useCallback(async (result: CompressionResult) => {
    setBasicResult(result);
    setBasicProgress(1);
    if (result.file) {
      const url = await createPreviewObjectURL(result.file, result.format);
      setBasicCompressedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    }
  }, []);

  const handleAdvancedCompress = useCallback(async (result: CompressionResult) => {
    setAdvancedResult(result);
    setAdvancedProgress(1);
    if (result.file) {
      const url = await createPreviewObjectURL(result.file, result.format);
      setAdvancedCompressedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    }
  }, []);

  const handlePresetCompress = useCallback(async (result: CompressionResult) => {
    setPresetResult(result);
    setPresetProgress(1);
    if (result.file) {
      const url = await createPreviewObjectURL(result.file, result.format);
      setPresetCompressedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    }
  }, []);

  const handleFilterCompress = useCallback(async (result: CompressionResult) => {
    setFilterResult(result);
    setFilterProgress(1);
    if (result.file) {
      const url = await createPreviewObjectURL(result.file, result.format);
      setFilterCompressedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    }
  }, []);

  const handlePixCompress = useCallback(async (result: CompressionResult) => {
    setPixResult(result);
    setPixProgress(1);
    if (result.file) {
      const url = await createPreviewObjectURL(result.file, result.format);
      setPixCompressedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    }
  }, []);

  const handleSmartQualityCompress = useCallback((result: CompressionResult) => {
    setSmartQualityResult(result);
    setSmartQualityProgress(1);
  }, []);

  const handleConversionCompress = useCallback((result: CompressionResult) => {
    setConversionResult(result);
    setConversionProgress(1);
  }, []);

  const handlePNGCompress = useCallback((result: CompressionResult) => {
    setPngResult(result);
    setPngProgress(1);
  }, []);

  const handleSmartCropCompress = useCallback((result: CompressionResult) => {
    setSmartCropResult(result);
    setSmartCropProgress(1);
  }, []);

  const handleWatermarkCompress = useCallback(async (result: CompressionResult) => {
    setWatermarkResult(result);
    setWatermarkProgress(1);
    if (result.file) {
      const url = await createPreviewObjectURL(result.file, result.format);
      setWatermarkCompressedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    }
  }, []);

  const handlePerformanceCompress = useCallback((result: CompressionResult) => {
    setPerformanceResult(result as PerformanceCompressionResult);
    setPerformanceProgress(1);
  }, []);

  const handleError = useCallback((err: Error) => {
    setError(err.message);
    console.error('Compression error:', err);
    setTimeout(() => setError(null), 5000);
  }, []);

  const handleBatchFiles = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setBatchProgress(0);
    setBatchResults([]);

    try {
      let completed = 0;
      const results = await compressBatch(files, {
        quality: 0.8,
        concurrency: 3,
        onItemComplete: () => {
          completed++;
          setBatchProgress(completed / files.length);
        },
      });
      setBatchResults(results);
      setBatchProgress(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Batch compression failed');
    }
  }, []);

  const compressSample = useCallback(async (sample: (typeof sampleImages)[0]) => {
    setSampleLoading(sample.id);
    try {
      const file = await fetchSampleFile(sample);
      setSampleOriginalUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      setSampleCompressedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return '';
      });
      const result = await compress(file, {
        quality: 0.85,
        format: 'image/pixu',
        stripMetadata: true,
        enableSmartQuality: true,
      });
      const previewUrl = await createPreviewObjectURL(result.file, result.format);
      setSampleCompressedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return previewUrl;
      });
      setSampleResult({ ...result, label: sample.label });
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Sample compression failed'));
    } finally {
      setSampleLoading(null);
    }
  }, [handleError]);

  const toggleFilter = useCallback((filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  }, []);

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
          <div className="image-comparison">
            <div className="image-preview">
              <h4>Original</h4>
              <img src={sampleOriginalUrl} alt="Original" />
              <p className="image-info">{formatBytes(sampleResult.originalSize)}</p>
            </div>
            <div className="image-preview">
              <h4>Compressed</h4>
              <img src={sampleCompressedUrl} alt="Compressed" />
              <p className="image-info">{formatBytes(sampleResult.compressedSize)}</p>
              <div className="download-pair">
                <button type="button" onClick={() => downloadAs(sampleResult.file, sampleResult.label, 'image/webp')} className="download-btn">Download (.webp)</button>
                <button type="button" onClick={() => downloadAs(sampleResult.file, sampleResult.label, 'image/jpeg')} className="download-btn">Download (.jpg)</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="content">
        <div className="section">
          <h2>1. Basic Compression</h2>
          <p className="description">Simple compression with quality setting and live preview</p>
          <div className="controls-inline">
            <label>
              Quality: {(basicOptions.quality * 100).toFixed(0)}%
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={basicOptions.quality}
                onChange={(e) => setBasicOptions({ quality: parseFloat(e.target.value) })}
              />
            </label>
          </div>
          <PixuCompressor
            samples={sampleImages}
            options={basicOptions}
            onSource={onBasicSource}
            onCompress={handleBasicCompress}
            onError={handleError}
            onProgress={setBasicProgress}
          />
          {basicProgress > 0 && basicProgress < 1 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${basicProgress * 100}%` }} />
            </div>
          )}
          {basicResult && (
            <div className="image-comparison">
              <div className="image-preview">
                <h4>Original</h4>
                <img src={basicOriginalUrl} alt="Original" />
                <p className="image-info">{formatBytes(basicResult.originalSize)}</p>
              </div>
              <div className="image-preview">
                <h4>Compressed</h4>
                <img src={basicCompressedUrl} alt="Compressed" />
                <p className="image-info">
                  {formatBytes(basicResult.compressedSize)} ({(basicResult.compressionRatio * 100).toFixed(1)}% reduction)
                </p>
                <div className="download-pair">
                  <button type="button" onClick={() => downloadAs(basicResult.file, 'compressed', 'image/webp')} className="download-btn">Download (.webp)</button>
                  <button type="button" onClick={() => downloadAs(basicResult.file, 'compressed', 'image/jpeg')} className="download-btn">Download (.jpg)</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="section">
          <h2>2. Advanced Options</h2>
          <p className="description">Customize all compression settings with real-time updates</p>
          <div className="controls">
            <label>
              Quality: {(advancedOptions.quality * 100).toFixed(0)}%
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={advancedOptions.quality}
                onChange={(e) =>
                  setAdvancedOptions({ ...advancedOptions, quality: parseFloat(e.target.value) })
                }
              />
            </label>
            <label>
              Max Width:{' '}
              <input
                type="number"
                value={advancedOptions.maxWidth}
                onChange={(e) =>
                  setAdvancedOptions({ ...advancedOptions, maxWidth: parseInt(e.target.value, 10) })
                }
                min={100}
                max={4000}
              />
            </label>
            <label>
              Max Height:{' '}
              <input
                type="number"
                value={advancedOptions.maxHeight}
                onChange={(e) =>
                  setAdvancedOptions({ ...advancedOptions, maxHeight: parseInt(e.target.value, 10) })
                }
                min={100}
                max={4000}
              />
            </label>
            <label>
              Format:
              <select
                value={advancedOptions.format}
                onChange={(e) =>
                  setAdvancedOptions({ ...advancedOptions, format: e.target.value as typeof advancedOptions.format })
                }
              >
                <option value="auto">Auto (Prefers PIXU)</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
                <option value="image/pixu">PIXU (Best)</option>
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={advancedOptions.stripMetadata}
                onChange={(e) =>
                  setAdvancedOptions({ ...advancedOptions, stripMetadata: e.target.checked })
                }
              />
              Strip Metadata
            </label>
            <label>
              <input
                type="checkbox"
                checked={advancedOptions.enableSmartQuality}
                onChange={(e) =>
                  setAdvancedOptions({ ...advancedOptions, enableSmartQuality: e.target.checked })
                }
              />
              Smart Quality
            </label>
          </div>
          <PixuCompressor
            samples={sampleImages}
            options={advancedOptions}
            onSource={onAdvancedSource}
            onCompress={handleAdvancedCompress}
            onError={handleError}
            onProgress={setAdvancedProgress}
          />
          {advancedProgress > 0 && advancedProgress < 1 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${advancedProgress * 100}%` }} />
            </div>
          )}
          {advancedResult && (
            <div className="result-card">
              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-label">Original Size</span>
                  <span className="stat-value">{formatBytes(advancedResult.originalSize)}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Compressed Size</span>
                  <span className="stat-value highlight">{formatBytes(advancedResult.compressedSize)}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Compression Ratio</span>
                  <span className="stat-value success">
                    {(advancedResult.compressionRatio * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Format</span>
                  <span className="stat-value">{advancedResult.format}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Dimensions</span>
                  <span className="stat-value">
                    {advancedResult.width}×{advancedResult.height}
                  </span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Savings</span>
                  <span className="stat-value success">
                    {formatBytes(advancedResult.originalSize - advancedResult.compressedSize)}
                  </span>
                </div>
              </div>
              <div className="image-preview-grid">
                <div className="preview-item">
                  <img src={advancedOriginalUrl} alt="Original" />
                  <p>Original</p>
                </div>
                <div className="preview-item">
                  <img src={advancedCompressedUrl} alt="Compressed" />
                  <p>Compressed</p>
                  <div className="download-pair">
                    <button type="button" onClick={() => downloadAs(advancedResult.file, 'advanced', 'image/webp')} className="download-btn-small">Download (.webp)</button>
                    <button type="button" onClick={() => downloadAs(advancedResult.file, 'advanced', 'image/jpeg')} className="download-btn-small">Download (.jpg)</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="section">
          <h2>3. Compression Presets</h2>
          <p className="description">Compare different presets side by side</p>
          <div className="preset-selector">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setSelectedPreset(preset)}
                className={`preset-btn${selectedPreset === preset ? ' active' : ''}`}
              >
                {presetNames[preset]}
              </button>
            ))}
          </div>
          <PixuCompressor
            samples={sampleImages}
            options={{ preset: selectedPreset as any }}
            onSource={onPresetSource}
            onCompress={handlePresetCompress}
            onError={handleError}
            onProgress={setPresetProgress}
          />
          {presetProgress > 0 && presetProgress < 1 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${presetProgress * 100}%` }} />
            </div>
          )}
          {presetResult && (
            <div className="result-card">
              <div className="preset-info">
                <h3>{presetNames[selectedPreset]} Preset</h3>
                <div className="stats-inline">
                  <span>
                    <strong>Original:</strong> {formatBytes(presetResult.originalSize)}
                  </span>
                  <span>
                    <strong>Compressed:</strong> {formatBytes(presetResult.compressedSize)}
                  </span>
                  <span>
                    <strong>Savings:</strong>{' '}
                    <span className="success">
                      {formatBytes(presetResult.originalSize - presetResult.compressedSize)}
                    </span>
                  </span>
                </div>
              </div>
              <div className="image-preview-grid">
                <div className="preview-item">
                  <img src={presetOriginalUrl} alt="Original" />
                </div>
                <div className="preview-item">
                  <img src={presetCompressedUrl} alt="Compressed" />
                  <div className="download-pair">
                    <button type="button" onClick={() => downloadAs(presetResult.file, `preset-${selectedPreset}`, 'image/webp')} className="download-btn-small">Download (.webp)</button>
                    <button type="button" onClick={() => downloadAs(presetResult.file, `preset-${selectedPreset}`, 'image/jpeg')} className="download-btn-small">Download (.jpg)</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="section">
          <h2>4. Image Filters</h2>
          <p className="description">Apply visual effects with instant preview</p>
          <div className="filter-grid">
            {filters.map((filter) => (
              <label key={filter} className="filter-item">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter)}
                  onChange={() => toggleFilter(filter)}
                />
                <span>{filterNames[filter]}</span>
              </label>
            ))}
          </div>
          {selectedFilters.length > 0 && (
            <div className="filter-preview">
              <p>Active Filters: {selectedFilters.map((f) => filterNames[f]).join(', ')}</p>
            </div>
          )}
          <PixuCompressor
            samples={sampleImages}
            options={{ quality: 0.8, filters: selectedFilters as any }}
            onSource={onFilterSource}
            onCompress={handleFilterCompress}
            onError={handleError}
            onProgress={setFilterProgress}
          />
          {filterProgress > 0 && filterProgress < 1 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${filterProgress * 100}%` }} />
            </div>
          )}
          {filterResult && (
            <div className="image-comparison">
              <div className="image-preview">
                <h4>Original</h4>
                <img src={filterOriginalUrl} alt="Original" />
              </div>
              <div className="image-preview">
                <h4>With Filters</h4>
                <img src={filterCompressedUrl} alt="Filtered" />
                <div className="download-pair">
                  <button type="button" onClick={() => downloadAs(filterResult.file, 'filtered', 'image/webp')} className="download-btn">Download (.webp)</button>
                  <button type="button" onClick={() => downloadAs(filterResult.file, 'filtered', 'image/jpeg')} className="download-btn">Download (.jpg)</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="section pix-section">
          <h2>5. PIXU Format - Revolutionary Compression</h2>
          <p className="description">
            Experience the best compression with Pixu&apos;s proprietary PIXU format (30-60% better than JPEG)
          </p>
          <div className="info-box pix-info">
            <p>
              <strong>PIXU Format</strong> — Reconstructive format under TECR: typically 30–60% smaller than JPEG
              and 20–40% vs WebP at the same visual budget.
            </p>
          </div>
          <div className="controls">
            <label>
              Quality: {(pixOptions.quality * 100).toFixed(0)}%
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={pixOptions.quality}
                onChange={(e) => setPixOptions({ ...pixOptions, quality: parseFloat(e.target.value) })}
              />
            </label>
            <label>
              Max Width:{' '}
              <input
                type="number"
                value={pixOptions.maxWidth}
                onChange={(e) => setPixOptions({ ...pixOptions, maxWidth: parseInt(e.target.value, 10) })}
                min={100}
                max={4000}
              />
            </label>
            <label>
              Max Height:{' '}
              <input
                type="number"
                value={pixOptions.maxHeight}
                onChange={(e) => setPixOptions({ ...pixOptions, maxHeight: parseInt(e.target.value, 10) })}
                min={100}
                max={4000}
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={pixOptions.stripMetadata}
                onChange={(e) => setPixOptions({ ...pixOptions, stripMetadata: e.target.checked })}
              />
              Strip Metadata
            </label>
            <label>
              <input
                type="checkbox"
                checked={pixOptions.enableSmartQuality}
                onChange={(e) => setPixOptions({ ...pixOptions, enableSmartQuality: e.target.checked })}
              />
              Smart Quality
            </label>
          </div>
          <PixuCompressor
            samples={sampleImages}
            options={pixOptions}
            onSource={onPixSource}
            onCompress={handlePixCompress}
            onError={handleError}
            onProgress={setPixProgress}
          />
          {pixProgress > 0 && pixProgress < 1 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pixProgress * 100}%` }} />
            </div>
          )}
          {pixResult && (
            <div className="result-card">
              <div className="pix-comparison">
                <h3>PIXU Format Results</h3>
                <div className="stats-grid">
                  <div className="stat-box highlight-box">
                    <span className="stat-label">Original Size</span>
                    <span className="stat-value">{formatBytes(pixResult.originalSize)}</span>
                  </div>
                  <div className="stat-box highlight-box">
                    <span className="stat-label">PIXU Compressed</span>
                    <span className="stat-value highlight">{formatBytes(pixResult.compressedSize)}</span>
                  </div>
                  <div className="stat-box highlight-box">
                    <span className="stat-label">Compression Ratio</span>
                    <span className="stat-value success">
                      {(pixResult.compressionRatio * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="stat-box highlight-box">
                    <span className="stat-label">Format</span>
                    <span className="stat-value">{pixResult.format}</span>
                  </div>
                  <div className="stat-box highlight-box">
                    <span className="stat-label">Savings</span>
                    <span className="stat-value success">
                      {formatBytes(pixResult.originalSize - pixResult.compressedSize)}
                    </span>
                  </div>
                  <div className="stat-box highlight-box">
                    <span className="stat-label">Dimensions</span>
                    <span className="stat-value">
                      {pixResult.width}×{pixResult.height}
                    </span>
                  </div>
                </div>
                <div className="image-preview-grid">
                  <div className="preview-item">
                    <img src={pixOriginalUrl} alt="Original" />
                    <p>Original Image</p>
                    <p className="image-info">{formatBytes(pixResult.originalSize)}</p>
                  </div>
                  <div className="preview-item">
                    <img src={pixCompressedUrl} alt="PIXU Compressed" />
                    <p>PIXU Format ({(pixResult.compressionRatio * 100).toFixed(1)}% smaller)</p>
                    <p className="image-info">{formatBytes(pixResult.compressedSize)}</p>
                    <div className="download-pair">
                      <button type="button" onClick={() => downloadAs(pixResult.file, 'pixu-compressed', 'image/webp')} className="download-btn">Download (.webp)</button>
                      <button type="button" onClick={() => downloadAs(pixResult.file, 'pixu-compressed', 'image/jpeg')} className="download-btn">Download (.jpg)</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="section">
          <h2>6. Smart Quality Selection</h2>
          <p className="description">Automatic quality optimization based on image content analysis</p>
          <div className="info-box">
            <p>Smart Quality analyzes content and selects quality for best compression while keeping visual fidelity.</p>
          </div>
          <PixuCompressor
            samples={sampleImages}
            options={{ enableSmartQuality: true }}
            onCompress={handleSmartQualityCompress}
            onError={handleError}
            onProgress={setSmartQualityProgress}
          />
          {smartQualityProgress > 0 && smartQualityProgress < 1 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${smartQualityProgress * 100}%` }} />
            </div>
          )}
          {smartQualityResult && (
            <div className="result-card">
              <div className="smart-quality-info">
                <h3>Smart Quality Analysis</h3>
                <div className="stats-grid">
                  <div className="stat-box">
                    <span className="stat-label">Original</span>
                    <span className="stat-value">{formatBytes(smartQualityResult.originalSize)}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Compressed</span>
                    <span className="stat-value highlight">
                      {formatBytes(smartQualityResult.compressedSize)}
                    </span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Optimization</span>
                    <span className="stat-value success">
                      {(smartQualityResult.compressionRatio * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="section">
          <h2>7. Format Conversion</h2>
          <p className="description">Convert between formats with size comparison</p>
          <div className="controls">
            <label>
              Target Format:
              <select value={conversionFormat} onChange={(e) => setConversionFormat(e.target.value)}>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
                <option value="image/pixu">PIXU (Best)</option>
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={convertToJPEG}
                onChange={(e) => setConvertToJPEG(e.target.checked)}
              />
              Auto Convert PNG to JPEG
            </label>
          </div>
          <PixuCompressor
            samples={sampleImages}
            options={{ format: conversionFormat as any, convertToJPEG }}
            onCompress={handleConversionCompress}
            onError={handleError}
            onProgress={setConversionProgress}
          />
          {conversionProgress > 0 && conversionProgress < 1 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${conversionProgress * 100}%` }} />
            </div>
          )}
          {conversionResult && (
            <div className="result-card">
              <div className="format-comparison">
                <div className="format-item">
                  <span className="format-label">Original Format</span>
                  <span className="format-value">{conversionResult.format}</span>
                </div>
                <div className="format-item">
                  <span className="format-label">Size</span>
                  <span className="format-value">{formatBytes(conversionResult.compressedSize)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="section">
          <h2>8. PNG Optimization</h2>
          <p className="description">Lossless PNG compression with color reduction</p>
          <div className="controls">
            <label>
              <input
                type="checkbox"
                checked={pngOptimization.enabled}
                onChange={(e) => setPngOptimization({ ...pngOptimization, enabled: e.target.checked })}
              />
              Enable PNG Optimization
            </label>
            {pngOptimization.enabled && (
              <label>
                <input
                  type="checkbox"
                  checked={pngOptimization.reduceColors}
                  onChange={(e) =>
                    setPngOptimization({ ...pngOptimization, reduceColors: e.target.checked })
                  }
                />
                Reduce Colors
              </label>
            )}
            {pngOptimization.enabled && pngOptimization.reduceColors && (
              <label>
                Max Colors:{' '}
                <input
                  type="number"
                  value={pngOptimization.maxColors}
                  onChange={(e) =>
                    setPngOptimization({ ...pngOptimization, maxColors: parseInt(e.target.value, 10) })
                  }
                  min={2}
                  max={256}
                />
              </label>
            )}
          </div>
          <PixuCompressor
            samples={sampleImages}
            options={pngCompressOptions}
            onCompress={handlePNGCompress}
            onError={handleError}
            onProgress={setPngProgress}
          />
          {pngProgress > 0 && pngProgress < 1 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pngProgress * 100}%` }} />
            </div>
          )}
          {pngResult && (
            <div className="result-card">
              <div className="stats-inline">
                <span>
                  <strong>Original:</strong> {formatBytes(pngResult.originalSize)}
                </span>
                <span>
                  <strong>Optimized:</strong> {formatBytes(pngResult.compressedSize)}
                </span>
                <span>
                  <strong>Savings:</strong>{' '}
                  <span className={pngSavings >= 0 ? 'success' : 'danger'}>{formatBytes(pngSavings)}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="section">
          <h2>9. Smart Cropping</h2>
          <p className="description">Intelligent image cropping with focus detection</p>
          <div className="controls">
            <label>
              Crop Width:{' '}
              <input
                type="number"
                value={smartCrop.width}
                onChange={(e) => setSmartCrop({ ...smartCrop, width: parseInt(e.target.value, 10) })}
                min={100}
                max={2000}
              />
            </label>
            <label>
              Crop Height:{' '}
              <input
                type="number"
                value={smartCrop.height}
                onChange={(e) => setSmartCrop({ ...smartCrop, height: parseInt(e.target.value, 10) })}
                min={100}
                max={2000}
              />
            </label>
            <label>
              Focus:
              <select
                value={smartCrop.focus}
                onChange={(e) =>
                  setSmartCrop({ ...smartCrop, focus: e.target.value as typeof smartCrop.focus })
                }
              >
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </label>
          </div>
          <PixuCompressor
            samples={sampleImages}
            options={{ quality: 0.8, smartCrop: { ...smartCrop, enabled: true } }}
            onCompress={handleSmartCropCompress}
            onError={handleError}
            onProgress={setSmartCropProgress}
          />
          {smartCropProgress > 0 && smartCropProgress < 1 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${smartCropProgress * 100}%` }} />
            </div>
          )}
          {smartCropResult && (
            <div className="result-card">
              <div className="stats-inline">
                <span>
                  <strong>Dimensions:</strong> {smartCropResult.width}×{smartCropResult.height}
                </span>
                <span>
                  <strong>Size:</strong> {formatBytes(smartCropResult.compressedSize)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="section">
          <h2>10. Watermark</h2>
          <p className="description">Add text or image watermarks with customization</p>
          <div className="controls">
            <label>
              Watermark Text:{' '}
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Enter text"
              />
            </label>
            <label>
              Position:
              <select value={watermarkPosition} onChange={(e) => setWatermarkPosition(e.target.value)}>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="center">Center</option>
              </select>
            </label>
            <label>
              Opacity: {(watermarkOpacity * 100).toFixed(0)}%
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
              />
            </label>
          </div>
          <PixuCompressor
            samples={sampleImages}
            options={{
              quality: 0.8,
              watermark: watermarkText
                ? {
                    text: watermarkText,
                    position: watermarkPosition as any,
                    opacity: watermarkOpacity,
                  }
                : undefined,
            }}
            onCompress={handleWatermarkCompress}
            onError={handleError}
            onProgress={setWatermarkProgress}
          />
          {watermarkProgress > 0 && watermarkProgress < 1 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${watermarkProgress * 100}%` }} />
            </div>
          )}
          {watermarkResult && watermarkText && (
            <div className="result-card">
              <div className="image-preview-grid">
                <div className="preview-item">
                  <img src={watermarkCompressedUrl} alt="Watermarked" />
                  <p>Watermarked Image</p>
                  <div className="download-pair">
                    <button type="button" onClick={() => downloadAs(watermarkResult.file, 'watermarked', 'image/webp')} className="download-btn-small">Download (.webp)</button>
                    <button type="button" onClick={() => downloadAs(watermarkResult.file, 'watermarked', 'image/jpeg')} className="download-btn-small">Download (.jpg)</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="section">
          <h2>11. Performance Monitoring</h2>
          <p className="description">Track compression metrics and performance in real-time</p>
          <PixuCompressor
            samples={sampleImages}
            options={{ quality: 0.8, monitorPerformance: true }}
            onCompress={handlePerformanceCompress}
            onError={handleError}
            onProgress={setPerformanceProgress}
          />
          {performanceProgress > 0 && performanceProgress < 1 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${performanceProgress * 100}%` }} />
            </div>
          )}
          {performanceResult && (
            <div className="result-card">
              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-label">Original Size</span>
                  <span className="stat-value">{formatBytes(performanceResult.originalSize)}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Compressed Size</span>
                  <span className="stat-value highlight">
                    {formatBytes(performanceResult.compressedSize)}
                  </span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Compression Ratio</span>
                  <span className="stat-value success">
                    {(performanceResult.compressionRatio * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              {performanceResult.metrics && (
                <div className="metrics-card">
                  <h3>Performance Metrics</h3>
                  <div className="metrics-grid">
                    <div className="metric-item">
                      <span className="metric-label">Duration</span>
                      <span className="metric-value">
                        {performanceResult.metrics.duration?.toFixed(2) || 0}ms
                      </span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Memory Used</span>
                      <span className="metric-value">
                        {formatBytes(performanceResult.metrics.memoryUsed || 0)}
                      </span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Throughput</span>
                      <span className="metric-value">
                        {formatBytes(performanceResult.metrics.throughput || 0)}/s
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="section">
          <h2>12. Batch Processing</h2>
          <p className="description">Compress multiple images at once with progress tracking</p>
          <div className="batch-controls">
            <input
              type="file"
              multiple
              onChange={handleBatchFiles}
              accept="image/*"
              id="batch-input"
            />
            <label htmlFor="batch-input" className="file-input-label">
              Select Multiple Images
            </label>
          </div>
          {batchProgress > 0 && batchProgress < 1 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${batchProgress * 100}%` }} />
              <span className="progress-text">{Math.round(batchProgress * 100)}%</span>
            </div>
          )}
          {batchResults.length > 0 && (
            <div className="batch-results">
              <h3>Batch Results ({batchResults.length} images)</h3>
              <div className="batch-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Original</span>
                  <span className="summary-value">{formatBytes(batchTotalOriginal)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Compressed</span>
                  <span className="summary-value highlight">{formatBytes(batchTotalCompressed)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Savings</span>
                  <span className="summary-value success">
                    {formatBytes(batchTotalOriginal - batchTotalCompressed)}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Average Ratio</span>
                  <span className="summary-value">{(batchAverageRatio * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div className="batch-list">
                {batchResults.map((result, index) => (
                  <div key={index} className="batch-item">
                    <div className="batch-item-info">
                      <span className="batch-index">#{index + 1}</span>
                      <span className="batch-size">
                        {formatBytes(result.originalSize)} → {formatBytes(result.compressedSize)}
                      </span>
                      <span className="batch-ratio success">
                        {(result.compressionRatio * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="download-pair">
                      <button type="button" onClick={() => downloadAs(result.file, `batch-${index}`, 'image/webp')} className="download-btn-tiny">.webp</button>
                      <button type="button" onClick={() => downloadAs(result.file, `batch-${index}`, 'image/jpeg')} className="download-btn-tiny">.jpg</button>
                    </div>
                  </div>
                ))}
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
