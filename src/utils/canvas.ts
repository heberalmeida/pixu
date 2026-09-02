export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Quality only applies to JPEG and WebP formats
    // For PNG and other formats, quality is ignored
    const supportsQuality = mimeType === 'image/jpeg' || 
                           mimeType === 'image/jpg' || 
                           mimeType === 'image/webp';
    
    // Normalize quality: ensure it's between 0 and 1, and only use if format supports it
    let normalizedQuality: number | undefined = undefined;
    if (supportsQuality && quality !== undefined && quality !== null) {
      normalizedQuality = Math.max(0, Math.min(1, quality));
      // Ensure quality is not exactly 1 for JPEG/WebP to force compression
      // Quality 1.0 often results in no compression
      if (normalizedQuality >= 0.99) {
        normalizedQuality = 0.99; // Use 0.99 instead of 1.0 to ensure compression
      }
    }
    
    if (canvas.toBlob) {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        mimeType,
        normalizedQuality
      );
    } else {
      const dataURL = canvas.toDataURL(mimeType, normalizedQuality);
      const byteString = atob(dataURL.split(',')[1]);
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      resolve(new Blob([ab], { type: mimeString }));
    }
  });
}

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function drawImageToCanvas(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement | HTMLCanvasElement,
  params?: {
    srcX?: number;
    srcY?: number;
    srcWidth?: number;
    srcHeight?: number;
    destX?: number;
    destY?: number;
    destWidth?: number;
    destHeight?: number;
    rotate?: number;
    scaleX?: number;
    scaleY?: number;
  }
): void {
  const {
    srcX = 0,
    srcY = 0,
    srcWidth = image.width,
    srcHeight = image.height,
    destX = 0,
    destY = 0,
    destWidth = image.width,
    destHeight = image.height,
    rotate = 0,
    scaleX = 1,
    scaleY = 1,
  } = params || {};

  context.save();
  
  if (rotate !== 0 || scaleX !== 1 || scaleY !== 1) {
    const centerX = destX + destWidth / 2;
    const centerY = destY + destHeight / 2;
    
    context.translate(centerX, centerY);
    context.rotate((rotate * Math.PI) / 180);
    context.scale(scaleX, scaleY);
    
    context.drawImage(
      image,
      srcX,
      srcY,
      srcWidth,
      srcHeight,
      -destWidth / 2,
      -destHeight / 2,
      destWidth,
      destHeight
    );
  } else {
    context.drawImage(
      image,
      srcX,
      srcY,
      srcWidth,
      srcHeight,
      destX,
      destY,
      destWidth,
      destHeight
    );
  }
  
  context.restore();
}

