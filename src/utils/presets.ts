import type { CompressionOptions } from '../types';

export type CompressionPreset = 
  | 'social-media' 
  | 'print' 
  | 'web' 
  | 'thumbnail' 
  | 'email';

export interface PresetConfig {
  maxWidth?: number;
  maxHeight?: number;
  quality: number;
  format?: 'image/jpeg' | 'image/webp' | 'auto';
  stripMetadata?: boolean;
}

const PRESETS: Record<CompressionPreset, PresetConfig> = {
  'social-media': {
    maxWidth: 1080,
    quality: 0.85,
    format: 'auto',
    stripMetadata: true,
  },
  'print': {
    maxWidth: 3000,
    quality: 0.95,
    format: 'image/jpeg',
    stripMetadata: false,
  },
  'web': {
    maxWidth: 1920,
    quality: 0.8,
    format: 'auto',
    stripMetadata: true,
  },
  'thumbnail': {
    maxWidth: 320,
    quality: 0.7,
    format: 'auto',
    stripMetadata: true,
  },
  'email': {
    maxWidth: 800,
    quality: 0.75,
    format: 'image/jpeg',
    stripMetadata: true,
  },
};

export function getPresetOptions(preset: CompressionPreset): CompressionOptions {
  const config = PRESETS[preset];
  if (!config) {
    throw new Error(`Unknown preset: ${preset}`);
  }

  return {
    maxWidth: config.maxWidth,
    maxHeight: config.maxWidth, // Maintain aspect ratio
    quality: config.quality,
    format: config.format,
    stripMetadata: config.stripMetadata,
    resize: 'contain', // Presets explicitly use resize mode
  };
}

export function applyPreset(
  options: CompressionOptions,
  preset: CompressionPreset
): CompressionOptions {
  const presetOptions = getPresetOptions(preset);
  
  // Merge preset with user options (user options take precedence)
  return {
    ...presetOptions,
    ...options,
    // Preserve user's quality if specified
    quality: options.quality ?? presetOptions.quality,
  };
}

