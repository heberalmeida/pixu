export interface Dimensions {
  width: number;
  height: number;
}

export interface ResizeParams {
  naturalWidth: number;
  naturalHeight: number;
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  width?: number;
  height?: number;
  mode: 'none' | 'contain' | 'cover' | 'fit' | 'fill';
}

export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

export function calculateDimensions(params: ResizeParams): Dimensions {
  const {
    naturalWidth,
    naturalHeight,
    maxWidth,
    maxHeight,
    minWidth = 0,
    minHeight = 0,
    width,
    height,
    mode,
  } = params;

  const aspectRatio = naturalWidth / naturalHeight;
  let targetWidth = naturalWidth;
  let targetHeight = naturalHeight;

  // If mode is 'none', only resize if width/height are explicitly set
  if (mode === 'none') {
    // Only change dimensions if explicitly set
    if (width !== undefined) {
      targetWidth = width;
    }
    if (height !== undefined) {
      targetHeight = height;
    }
    // If both are set, use them; otherwise maintain aspect ratio if only one is set
    if (width !== undefined && height === undefined) {
      targetHeight = targetWidth / aspectRatio;
    } else if (height !== undefined && width === undefined) {
      targetWidth = targetHeight * aspectRatio;
    }
  } else if (mode === 'contain') {
    if (width && height) {
      const containerRatio = width / height;
      if (aspectRatio > containerRatio) {
        targetWidth = width;
        if (maxWidth !== undefined) targetWidth = Math.min(targetWidth, maxWidth);
        targetHeight = targetWidth / aspectRatio;
      } else {
        targetHeight = height;
        if (maxHeight !== undefined) targetHeight = Math.min(targetHeight, maxHeight);
        targetWidth = targetHeight * aspectRatio;
      }
    } else if (width) {
      targetWidth = width;
      if (maxWidth !== undefined) targetWidth = Math.min(targetWidth, maxWidth);
      targetHeight = targetWidth / aspectRatio;
    } else if (height) {
      targetHeight = height;
      if (maxHeight !== undefined) targetHeight = Math.min(targetHeight, maxHeight);
      targetWidth = targetHeight * aspectRatio;
    } else if (maxWidth !== undefined || maxHeight !== undefined) {
      // Only apply maxWidth/maxHeight if explicitly set
      if (maxWidth !== undefined && maxHeight !== undefined) {
        if (naturalWidth / naturalHeight > maxWidth / maxHeight) {
          targetWidth = maxWidth;
          targetHeight = targetWidth / aspectRatio;
        } else {
          targetHeight = maxHeight;
          targetWidth = targetHeight * aspectRatio;
        }
      } else if (maxWidth !== undefined) {
        if (naturalWidth > maxWidth) {
          targetWidth = maxWidth;
          targetHeight = targetWidth / aspectRatio;
        }
      } else if (maxHeight !== undefined) {
        if (naturalHeight > maxHeight) {
          targetHeight = maxHeight;
          targetWidth = targetHeight * aspectRatio;
        }
      }
    }
  } else if (mode === 'cover') {
    if (width && height) {
      const containerRatio = width / height;
      if (aspectRatio > containerRatio) {
        targetHeight = height;
        if (maxHeight !== undefined) targetHeight = Math.min(targetHeight, maxHeight);
        targetWidth = targetHeight * aspectRatio;
      } else {
        targetWidth = width;
        if (maxWidth !== undefined) targetWidth = Math.min(targetWidth, maxWidth);
        targetHeight = targetWidth / aspectRatio;
      }
    } else if (width) {
      targetWidth = width;
      if (maxWidth !== undefined) targetWidth = Math.min(targetWidth, maxWidth);
      targetHeight = targetWidth / aspectRatio;
    } else if (height) {
      targetHeight = height;
      if (maxHeight !== undefined) targetHeight = Math.min(targetHeight, maxHeight);
      targetWidth = targetHeight * aspectRatio;
    } else if (maxWidth !== undefined || maxHeight !== undefined) {
      // Only apply maxWidth/maxHeight if explicitly set
      if (maxWidth !== undefined && maxHeight !== undefined) {
        if (naturalWidth / naturalHeight > maxWidth / maxHeight) {
          targetWidth = maxWidth;
          targetHeight = targetWidth / aspectRatio;
        } else {
          targetHeight = maxHeight;
          targetWidth = targetHeight * aspectRatio;
        }
      } else if (maxWidth !== undefined) {
        if (naturalWidth > maxWidth) {
          targetWidth = maxWidth;
          targetHeight = targetWidth / aspectRatio;
        }
      } else if (maxHeight !== undefined) {
        if (naturalHeight > maxHeight) {
          targetHeight = maxHeight;
          targetWidth = targetHeight * aspectRatio;
        }
      }
    }
  } else if (mode === 'fit') {
    if (width && height) {
      const containerRatio = width / height;
      if (aspectRatio > containerRatio) {
        targetWidth = width;
        if (maxWidth !== undefined) targetWidth = Math.min(targetWidth, maxWidth);
        targetHeight = targetWidth / aspectRatio;
      } else {
        targetHeight = height;
        if (maxHeight !== undefined) targetHeight = Math.min(targetHeight, maxHeight);
        targetWidth = targetHeight * aspectRatio;
      }
    } else if (width) {
      targetWidth = width;
      if (maxWidth !== undefined) targetWidth = Math.min(targetWidth, maxWidth);
      targetHeight = targetWidth / aspectRatio;
    } else if (height) {
      targetHeight = height;
      if (maxHeight !== undefined) targetHeight = Math.min(targetHeight, maxHeight);
      targetWidth = targetHeight * aspectRatio;
    } else if (maxWidth !== undefined || maxHeight !== undefined) {
      // Only apply maxWidth/maxHeight if explicitly set
      if (maxWidth !== undefined && maxHeight !== undefined) {
        if (naturalWidth / naturalHeight > maxWidth / maxHeight) {
          targetWidth = maxWidth;
          targetHeight = targetWidth / aspectRatio;
        } else {
          targetHeight = maxHeight;
          targetWidth = targetHeight * aspectRatio;
        }
      } else if (maxWidth !== undefined) {
        if (naturalWidth > maxWidth) {
          targetWidth = maxWidth;
          targetHeight = targetWidth / aspectRatio;
        }
      } else if (maxHeight !== undefined) {
        if (naturalHeight > maxHeight) {
          targetHeight = maxHeight;
          targetWidth = targetHeight * aspectRatio;
        }
      }
    }
  } else if (mode === 'fill') {
    targetWidth = width ?? naturalWidth;
    targetHeight = height ?? naturalHeight;
  }

  // Apply min constraints only if set
  if (minWidth !== undefined && minWidth > 0) {
    targetWidth = Math.max(targetWidth, minWidth);
  }
  if (minHeight !== undefined && minHeight > 0) {
    targetHeight = Math.max(targetHeight, minHeight);
  }
  
  // Apply max constraints only if set
  if (maxWidth !== undefined) {
    targetWidth = Math.min(targetWidth, maxWidth);
  }
  if (maxHeight !== undefined) {
    targetHeight = Math.min(targetHeight, maxHeight);
  }

  return {
    width: Math.round(targetWidth),
    height: Math.round(targetHeight),
  };
}

