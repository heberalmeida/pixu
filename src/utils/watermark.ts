export interface WatermarkOptions {
  text?: string;
  image?: HTMLImageElement | HTMLCanvasElement;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity?: number; // 0-1
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  padding?: number;
  scale?: number; // For image watermarks
  rotation?: number; // Degrees
}

export function applyWatermark(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  options: WatermarkOptions
): void {
  const {
    text,
    image,
    position = 'bottom-right',
    opacity = 0.7,
    fontSize = 16,
    fontFamily = 'Arial',
    color = '#ffffff',
    padding = 10,
    scale = 0.2,
    rotation = 0,
  } = options;

  context.save();

  // Set opacity
  context.globalAlpha = opacity;

  let x = 0;
  let y = 0;

  // Calculate position
  switch (position) {
    case 'top-left':
      x = padding;
      y = padding;
      break;
    case 'top-right':
      x = canvas.width - padding;
      y = padding;
      break;
    case 'bottom-left':
      x = padding;
      y = canvas.height - padding;
      break;
    case 'bottom-right':
      x = canvas.width - padding;
      y = canvas.height - padding;
      break;
    case 'center':
      x = canvas.width / 2;
      y = canvas.height / 2;
      break;
  }

  // Apply rotation
  if (rotation !== 0) {
    context.translate(x, y);
    context.rotate((rotation * Math.PI) / 180);
    context.translate(-x, -y);
  }

  if (text) {
    context.font = `${fontSize}px ${fontFamily}`;
    context.fillStyle = color;
    context.textAlign = position.includes('right') ? 'right' : position.includes('left') ? 'left' : 'center';
    context.textBaseline = position.includes('bottom') ? 'bottom' : position.includes('top') ? 'top' : 'middle';
    context.fillText(text, x, y);
  }

  if (image) {
    const imgWidth = image.width * scale;
    const imgHeight = image.height * scale;

    let imgX = x;
    let imgY = y;

    if (position.includes('right')) {
      imgX = x - imgWidth;
    } else if (position === 'center') {
      imgX = x - imgWidth / 2;
    }

    if (position.includes('bottom')) {
      imgY = y - imgHeight;
    } else if (position === 'center') {
      imgY = y - imgHeight / 2;
    }

    context.drawImage(image, imgX, imgY, imgWidth, imgHeight);
  }

  context.restore();
}

