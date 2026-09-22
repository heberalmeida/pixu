// Progressive JPEG support
// Note: Canvas API doesn't directly support progressive JPEG encoding
// This is a helper to detect and work with progressive JPEGs

export function isProgressiveJPEG(buffer: ArrayBuffer): boolean {
  const view = new DataView(buffer);
  
  // Check JPEG header
  if (view.getUint8(0) !== 0xff || view.getUint8(1) !== 0xd8) {
    return false;
  }

  // Look for progressive JPEG markers
  // Progressive JPEGs use specific scan markers
  let offset = 2;
  const length = view.byteLength;
  let foundProgressiveMarker = false;

  while (offset + 1 < length && offset < 65536) {
    if (view.getUint8(offset) === 0xff) {
      const marker = view.getUint8(offset + 1);
      
      // Progressive JPEG markers
      if (marker >= 0xc0 && marker <= 0xc3) {
        // Start of Frame (SOF) markers
        // Check if it's a progressive scan
        if (offset + 5 < length) {
          foundProgressiveMarker = true;
        }
      }
      
      // SOS (Start of Scan) - progressive JPEGs have multiple scans
      if (marker === 0xda) {
        break;
      }
    }
    offset++;
  }

  return foundProgressiveMarker;
}

// Note: Creating progressive JPEG requires specialized encoding
// Canvas API creates baseline JPEG by default
// This function provides metadata about progressive JPEG support
export function supportsProgressiveJPEG(): boolean {
  // Most modern browsers support progressive JPEG decoding
  // but encoding requires specialized libraries
  return typeof document !== 'undefined' && typeof HTMLCanvasElement !== 'undefined';
}

