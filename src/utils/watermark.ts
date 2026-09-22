export interface WatermarkOptions {
  text?: string;
  image?: HTMLImageElement | HTMLCanvasElement;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  padding?: number;
  scale?: number;
  rotation?: number;
  stroke?: boolean;
  strokeColor?: string;
}

function resolveFontSize(canvas: HTMLCanvasElement, fontSize?: number): number {
  const minSide = Math.min(canvas.width, canvas.height);
  const autoSize = Math.max(18, Math.round(minSide * 0.045));
  if (fontSize == null || fontSize <= 0) {
    return autoSize;
  }
  if (fontSize <= 1) {
    return Math.max(12, Math.round(minSide * fontSize));
  }
  const scaled = Math.round(fontSize * (minSide / 720));
  return Math.max(fontSize, scaled, Math.round(autoSize * 0.75));
}

function resolvePadding(canvas: HTMLCanvasElement, padding?: number): number {
  const minSide = Math.min(canvas.width, canvas.height);
  const autoPadding = Math.max(8, Math.round(minSide * 0.025));
  if (padding == null) return autoPadding;
  return Math.max(padding, Math.round(autoPadding * 0.5));
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
    opacity = 0.85,
    fontSize,
    fontFamily = 'Arial, Helvetica, sans-serif',
    color = '#ffffff',
    padding,
    scale = 0.2,
    rotation = 0,
    stroke = true,
    strokeColor = 'rgba(0, 0, 0, 0.65)',
  } = options;

  const hasText = typeof text === 'string' && text.trim().length > 0;
  if (!hasText && !image) {
    return;
  }

  const resolvedPadding = resolvePadding(canvas, padding);
  const resolvedFontSize = resolveFontSize(canvas, fontSize);

  context.save();
  context.globalAlpha = Math.min(1, Math.max(0, opacity));

  let x = 0;
  let y = 0;

  switch (position) {
    case 'top-left':
      x = resolvedPadding;
      y = resolvedPadding;
      break;
    case 'top-right':
      x = canvas.width - resolvedPadding;
      y = resolvedPadding;
      break;
    case 'bottom-left':
      x = resolvedPadding;
      y = canvas.height - resolvedPadding;
      break;
    case 'bottom-right':
      x = canvas.width - resolvedPadding;
      y = canvas.height - resolvedPadding;
      break;
    case 'center':
      x = canvas.width / 2;
      y = canvas.height / 2;
      break;
  }

  if (rotation !== 0) {
    context.translate(x, y);
    context.rotate((rotation * Math.PI) / 180);
    context.translate(-x, -y);
  }

  if (hasText) {
    const label = text!.trim();
    context.font = `600 ${resolvedFontSize}px ${fontFamily}`;
    context.fillStyle = color;
    context.textAlign = position.includes('right')
      ? 'right'
      : position.includes('left')
        ? 'left'
        : 'center';
    context.textBaseline = position.includes('bottom')
      ? 'bottom'
      : position.includes('top')
        ? 'top'
        : 'middle';

    if (stroke) {
      context.lineJoin = 'round';
      context.miterLimit = 2;
      context.lineWidth = Math.max(2, Math.round(resolvedFontSize / 10));
      context.strokeStyle = strokeColor;
      context.strokeText(label, x, y);
    }

    context.shadowColor = 'rgba(0, 0, 0, 0.35)';
    context.shadowBlur = Math.max(2, Math.round(resolvedFontSize / 8));
    context.shadowOffsetX = 0;
    context.shadowOffsetY = Math.max(1, Math.round(resolvedFontSize / 20));
    context.fillText(label, x, y);
    context.shadowColor = 'transparent';
    context.shadowBlur = 0;
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
