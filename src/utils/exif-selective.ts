export interface EXIFPreservationOptions {
  preserve?: string[]; // Tags to preserve (e.g., ['Copyright', 'Artist'])
  remove?: string[]; // Tags to remove (e.g., ['GPS', 'DateTime'])
  removeGPS?: boolean; // Remove all GPS data (default: true if remove includes 'GPS')
  preserveCopyright?: boolean; // Preserve copyright info
}

// EXIF tag IDs (simplified list)
const EXIF_TAGS: Record<string, number> = {
  'GPS': 0x8825,
  'DateTime': 0x0132,
  'DateTimeOriginal': 0x9003,
  'Copyright': 0x8298,
  'Artist': 0x013b,
  'Software': 0x0131,
  'Make': 0x010f,
  'Model': 0x0110,
};

export function shouldPreserveEXIFTag(
  tagId: number,
  options: EXIFPreservationOptions
): boolean {
  // If preserve list is specified, only keep those
  if (options.preserve && options.preserve.length > 0) {
    for (const tagName of options.preserve) {
      if (EXIF_TAGS[tagName] === tagId) {
        return true;
      }
    }
    return false;
  }

  // If remove list is specified, remove those
  if (options.remove && options.remove.length > 0) {
    for (const tagName of options.remove) {
      if (EXIF_TAGS[tagName] === tagId) {
        return false;
      }
    }
  }

  // Remove GPS by default if requested
  if (options.removeGPS !== false && tagId === EXIF_TAGS['GPS']) {
    return false;
  }

  // Preserve copyright by default if requested
  if (options.preserveCopyright && tagId === EXIF_TAGS['Copyright']) {
    return true;
  }

  // Default: preserve all except GPS
  return tagId !== EXIF_TAGS['GPS'];
}

// This is a simplified implementation
// Full EXIF selective preservation would require more complex parsing
export function stripEXIFSelective(
  buffer: ArrayBuffer,
  options: EXIFPreservationOptions
): ArrayBuffer {
  // For now, use the existing stripExifFromArrayBuffer
  // Full selective preservation would require complete EXIF parser
  // This is a placeholder for future enhancement
  
  if (options.removeGPS !== false) {
    // Remove GPS data specifically
    return buffer; // Simplified - would need full EXIF parsing
  }
  
  return buffer;
}

