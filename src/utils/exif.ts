export interface Orientation {
  rotate: number;
  scaleX: number;
  scaleY: number;
}

export function parseOrientation(orientation: number): Orientation {
  let rotate = 0;
  let scaleX = 1;
  let scaleY = 1;

  switch (orientation) {
    case 2:
      scaleX = -1;
      break;
    case 3:
      rotate = 180;
      break;
    case 4:
      scaleY = -1;
      break;
    case 5:
      rotate = 90;
      scaleY = -1;
      break;
    case 6:
      rotate = 90;
      break;
    case 7:
      rotate = 90;
      scaleX = -1;
      break;
    case 8:
      rotate = -90;
      break;
    default:
  }

  return { rotate, scaleX, scaleY };
}

export function getOrientationFromArrayBuffer(buffer: ArrayBuffer): number {
  if (!buffer || buffer.byteLength < 2) {
    return 1;
  }
  
  const view = new DataView(buffer);
  let orientation = 1;

  try {
    // Validate JPEG header
    if (view.byteLength < 2) {
      return 1;
    }
    
    if (view.getUint8(0) === 0xff && view.getUint8(1) === 0xd8) {
      let offset = 2;
      const length = view.byteLength;

      // Limit search to prevent infinite loops (max 64KB)
      const maxOffset = Math.min(length, 65536);
      let iterations = 0;
      const maxIterations = 1000;
      
      while (offset + 1 < maxOffset && iterations < maxIterations) {
        iterations++;
        
        // Safety check
        if (offset >= length - 1) {
          break;
        }
        
        if (view.getUint8(offset) === 0xff && view.getUint8(offset + 1) === 0xe1) {
          const exifOffset = offset + 4;
          
          // Validate bounds
          if (exifOffset + 4 >= length) {
            break;
          }
          
          if (getStringFromDataView(view, exifOffset, 4) === 'Exif') {
            const tiffOffset = offset + 10;
            
            // Validate bounds
            if (tiffOffset + 8 >= length) {
              break;
            }
            
            const endianness = view.getUint16(tiffOffset);
            const littleEndian = endianness === 0x4949;

            if (littleEndian || endianness === 0x4d4d) {
              if (view.getUint16(tiffOffset + 2, littleEndian) === 0x002a) {
                const firstIFDOffset = view.getUint32(tiffOffset + 4, littleEndian);
                
                // Validate offset
                if (firstIFDOffset >= 0x00000008 && 
                    firstIFDOffset < 0x100000 && // Max 1MB offset
                    tiffOffset + firstIFDOffset + 12 < length) {
                  const ifdStart = tiffOffset + firstIFDOffset;
                  const tagCount = view.getUint16(ifdStart, littleEndian);
                  
                  // Limit tag count
                  const maxTags = Math.min(tagCount, 100);
                  for (let i = 0; i < maxTags; i++) {
                    const tagOffset = ifdStart + (i * 12) + 2;
                    if (tagOffset + 10 >= length) {
                      break;
                    }
                    if (view.getUint16(tagOffset, littleEndian) === 0x0112) {
                      orientation = view.getUint16(tagOffset + 8, littleEndian);
                      // Validate orientation
                      if (orientation < 1 || orientation > 8) {
                        orientation = 1;
                      }
                      break;
                    }
                  }
                }
              }
            }
          }
          break;
        }
        offset++;
      }
    }
  } catch {
    orientation = 1;
  }

  return orientation;
}

export function stripExifFromArrayBuffer(buffer: ArrayBuffer): ArrayBuffer {
  if (!buffer || buffer.byteLength < 2) {
    return buffer;
  }
  
  // For very large files, use a more efficient approach
  if (buffer.byteLength > 10 * 1024 * 1024) { // 10MB
    // For large files, just return original to avoid memory issues
    return buffer;
  }
  
  const view = new DataView(buffer);
  const array = new Uint8Array(buffer);
  // Pre-allocate result array to avoid resizing
  const result: number[] = new Array(buffer.byteLength);
  let resultIndex = 0;
  let offset = 0;
  let iterations = 0;
  const maxIterations = 10000; // Safety limit

  // Validate JPEG header
  if (view.getUint8(0) !== 0xff || view.getUint8(1) !== 0xd8) {
    return buffer;
  }
  
  result[resultIndex++] = 0xff;
  result[resultIndex++] = 0xd8;
  offset = 2;

  while (offset < array.length && iterations < maxIterations) {
    iterations++;
    
    // Safety check
    if (offset >= array.length - 1) {
      break;
    }
    
    if (array[offset] === 0xff) {
      const marker = array[offset + 1];
      
      // Validate marker
      if (marker === undefined) {
        break;
      }

      if (marker === 0xe0 || marker === 0xe1) {
        if (offset + 3 >= array.length) {
          break;
        }
        const segmentLength = (array[offset + 2] << 8) | array[offset + 3];
        
        // Validate segment length
        if (segmentLength < 2 || segmentLength > 65535) {
          break;
        }
        
        if (marker === 0xe1) {
          // Skip EXIF segment
          offset += segmentLength + 2;
          if (offset > array.length) {
            break;
          }
          continue;
        }
      }

      if (marker === 0xda) {
        // Start of Scan - copy rest of image
        // Copy remaining bytes directly without spread operator
        const remainingLength = array.length - offset;
        for (let i = 0; i < remainingLength; i++) {
          result[resultIndex++] = array[offset + i];
        }
        break;
      }
    }

    if (array[offset] === 0xff && offset + 3 < array.length) {
      const segmentLength = (array[offset + 2] << 8) | array[offset + 3];
      
      // Validate segment length
      if (segmentLength < 2 || segmentLength > 65535) {
        break;
      }
      
      if (offset + segmentLength + 2 > array.length) {
        break;
      }
      
      // Copy segment directly without spread operator
      const segmentEnd = offset + segmentLength + 2;
      for (let i = offset; i < segmentEnd; i++) {
        result[resultIndex++] = array[i];
      }
      offset += segmentLength + 2;
    } else {
      result[resultIndex++] = array[offset];
      offset++;
    }
  }

  // Trim result array to actual size
  return new Uint8Array(result.slice(0, resultIndex)).buffer;
}

function getStringFromDataView(view: DataView, offset: number, length: number): string {
  let str = '';
  for (let i = 0; i < length; i++) {
    str += String.fromCharCode(view.getUint8(offset + i));
  }
  return str;
}

