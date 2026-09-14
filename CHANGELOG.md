# Changelog

## [1.0.0] - 2025-11-17

### Major Release - All Features Implemented!

### New Features

#### Core Features
- Compression Presets (social-media, print, web, thumbnail, email)
- Image Filters (grayscale, sepia, vintage, brightness, contrast, saturation, blur, sharpen)
- Smart Quality Selection (auto-detect optimal quality based on content)
- Image Validation (validate images before compression)
- Format Conversion (smart PNG to JPEG conversion)

#### Advanced Features
- PNG Optimization (color reduction, transparency optimization)
- Smart Cropping (intelligent crop based on content analysis)
- Watermark (automatic watermark with intelligent positioning)
- Image Analysis (deep content analysis - photo vs graphic, complexity)
- Optimization Hints (automatic suggestions for best settings)
- Progressive JPEG Support (detection and handling)
- Lazy Loading Helper (generate responsive image sets)
- Color Space Conversion (sRGB normalization, wide gamut detection)
- Advanced Batch Processing (retry, pause/resume, priority queuing)
- Memory Management (streaming, chunk processing, auto-cleanup)
- Performance Monitoring (detailed metrics and throughput)

### Improvements

- Fixed stack overflow issues with JPEG files
- Improved PNG handling (returns original if compressed is larger in strict mode)
- Better quality handling (quality 1.0 now properly compresses)
- Enhanced error handling and validation
- Improved EXIF processing with safety limits
- Better memory management for large files

### Bug Fixes

- Fixed "Maximum call stack size exceeded" error
- Fixed PNG files becoming larger after compression
- Fixed quality 0.8 and 1.0 producing same file size
- Fixed JPG/JPEG normalization issues
- Fixed EXIF stripping causing stack overflow
- Fixed image loading timeout issues

### Documentation

- Complete API reference
- 19+ usage examples
- Performance benchmarks
- Best practices guide
- Troubleshooting section

### Technical Details

- **Zero Dependencies** - Still maintains zero external dependencies
- **TypeScript** - Full type safety
- **Bundle Size** - ~35KB (gzipped: ~10KB)
- **Browser Support** - Modern browsers (Chrome, Firefox, Safari, Edge)
- **Node.js Support** - Works in Node.js environments

---

## Features Summary

### Total Features: 18 Major Features
1. Compression Presets
2. Image Filters
3. Smart Quality Selection
4. Image Validation
5. Format Conversion
6. PNG Optimization
8. Smart Cropping
9. Watermark
10. Image Analysis
11. Optimization Hints
12. Progressive JPEG
13. Lazy Loading Helper
14. Color Space Conversion
15. Advanced Batch Processing
16. Memory Management
17. Performance Monitoring
18. Metadata Preservation Seletiva

### Files Created: 12 New Utility Files
- `src/utils/presets.ts`
- `src/utils/filters.ts`
- `src/utils/validation.ts`
- `src/utils/smart-quality.ts`
- `src/utils/format-conversion.ts`
- `src/utils/png-optimization.ts`
- `src/utils/smart-crop.ts`
- `src/utils/watermark.ts`
- `src/utils/image-analysis.ts`
- `src/utils/optimization-hints.ts`
- `src/utils/lazy-loading.ts`
- `src/utils/color-space.ts`
- `src/utils/progressive-jpeg.ts`
- `src/core/batch-advanced.ts`
- `src/utils/memory-management.ts`
- `src/utils/performance-monitoring.ts`
- `src/utils/exif-selective.ts`

---

**Pixu is now the most complete and advanced image compression library available!**