export function getSourceDimensions(
  naturalWidth: number,
  naturalHeight: number,
  targetWidth: number,
  targetHeight: number,
  mode: 'contain' | 'cover' | 'fit'
): { x: number; y: number; width: number; height: number } {
  const aspectRatio = naturalWidth / naturalHeight;
  const targetRatio = targetWidth / targetHeight;

  let srcWidth = naturalWidth;
  let srcHeight = naturalHeight;
  let srcX = 0;
  let srcY = 0;

  if (mode === 'cover') {
    if (aspectRatio > targetRatio) {
      srcHeight = naturalHeight;
      srcWidth = srcHeight * targetRatio;
      srcX = (naturalWidth - srcWidth) / 2;
    } else {
      srcWidth = naturalWidth;
      srcHeight = srcWidth / targetRatio;
      srcY = (naturalHeight - srcHeight) / 2;
    }
  } else if (mode === 'contain' || mode === 'fit') {
    if (aspectRatio > targetRatio) {
      srcWidth = naturalWidth;
      srcHeight = srcWidth / targetRatio;
      srcY = (naturalHeight - srcHeight) / 2;
    } else {
      srcHeight = naturalHeight;
      srcWidth = srcHeight * targetRatio;
      srcX = (naturalWidth - srcWidth) / 2;
    }
  }

  return {
    x: Math.round(srcX),
    y: Math.round(srcY),
    width: Math.round(srcWidth),
    height: Math.round(srcHeight),
  };
}

