import type { CompressionOptions, CompressionResult, Plugin } from '../types';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} is already registered`);
    }
    this.plugins.set(plugin.name, plugin);
  }

  unregister(name: string): void {
    this.plugins.delete(name);
  }

  async runBeforeCompress(
    file: File | Blob,
    options: CompressionOptions
  ): Promise<File | Blob> {
    let result = file;
    for (const plugin of this.plugins.values()) {
      if (plugin.beforeCompress) {
        result = await Promise.resolve(plugin.beforeCompress(result, options));
      }
    }
    return result;
  }

  async runAfterCompress(
    result: CompressionResult,
    options: CompressionOptions
  ): Promise<CompressionResult> {
    let processed = result;
    for (const plugin of this.plugins.values()) {
      if (plugin.afterCompress) {
        processed = await Promise.resolve(plugin.afterCompress(processed, options));
      }
    }
    return processed;
  }

  async runTransform(
    canvas: HTMLCanvasElement,
    options: CompressionOptions
  ): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.transform) {
        await Promise.resolve(plugin.transform(canvas, options));
      }
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }
}

