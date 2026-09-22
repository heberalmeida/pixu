function te(t) {
  if (!t || typeof t != "string")
    return !1;
  const e = t.toLowerCase().replace(/^image\/jpg$/, "image/jpeg");
  return e === "image/pixu" || e === "image/pix" ? !0 : /^image\/(jpeg|png|webp|avif|gif|bmp|svg\+xml)$/i.test(e);
}
function he(t) {
  const e = t.toLowerCase().replace(/^image\/jpg$/, "image/jpeg");
  return {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/avif": ".avif",
    "image/pixu": ".pixu",
    "image/pix": ".pixu",
    "image/gif": ".gif",
    "image/bmp": ".bmp"
  }[e] || ".jpg";
}
function me(t) {
  return new Promise((e, i) => {
    if (typeof document > "u") {
      i(new Error("Not in browser environment"));
      return;
    }
    const a = new Image();
    a.crossOrigin = "anonymous";
    let r = !1;
    const n = () => {
      a.onload = null, a.onerror = null;
    }, s = setTimeout(() => {
      r || (r = !0, n(), i(new Error("Image loading timeout")));
    }, 3e4);
    a.onload = () => {
      clearTimeout(s), r || (r = !0, n(), e(a));
    }, a.onerror = () => {
      clearTimeout(s), r || (r = !0, n(), i(new Error("Failed to load image")));
    }, a.src = t;
  });
}
function fe(t) {
  const {
    naturalWidth: e,
    naturalHeight: i,
    maxWidth: a,
    maxHeight: r,
    minWidth: n = 0,
    minHeight: s = 0,
    width: o,
    height: l,
    mode: f
  } = t, m = e / i;
  let c = e, h = i;
  if (f === "none")
    o !== void 0 && (c = o), l !== void 0 && (h = l), o !== void 0 && l === void 0 ? h = c / m : l !== void 0 && o === void 0 && (c = h * m);
  else if (f === "contain")
    if (o && l) {
      const y = o / l;
      m > y ? (c = o, a !== void 0 && (c = Math.min(c, a)), h = c / m) : (h = l, r !== void 0 && (h = Math.min(h, r)), c = h * m);
    } else o ? (c = o, a !== void 0 && (c = Math.min(c, a)), h = c / m) : l ? (h = l, r !== void 0 && (h = Math.min(h, r)), c = h * m) : (a !== void 0 || r !== void 0) && (a !== void 0 && r !== void 0 ? e / i > a / r ? (c = a, h = c / m) : (h = r, c = h * m) : a !== void 0 ? e > a && (c = a, h = c / m) : r !== void 0 && i > r && (h = r, c = h * m));
  else if (f === "cover")
    if (o && l) {
      const y = o / l;
      m > y ? (h = l, r !== void 0 && (h = Math.min(h, r)), c = h * m) : (c = o, a !== void 0 && (c = Math.min(c, a)), h = c / m);
    } else o ? (c = o, a !== void 0 && (c = Math.min(c, a)), h = c / m) : l ? (h = l, r !== void 0 && (h = Math.min(h, r)), c = h * m) : (a !== void 0 || r !== void 0) && (a !== void 0 && r !== void 0 ? e / i > a / r ? (c = a, h = c / m) : (h = r, c = h * m) : a !== void 0 ? e > a && (c = a, h = c / m) : r !== void 0 && i > r && (h = r, c = h * m));
  else if (f === "fit")
    if (o && l) {
      const y = o / l;
      m > y ? (c = o, a !== void 0 && (c = Math.min(c, a)), h = c / m) : (h = l, r !== void 0 && (h = Math.min(h, r)), c = h * m);
    } else o ? (c = o, a !== void 0 && (c = Math.min(c, a)), h = c / m) : l ? (h = l, r !== void 0 && (h = Math.min(h, r)), c = h * m) : (a !== void 0 || r !== void 0) && (a !== void 0 && r !== void 0 ? e / i > a / r ? (c = a, h = c / m) : (h = r, c = h * m) : a !== void 0 ? e > a && (c = a, h = c / m) : r !== void 0 && i > r && (h = r, c = h * m));
  else f === "fill" && (c = o ?? e, h = l ?? i);
  return n !== void 0 && n > 0 && (c = Math.max(c, n)), s !== void 0 && s > 0 && (h = Math.max(h, s)), a !== void 0 && (c = Math.min(c, a)), r !== void 0 && (h = Math.min(h, r)), {
    width: Math.round(c),
    height: Math.round(h)
  };
}
function ge(t, e, i, a, r) {
  const n = t / e, s = i / a;
  let o = t, l = e, f = 0, m = 0;
  return r === "cover" ? n > s ? (l = e, o = l * s, f = (t - o) / 2) : (o = t, l = o / s, m = (e - l) / 2) : (r === "contain" || r === "fit") && (n > s ? (o = t, l = o / s, m = (e - l) / 2) : (l = e, o = l * s, f = (t - o) / 2)), {
    x: Math.round(f),
    y: Math.round(m),
    width: Math.round(o),
    height: Math.round(l)
  };
}
function ue(t) {
  let e = 0, i = 1, a = 1;
  switch (t) {
    case 2:
      i = -1;
      break;
    case 3:
      e = 180;
      break;
    case 4:
      a = -1;
      break;
    case 5:
      e = 90, a = -1;
      break;
    case 6:
      e = 90;
      break;
    case 7:
      e = 90, i = -1;
      break;
    case 8:
      e = -90;
      break;
  }
  return { rotate: e, scaleX: i, scaleY: a };
}
function de(t) {
  if (!t || t.byteLength < 2)
    return 1;
  const e = new DataView(t);
  let i = 1;
  try {
    if (e.byteLength < 2)
      return 1;
    if (e.getUint8(0) === 255 && e.getUint8(1) === 216) {
      let a = 2;
      const r = e.byteLength, n = Math.min(r, 65536);
      let s = 0;
      const o = 1e3;
      for (; a + 1 < n && s < o && (s++, !(a >= r - 1)); ) {
        if (e.getUint8(a) === 255 && e.getUint8(a + 1) === 225) {
          const l = a + 4;
          if (l + 4 >= r)
            break;
          if (we(e, l, 4) === "Exif") {
            const f = a + 10;
            if (f + 8 >= r)
              break;
            const m = e.getUint16(f), c = m === 18761;
            if ((c || m === 19789) && e.getUint16(f + 2, c) === 42) {
              const h = e.getUint32(f + 4, c);
              if (h >= 8 && h < 1048576 && // Max 1MB offset
              f + h + 12 < r) {
                const y = f + h, b = e.getUint16(y, c), x = Math.min(b, 100);
                for (let d = 0; d < x; d++) {
                  const u = y + d * 12 + 2;
                  if (u + 10 >= r)
                    break;
                  if (e.getUint16(u, c) === 274) {
                    i = e.getUint16(u + 8, c), (i < 1 || i > 8) && (i = 1);
                    break;
                  }
                }
              }
            }
          }
          break;
        }
        a++;
      }
    }
  } catch {
    i = 1;
  }
  return i;
}
function pe(t) {
  if (!t || t.byteLength < 2 || t.byteLength > 10 * 1024 * 1024)
    return t;
  const e = new DataView(t), i = new Uint8Array(t), a = new Array(t.byteLength);
  let r = 0, n = 0, s = 0;
  const o = 1e4;
  if (e.getUint8(0) !== 255 || e.getUint8(1) !== 216)
    return t;
  for (a[r++] = 255, a[r++] = 216, n = 2; n < i.length && s < o && (s++, !(n >= i.length - 1)); ) {
    if (i[n] === 255) {
      const l = i[n + 1];
      if (l === void 0)
        break;
      if (l === 224 || l === 225) {
        if (n + 3 >= i.length)
          break;
        const f = i[n + 2] << 8 | i[n + 3];
        if (f < 2 || f > 65535)
          break;
        if (l === 225) {
          if (n += f + 2, n > i.length)
            break;
          continue;
        }
      }
      if (l === 218) {
        const f = i.length - n;
        for (let m = 0; m < f; m++)
          a[r++] = i[n + m];
        break;
      }
    }
    if (i[n] === 255 && n + 3 < i.length) {
      const l = i[n + 2] << 8 | i[n + 3];
      if (l < 2 || l > 65535 || n + l + 2 > i.length)
        break;
      const f = n + l + 2;
      for (let m = n; m < f; m++)
        a[r++] = i[m];
      n += l + 2;
    } else
      a[r++] = i[n], n++;
  }
  return new Uint8Array(a.slice(0, r)).buffer;
}
function we(t, e, i) {
  let a = "";
  for (let r = 0; r < i; r++)
    a += String.fromCharCode(t.getUint8(e + r));
  return a;
}
function ye(t) {
  return t.enableDualPass === !1 ? !1 : t.enableDualPass === !0 ? !0 : (t.targetSize ? t.targetSize : 0) / (1024 * 1024) > 2 || t.mode === "size";
}
function Me(t, e) {
  const i = t.getImageData(0, 0, e.width, e.height), a = i.data;
  for (let r = 0; r < a.length; r += 4) {
    const n = a[r], s = a[r + 1], o = a[r + 2], l = n * 0.299 + s * 0.587 + o * 0.114, f = 10;
    Math.abs(n - l) < f && (a[r] = l), Math.abs(s - l) < f && (a[r + 1] = l), Math.abs(o - l) < f && (a[r + 2] = l);
  }
  t.putImageData(i, 0, 0);
}
function be(t, e) {
  const i = t.getImageData(0, 0, e.width, e.height), a = i.data;
  for (let r = 0; r < a.length; r += 4) {
    const n = a[r], s = a[r + 1], o = a[r + 2], f = n * 0.2126 + s * 0.7152 + o * 0.0722 > 128 ? 1.05 : 0.95;
    a[r] = Math.min(255, n * f), a[r + 1] = Math.min(255, s * f), a[r + 2] = Math.min(255, o * f);
  }
  t.putImageData(i, 0, 0);
}
function xe(t, e) {
  const i = t.getImageData(0, 0, e.width, e.height), a = i.data, r = 0.8;
  for (let n = 0; n < a.length; n += 4)
    a[n] = Math.min(255, a[n] * r), a[n + 1] = Math.min(255, a[n + 1] * r), a[n + 2] = Math.min(255, a[n + 2] * r);
  t.putImageData(i, 0, 0);
}
function H(t, e, i) {
  return new Promise((a, r) => {
    const n = e === "image/jpeg" || e === "image/jpg" || e === "image/webp";
    let s;
    if (n && i !== void 0 && i !== null && (s = Math.max(0, Math.min(1, i)), s >= 0.99 && (s = 0.99)), t.toBlob)
      t.toBlob(
        (o) => {
          o ? a(o) : r(new Error("Failed to convert canvas to blob"));
        },
        e,
        s
      );
    else {
      const o = t.toDataURL(e, s), l = atob(o.split(",")[1]), f = o.split(",")[0].split(":")[1].split(";")[0], m = new ArrayBuffer(l.length), c = new Uint8Array(m);
      for (let h = 0; h < l.length; h++)
        c[h] = l.charCodeAt(h);
      a(new Blob([m], { type: f }));
    }
  });
}
function K(t, e) {
  const i = document.createElement("canvas");
  return i.width = t, i.height = e, i;
}
function ie(t, e, i) {
  const {
    srcX: a = 0,
    srcY: r = 0,
    srcWidth: n = e.width,
    srcHeight: s = e.height,
    destX: o = 0,
    destY: l = 0,
    destWidth: f = e.width,
    destHeight: m = e.height,
    rotate: c = 0,
    scaleX: h = 1,
    scaleY: y = 1
  } = i || {};
  if (t.save(), c !== 0 || h !== 1 || y !== 1) {
    const b = o + f / 2, x = l + m / 2;
    t.translate(b, x), t.rotate(c * Math.PI / 180), t.scale(h, y), t.drawImage(
      e,
      a,
      r,
      n,
      s,
      -f / 2,
      -m / 2,
      f,
      m
    );
  } else
    t.drawImage(
      e,
      a,
      r,
      n,
      s,
      o,
      l,
      f,
      m
    );
  t.restore();
}
class Ce {
  constructor() {
    this.plugins = /* @__PURE__ */ new Map();
  }
  register(e) {
    this.plugins.has(e.name) && console.warn(`Plugin ${e.name} is already registered`), this.plugins.set(e.name, e);
  }
  unregister(e) {
    this.plugins.delete(e);
  }
  async runBeforeCompress(e, i) {
    let a = e;
    for (const r of this.plugins.values())
      r.beforeCompress && (a = await Promise.resolve(r.beforeCompress(a, i)));
    return a;
  }
  async runAfterCompress(e, i) {
    let a = e;
    for (const r of this.plugins.values())
      r.afterCompress && (a = await Promise.resolve(r.afterCompress(a, i)));
    return a;
  }
  async runTransform(e, i) {
    for (const a of this.plugins.values())
      a.transform && await Promise.resolve(a.transform(e, i));
  }
  getPlugin(e) {
    return this.plugins.get(e);
  }
  getAllPlugins() {
    return Array.from(this.plugins.values());
  }
}
const ve = {
  "social-media": {
    maxWidth: 1080,
    quality: 0.82,
    format: "image/pixu",
    stripMetadata: !0
  },
  print: {
    maxWidth: 3e3,
    quality: 0.92,
    format: "image/jpeg",
    stripMetadata: !1
  },
  web: {
    maxWidth: 1920,
    quality: 0.78,
    format: "image/pixu",
    stripMetadata: !0
  },
  thumbnail: {
    maxWidth: 320,
    quality: 0.7,
    format: "image/pixu",
    stripMetadata: !0
  },
  email: {
    maxWidth: 800,
    quality: 0.72,
    format: "image/jpeg",
    stripMetadata: !0
  }
};
function Ie(t) {
  const e = ve[t];
  if (!e)
    throw new Error(`Unknown preset: ${t}`);
  return {
    maxWidth: e.maxWidth,
    maxHeight: e.maxWidth,
    quality: e.quality,
    format: e.format,
    stripMetadata: e.stripMetadata,
    resize: "contain",
    enableSmartQuality: e.format === "image/pixu" || e.format === "auto"
  };
}
function Pe(t, e) {
  const i = Ie(e);
  return {
    ...i,
    ...t,
    // Preserve user's quality if specified
    quality: t.quality ?? i.quality
  };
}
function Ee(t, e, i, a) {
  let r, n;
  typeof i == "string" ? (r = i, n = a ?? 1) : (r = i.type, n = i.value ?? 1);
  const s = t.getImageData(0, 0, e.width, e.height), o = s.data;
  switch (r) {
    case "grayscale":
      ze(o);
      break;
    case "sepia":
      Se(o);
      break;
    case "vintage":
      ke(o);
      break;
    case "brightness":
      De(o, n);
      break;
    case "contrast":
      Fe(o, n);
      break;
    case "saturation":
      Re(o, n);
      break;
    case "blur":
      t.filter = `blur(${n}px)`;
      const l = document.createElement("canvas");
      l.width = e.width, l.height = e.height;
      const f = l.getContext("2d");
      f && (f.drawImage(e, 0, 0), t.clearRect(0, 0, e.width, e.height), t.filter = "none", t.drawImage(l, 0, 0));
      return;
    case "sharpen":
      Te(t, e, n);
      return;
  }
  t.putImageData(s, 0, 0);
}
function ze(t) {
  for (let e = 0; e < t.length; e += 4) {
    const i = t[e] * 0.299 + t[e + 1] * 0.587 + t[e + 2] * 0.114;
    t[e] = i, t[e + 1] = i, t[e + 2] = i;
  }
}
function Se(t) {
  for (let e = 0; e < t.length; e += 4) {
    const i = t[e], a = t[e + 1], r = t[e + 2];
    t[e] = Math.min(255, i * 0.393 + a * 0.769 + r * 0.189), t[e + 1] = Math.min(255, i * 0.349 + a * 0.686 + r * 0.168), t[e + 2] = Math.min(255, i * 0.272 + a * 0.534 + r * 0.131);
  }
}
function ke(t) {
  for (let e = 0; e < t.length; e += 4) {
    const i = t[e] * 0.3 + t[e + 1] * 0.59 + t[e + 2] * 0.11;
    t[e] = Math.min(255, t[e] * 0.7 + i * 0.3), t[e + 1] = Math.min(255, t[e + 1] * 0.7 + i * 0.3), t[e + 2] = Math.min(255, t[e + 2] * 0.7 + i * 0.3), t[e] = Math.min(255, t[e] * 1.1), t[e + 2] = Math.min(255, t[e + 2] * 0.9);
  }
}
function De(t, e) {
  const i = (e - 0.5) * 2;
  for (let a = 0; a < t.length; a += 4)
    t[a] = Math.max(0, Math.min(255, t[a] + i * 128)), t[a + 1] = Math.max(0, Math.min(255, t[a + 1] + i * 128)), t[a + 2] = Math.max(0, Math.min(255, t[a + 2] + i * 128));
}
function Fe(t, e) {
  const i = (e - 0.5) * 2, a = 128 * (1 - i);
  for (let r = 0; r < t.length; r += 4)
    t[r] = Math.max(0, Math.min(255, t[r] * i + a)), t[r + 1] = Math.max(0, Math.min(255, t[r + 1] * i + a)), t[r + 2] = Math.max(0, Math.min(255, t[r + 2] * i + a));
}
function Re(t, e) {
  for (let i = 0; i < t.length; i += 4) {
    const a = t[i] * 0.299 + t[i + 1] * 0.587 + t[i + 2] * 0.114;
    t[i] = Math.max(0, Math.min(255, a + (t[i] - a) * e)), t[i + 1] = Math.max(0, Math.min(255, a + (t[i + 1] - a) * e)), t[i + 2] = Math.max(0, Math.min(255, a + (t[i + 2] - a) * e));
  }
}
function Te(t, e, i) {
  const a = t.getImageData(0, 0, e.width, e.height), r = a.data, n = e.width, s = e.height, o = [
    0,
    -i,
    0,
    -i,
    1 + 4 * i,
    -i,
    0,
    -i,
    0
  ], l = new Uint8ClampedArray(r);
  for (let f = 1; f < s - 1; f++)
    for (let m = 1; m < n - 1; m++)
      for (let c = 0; c < 3; c++) {
        let h = 0;
        for (let b = -1; b <= 1; b++)
          for (let x = -1; x <= 1; x++) {
            const d = ((f + b) * n + (m + x)) * 4 + c, u = o[(b + 1) * 3 + (x + 1)];
            h += l[d] * u;
          }
        const y = (f * n + m) * 4 + c;
        r[y] = Math.max(0, Math.min(255, h));
      }
  t.putImageData(a, 0, 0);
}
async function re(t) {
  const e = {
    isValid: !0,
    errors: [],
    warnings: []
  };
  if (t.size === 0)
    return e.isValid = !1, e.errors.push("File is empty"), e;
  e.fileSize = t.size;
  const i = t.type || "";
  e.declaredFormat = i, (!i || !i.startsWith("image/")) && e.warnings.push("File type not declared or not an image");
  try {
    const a = URL.createObjectURL(t), r = new Image();
    await new Promise((n, s) => {
      const o = setTimeout(() => {
        s(new Error("Image loading timeout"));
      }, 5e3);
      r.onload = () => {
        clearTimeout(o), e.dimensions = {
          width: r.naturalWidth,
          height: r.naturalHeight
        }, (r.naturalWidth <= 0 || r.naturalHeight <= 0) && (e.isValid = !1, e.errors.push("Invalid image dimensions")), (r.naturalWidth > 16384 || r.naturalHeight > 16384) && e.warnings.push("Image dimensions are very large (>16K pixels)");
        const l = document.createElement("canvas");
        l.width = 1, l.height = 1;
        const f = l.getContext("2d");
        if (f) {
          f.drawImage(r, 0, 0);
          try {
            const m = l.toDataURL();
            m.startsWith("data:image/") && (e.actualFormat = m.split(";")[0].split(":")[1]);
          } catch {
          }
        }
        URL.revokeObjectURL(a), n();
      }, r.onerror = () => {
        clearTimeout(o), e.isValid = !1, e.errors.push("Failed to load image - file may be corrupted"), URL.revokeObjectURL(a), s(new Error("Image load failed"));
      }, r.src = a;
    }), e.actualFormat && e.declaredFormat && e.actualFormat !== e.declaredFormat && e.warnings.push(
      `Format mismatch: declared as ${e.declaredFormat}, actual format is ${e.actualFormat}`
    );
  } catch (a) {
    e.isValid = !1, e.errors.push(
      a instanceof Error ? a.message : "Unknown validation error"
    );
  }
  return e;
}
function Ze(t) {
  return re(t).then((e) => e.isValid);
}
async function je(t) {
  const e = t.getContext("2d");
  if (!e)
    return {
      isPhoto: !0,
      isGraphic: !1,
      hasText: !1,
      complexity: "medium",
      recommendedQuality: 0.8
    };
  const a = e.getImageData(0, 0, t.width, t.height).data, r = t.width, n = t.height, s = r * n;
  let o = 0;
  const l = /* @__PURE__ */ new Map();
  let f = 0;
  const m = 10;
  for (let g = 0; g < a.length; g += 4 * m) {
    const w = a[g], M = a[g + 1], P = a[g + 2];
    if (a[g + 3] < 255)
      continue;
    const S = `${Math.floor(w / 16)}-${Math.floor(M / 16)}-${Math.floor(P / 16)}`;
    l.has(S) || (o++, l.set(S, 1));
    const C = g / 4 % r, I = Math.floor(g / 4 / r);
    if (C > 0 && I > 0 && C < r - 1 && I < n - 1) {
      const F = (I * r + C) * 4, R = (I * r + (C + 1)) * 4;
      Math.abs(
        (a[F] + a[F + 1] + a[F + 2]) / 3 - (a[R] + a[R + 1] + a[R + 2]) / 3
      ) > 30 && f++;
    }
  }
  const c = s / m, h = o / c, y = f / c, b = h > 0.3 && y > 0.1, x = h < 0.2 && y < 0.05, d = y > 0.15 && h < 0.4;
  let u;
  h < 0.1 && y < 0.05 ? u = "low" : h > 0.5 || y > 0.2 ? u = "high" : u = "medium";
  let p;
  return x || d ? p = 0.9 : b && u === "high" ? p = 0.75 : b && u === "low" ? p = 0.85 : p = 0.8, {
    isPhoto: b,
    isGraphic: x,
    hasText: d,
    complexity: u,
    recommendedQuality: p
  };
}
function Ue(t, e) {
  return t.quality !== void 0 && t.quality !== null ? t.quality : e.recommendedQuality;
}
async function et(t, e, i = {}) {
  const a = document.createElement("canvas");
  t instanceof HTMLImageElement ? (a.width = t.naturalWidth, a.height = t.naturalHeight) : (a.width = t.width, a.height = t.height);
  const r = a.getContext("2d");
  if (!r)
    throw new Error("Failed to get canvas context");
  if (e === "image/jpeg" || e === "image/jpg") {
    const n = i.backgroundColor || "#ffffff";
    r.fillStyle = n, r.fillRect(0, 0, a.width, a.height);
  }
  return t instanceof HTMLImageElement, r.drawImage(t, 0, 0), a;
}
async function ae(t) {
  let e, i;
  if (t instanceof HTMLImageElement) {
    if (e = document.createElement("canvas"), e.width = t.naturalWidth, e.height = t.naturalHeight, i = e.getContext("2d"), !i)
      return !1;
    i.drawImage(t, 0, 0);
  } else if (e = t, i = e.getContext("2d"), !i)
    return !1;
  const r = i.getImageData(0, 0, e.width, e.height).data, n = 100;
  for (let s = 3; s < r.length; s += 4 * n)
    if (r[s] < 255)
      return !0;
  return !1;
}
function Be(t, e, i) {
  return t === "image/jpeg" || t === "image/jpg" || t === "image/png" && e ? !1 : t === "image/png" && i > 5e5;
}
function $e(t, e = {}) {
  const i = t.getContext("2d");
  if (!i)
    return t;
  const a = i.getImageData(0, 0, t.width, t.height), r = a.data, n = /* @__PURE__ */ new Map();
  let s = 0;
  for (let o = 0; o < r.length; o += 4) {
    const l = r[o], f = r[o + 1], m = r[o + 2];
    if (r[o + 3] < 255 && s++, e.reduceColors) {
      const h = `${Math.floor(l / 16) * 16}-${Math.floor(f / 16) * 16}-${Math.floor(m / 16) * 16}`;
      n.set(h, (n.get(h) || 0) + 1);
    }
  }
  if (e.reduceColors && e.maxColors) {
    const o = Math.min(e.maxColors, 256), l = Array.from(n.entries()).sort((m, c) => c[1] - m[1]).slice(0, o), f = /* @__PURE__ */ new Map();
    l.forEach(([m]) => {
      const [c, h, y] = m.split("-").map(Number);
      f.set(m, [c, h, y]);
    });
    for (let m = 0; m < r.length; m += 4) {
      const c = r[m], h = r[m + 1], y = r[m + 2];
      let b = 1 / 0, x = [c, h, y];
      for (const [d, u] of f.entries()) {
        const p = Math.sqrt(
          Math.pow(c - u[0], 2) + Math.pow(h - u[1], 2) + Math.pow(y - u[2], 2)
        );
        p < b && (b = p, x = u);
      }
      r[m] = x[0], r[m + 1] = x[1], r[m + 2] = x[2];
    }
  }
  if (e.optimizeTransparency && s > 0)
    for (let o = 0; o < r.length; o += 4)
      r[o + 3] === 0 && (r[o] = 0, r[o + 1] = 0, r[o + 2] = 0);
  return i.putImageData(a, 0, 0), t;
}
function Le(t, e) {
  const i = t.getContext("2d");
  if (!i)
    return { x: 0, y: 0, width: t.width, height: t.height };
  const r = i.getImageData(0, 0, t.width, t.height).data, n = t.width, s = t.height;
  let o = 0, l = 0, f = 0;
  const m = 5;
  for (let M = 0; M < s; M += m)
    for (let P = 0; P < n; P += m) {
      const E = (M * n + P) * 4, S = r[E], C = r[E + 1], I = r[E + 2];
      if (r[E + 3] < 128) continue;
      const R = (S + C + I) / 3;
      let z = 0;
      if (P > 0 && P < n - 1 && M > 0 && M < s - 1) {
        const U = (M * n + (P + 1)) * 4, T = ((M + 1) * n + P) * 4;
        z = Math.abs(
          (r[U] + r[U + 1] + r[U + 2]) / 3 - R
        ) + Math.abs(
          (r[T] + r[T + 1] + r[T + 2]) / 3 - R
        );
      }
      const k = R * 0.5 + z * 0.5;
      o += k, l += P * k, f += M * k;
    }
  const c = o > 0 ? l / o : n / 2, h = o > 0 ? f / o : s / 2;
  let y = c, b = h;
  switch (e.focus) {
    case "top":
      b = s * 0.25;
      break;
    case "bottom":
      b = s * 0.75;
      break;
    case "left":
      y = n * 0.25;
      break;
    case "right":
      y = n * 0.75;
      break;
  }
  const x = e.width / e.height, d = n / s;
  let u, p;
  x > d ? (p = s, u = s * x) : (u = n, p = n / x), u = Math.min(u, n), p = Math.min(p, s);
  let g = y - u / 2, w = b - p / 2;
  return g = Math.max(0, Math.min(g, n - u)), w = Math.max(0, Math.min(w, s - p)), {
    x: Math.floor(g),
    y: Math.floor(w),
    width: Math.floor(u),
    height: Math.floor(p)
  };
}
function We(t, e) {
  const i = Math.min(t.width, t.height), a = Math.max(18, Math.round(i * 0.045));
  if (e == null || e <= 0)
    return a;
  if (e <= 1)
    return Math.max(12, Math.round(i * e));
  const r = Math.round(e * (i / 720));
  return Math.max(e, r, Math.round(a * 0.75));
}
function He(t, e) {
  const i = Math.min(t.width, t.height), a = Math.max(8, Math.round(i * 0.025));
  return e == null ? a : Math.max(e, Math.round(a * 0.5));
}
function qe(t, e, i) {
  const {
    text: a,
    image: r,
    position: n = "bottom-right",
    opacity: s = 0.85,
    fontSize: o,
    fontFamily: l = "Arial, Helvetica, sans-serif",
    color: f = "#ffffff",
    padding: m,
    scale: c = 0.2,
    rotation: h = 0,
    stroke: y = !0,
    strokeColor: b = "rgba(0, 0, 0, 0.65)"
  } = i, x = typeof a == "string" && a.trim().length > 0;
  if (!x && !r)
    return;
  const d = He(e, m), u = We(e, o);
  t.save(), t.globalAlpha = Math.min(1, Math.max(0, s));
  let p = 0, g = 0;
  switch (n) {
    case "top-left":
      p = d, g = d;
      break;
    case "top-right":
      p = e.width - d, g = d;
      break;
    case "bottom-left":
      p = d, g = e.height - d;
      break;
    case "bottom-right":
      p = e.width - d, g = e.height - d;
      break;
    case "center":
      p = e.width / 2, g = e.height / 2;
      break;
  }
  if (h !== 0 && (t.translate(p, g), t.rotate(h * Math.PI / 180), t.translate(-p, -g)), x) {
    const w = a.trim();
    t.font = `600 ${u}px ${l}`, t.fillStyle = f, t.textAlign = n.includes("right") ? "right" : n.includes("left") ? "left" : "center", t.textBaseline = n.includes("bottom") ? "bottom" : n.includes("top") ? "top" : "middle", y && (t.lineJoin = "round", t.miterLimit = 2, t.lineWidth = Math.max(2, Math.round(u / 10)), t.strokeStyle = b, t.strokeText(w, p, g)), t.shadowColor = "rgba(0, 0, 0, 0.35)", t.shadowBlur = Math.max(2, Math.round(u / 8)), t.shadowOffsetX = 0, t.shadowOffsetY = Math.max(1, Math.round(u / 20)), t.fillText(w, p, g), t.shadowColor = "transparent", t.shadowBlur = 0;
  }
  if (r) {
    const w = r.width * c, M = r.height * c;
    let P = p, E = g;
    n.includes("right") ? P = p - w : n === "center" && (P = p - w / 2), n.includes("bottom") ? E = g - M : n === "center" && (E = g - M / 2), t.drawImage(r, P, E, w, M);
  }
  t.restore();
}
class Oe {
  constructor(e) {
    this.metrics = {
      startTime: performance.now(),
      originalSize: e,
      compressedSize: 0,
      compressionRatio: 0
    }, this.startMemory = this.getCurrentMemory();
  }
  recordCompression(e) {
    const i = performance.now(), a = i - this.metrics.startTime, r = 1 - e / this.metrics.originalSize, n = this.metrics.originalSize / (a / 1e3), s = this.getCurrentMemory(), o = s - this.startMemory;
    return this.metrics = {
      ...this.metrics,
      endTime: i,
      duration: a,
      compressedSize: e,
      compressionRatio: r,
      throughput: n,
      memoryUsed: o,
      memoryPeak: s
    }, this.metrics;
  }
  getMetrics() {
    return { ...this.metrics };
  }
  getCurrentMemory() {
    return "memory" in performance ? performance.memory.usedJSHeapSize : 0;
  }
}
function tt(t) {
  if (!Number.isFinite(t) || t === 0) return "0 B";
  const e = t < 0 ? "-" : "", i = Math.abs(t), a = 1024, r = ["B", "KB", "MB", "GB"], n = Math.min(r.length - 1, Math.floor(Math.log(i) / Math.log(a)));
  return `${e}${Math.round(i / Math.pow(a, n) * 100) / 100} ${r[n]}`;
}
function it(t) {
  return t < 1e3 ? `${Math.round(t)}ms` : t < 6e4 ? `${(t / 1e3).toFixed(2)}s` : `${(t / 6e4).toFixed(2)}min`;
}
const D = "image/pixu", Ae = ".pixu", rt = D, at = Ae;
function Z() {
  return !0;
}
const nt = Z;
function Xe(t) {
  return t === "image/pix" ? D : t;
}
async function G(t, e = 0.85, i = {}) {
  const {
    adaptive: a = !0
  } = i, r = t.getContext("2d", {
    willReadFrequently: !0,
    colorSpace: "srgb"
  });
  if (!r)
    throw new Error("Failed to get canvas context");
  const n = t.width, s = t.height, l = r.getImageData(0, 0, n, s).data;
  let f = e;
  a && (f = Ge(l, n, s, e));
  const m = Ne(f, l), c = Math.max(0.5, Math.min(0.95, m));
  try {
    const h = await H(t, "image/webp", c);
    return new Blob([h], { type: D });
  } catch {
    const h = Math.max(0.6, c), y = await H(t, "image/jpeg", h);
    return new Blob([y], { type: D });
  }
}
const ot = G;
function Ge(t, e, i, a) {
  let r = 0, n = 0;
  const s = 8, o = Math.floor(e / s), l = Math.floor(i / s);
  for (let h = 0; h < l; h++)
    for (let y = 0; y < o; y++) {
      const b = Ye(
        t,
        e,
        i,
        y * s,
        h * s,
        s
      );
      b > 500 ? r++ : b < 100 && n++;
    }
  const f = o * l, m = r / f, c = n / f;
  return m > 0.3 ? Math.max(0.6, a - 0.1) : c > 0.5 ? Math.max(0.5, a - 0.15) : a;
}
function Ye(t, e, i, a, r, n) {
  let s = 0, o = 0, l = 0;
  for (let m = r; m < Math.min(r + n, i); m++)
    for (let c = a; c < Math.min(a + n, e); c++) {
      const h = (m * e + c) * 4, y = t[h], b = t[h + 1], x = t[h + 2], d = 0.299 * y + 0.587 * b + 0.114 * x;
      s += d, o += d * d, l++;
    }
  if (l === 0) return 0;
  const f = s / l;
  return o / l - f * f;
}
function Ne(t, e, i, a) {
  let r = 0, n = 0;
  for (let o = 0; o < e.length; o += 4) {
    const l = e[o], f = e[o + 1], m = e[o + 2], c = Math.max(l, f, m), h = Math.min(l, f, m);
    (c === 0 ? 0 : (c - h) / c) > 0.5 && r++, n++;
  }
  const s = r / n;
  return s < 0.2 ? Math.max(0.5, t - 0.08) : (s > 0.6, t);
}
function Qe(t, e, i, a) {
  const n = 1 - e, s = Math.min(1, i * a / (1920 * 1080)), o = 0.7 - n * 0.2 + s * 0.1;
  return Math.max(0.4, Math.min(0.8, o));
}
const st = Qe;
class Y {
  constructor() {
    this.aborted = !1, this.isCompressing = !1, this.plugins = new Ce();
  }
  async compress(e, i = {}) {
    if (this.aborted)
      throw new Error("Compression was aborted");
    if (this.isCompressing)
      throw new Error("Compression already in progress");
    const r = (e.type || "").toLowerCase().replace(/^image\/jpg$/, "image/jpeg");
    if (!te(r))
      throw new Error("File must be an image");
    let n = i;
    if (i.preset && (n = Pe(i, i.preset)), n.validateImage) {
      const s = await re(e);
      if (!s.isValid)
        throw new Error(`Image validation failed: ${s.errors.join(", ")}`);
      s.warnings.length > 0 && console.warn("Image validation warnings:", s.warnings);
    }
    this.isCompressing = !0;
    try {
      let s = e;
      try {
        s = await this.plugins.runBeforeCompress(e, n);
      } catch (f) {
        console.warn("Plugin beforeCompress error:", f);
      }
      const o = await this.performCompression(s, n);
      let l = o;
      try {
        l = await this.plugins.runAfterCompress(o, n);
      } catch (f) {
        console.warn("Plugin afterCompress error:", f);
      }
      return l;
    } finally {
      this.isCompressing = !1;
    }
  }
  async performCompression(e, i) {
    var l, f, m, c, h, y, b, x;
    if (this.aborted)
      throw new Error("Compression was aborted");
    const a = e.size;
    i.monitorPerformance && new Oe(a);
    let r = null, n = 1, s = (e.type || "image/jpeg").toLowerCase();
    if (s === "image/jpg" && (s = "image/jpeg"), i.fixOrientation || i.stripMetadata)
      try {
        if (r = await e.arrayBuffer(), !r || r.byteLength === 0)
          throw new Error("Invalid image data");
        if (i.fixOrientation)
          try {
            n = de(r), (!n || n < 1 || n > 8) && (n = 1);
          } catch (d) {
            console.warn("Failed to read EXIF orientation, using default:", d), n = 1;
          }
        if (i.stripMetadata)
          try {
            r = pe(r);
          } catch (d) {
            console.warn("Failed to strip EXIF, continuing with original:", d);
          }
      } catch (d) {
        console.warn("Failed to process image buffer, continuing without EXIF processing:", d), r = null, n = 1;
      }
    let o;
    if (r) {
      const d = new Blob([r], { type: s });
      o = URL.createObjectURL(d);
    } else
      o = URL.createObjectURL(e);
    try {
      const d = await me(o), u = d.naturalWidth, p = d.naturalHeight;
      if (!u || !p || u <= 0 || p <= 0)
        throw new Error("Invalid image dimensions");
      const g = fe({
        naturalWidth: u,
        naturalHeight: p,
        maxWidth: i.maxWidth,
        // undefined if not set
        maxHeight: i.maxHeight,
        // undefined if not set
        minWidth: i.minWidth,
        // undefined if not set
        minHeight: i.minHeight,
        // undefined if not set
        width: i.width,
        // undefined if not set
        height: i.height,
        // undefined if not set
        mode: i.resize || "none"
        // 'none' by default - no resizing
      });
      let w = s;
      if (i.format && i.format !== "auto")
        w = i.format.toLowerCase(), w === "image/jpg" && (w = "image/jpeg");
      else if (i.format === "auto")
        if (Z() && (s === "image/jpeg" || s === "image/png"))
          w = D;
        else if (s === "image/jpeg" || s === "image/png")
          try {
            if (typeof document < "u") {
              const v = document.createElement("canvas");
              v.width = 1, v.height = 1;
              const j = v.toDataURL("image/webp");
              j && j.indexOf("image/webp") === 5 ? w = "image/webp" : w = s;
            } else
              w = s;
          } catch {
            w = s;
          }
        else
          w = s;
      w === "image/png" && s !== "image/png" && !((l = i.optimizePNG) != null && l.enabled) && Z() && (w = D), w = Xe(w), (!w || !te(w) && w !== D) && (w = "image/jpeg"), w === "image/jpg" && (w = "image/jpeg");
      let M = i.quality ?? 0.8;
      if (i.enableSmartQuality === !0 || w === D && i.enableSmartQuality !== !1)
        try {
          const v = K(u, p), j = v.getContext("2d");
          if (j) {
            j.drawImage(d, 0, 0);
            const X = await je(v);
            i.quality == null ? M = Ue(
              { ...i, enableSmartQuality: !0 },
              X
            ) : M = Math.min(
              i.quality,
              (i.quality + X.recommendedQuality) / 2
            );
          }
        } catch (v) {
          console.warn("Smart quality analysis failed, using default:", v);
        }
      else if (i.mode === "adaptive" && !i.quality) {
        const v = e.size / 1048576;
        v > 10 ? M = 0.7 : v > 5 ? M = 0.75 : v < 1 ? M = 0.85 : M = 0.8;
      }
      M = Math.max(0.1, Math.min(0.99, M)), i.onProgress && i.onProgress(0.3);
      let E = null;
      if ((f = i.smartCrop) != null && f.enabled) {
        const v = K(u, p), j = v.getContext("2d");
        j && (j.drawImage(d, 0, 0), E = Le(v, {
          width: i.smartCrop.width,
          height: i.smartCrop.height,
          focus: i.smartCrop.focus
        }), g.width = E.width, g.height = E.height);
      }
      if (g.width <= 0 || g.height <= 0 || !isFinite(g.width) || !isFinite(g.height))
        throw new Error("Invalid canvas dimensions");
      const S = 16384;
      if (g.width > S || g.height > S)
        throw new Error(`Canvas dimensions too large (max ${S}px)`);
      const C = K(g.width, g.height), I = C.getContext("2d", { willReadFrequently: !0 });
      if (!I)
        throw new Error("Failed to get canvas context");
      if (I.fillStyle = w === "image/jpeg" ? "#ffffff" : "transparent", I.fillRect(0, 0, g.width, g.height), i.beforeProcess && i.beforeProcess(I, C), this.aborted)
        throw new Error("Compression was aborted");
      const F = ue(n), R = i.resize || "none";
      let z;
      if ((R === "cover" || R === "contain") && (z = ge(
        u,
        p,
        g.width,
        g.height,
        R
      )), E ? ie(I, d, {
        srcX: E.x,
        srcY: E.y,
        srcWidth: E.width,
        srcHeight: E.height,
        destX: 0,
        destY: 0,
        destWidth: g.width,
        destHeight: g.height,
        rotate: F.rotate,
        scaleX: F.scaleX,
        scaleY: F.scaleY
      }) : ie(I, d, {
        srcX: z == null ? void 0 : z.x,
        srcY: z == null ? void 0 : z.y,
        srcWidth: z == null ? void 0 : z.width,
        srcHeight: z == null ? void 0 : z.height,
        destX: 0,
        destY: 0,
        destWidth: g.width,
        destHeight: g.height,
        rotate: F.rotate,
        scaleX: F.scaleX,
        scaleY: F.scaleY
      }), i.enableNoiseAware && Me(I, C), i.enableColorWeighting && be(I, C), i.enableHdrToSdr && xe(I, C), w === "image/png" && ((m = i.optimizePNG) != null && m.enabled))
        try {
          $e(C, {
            reduceColors: i.optimizePNG.reduceColors,
            maxColors: i.optimizePNG.maxColors,
            optimizeTransparency: i.optimizePNG.optimizeTransparency
          });
        } catch (v) {
          console.warn("PNG optimization failed:", v);
        }
      if (i.filters && i.filters.length > 0)
        for (const v of i.filters)
          try {
            Ee(I, C, v);
          } catch (j) {
            console.warn("Filter application failed:", j);
          }
      if (i.watermark)
        try {
          qe(I, C, i.watermark);
        } catch (v) {
          console.warn("Watermark application failed:", v);
        }
      if (i.convertToJPEG && w !== "image/jpeg")
        try {
          const v = await ae(C);
          Be(w, v, a) && (I.fillStyle = "#ffffff", I.globalCompositeOperation = "destination-over", I.fillRect(0, 0, C.width, C.height), I.globalCompositeOperation = "source-over", w = "image/jpeg");
        } catch (v) {
          console.warn("Format conversion failed:", v);
        }
      i.afterProcess && i.afterProcess(I, C);
      try {
        await this.plugins.runTransform(C, i);
      } catch (v) {
        console.warn("Plugin transform error:", v);
      }
      if (this.aborted)
        throw new Error("Compression was aborted");
      i.onProgress && i.onProgress(0.8);
      let k;
      const U = ye(i) && i.mode === "size" && i.targetSize, T = w;
      U && i.targetSize ? T === D ? k = await G(C, M, { adaptive: !0 }) : k = await this.dualPassCompression(C, T, M, a, i.targetSize) : T === D ? k = await G(C, M, {
        progressive: i.enableProgressive !== !1,
        adaptive: !0,
        chromaSubsampling: "4:2:0"
      }) : k = await H(C, T, M), i.onProgress && i.onProgress(1);
      const L = e instanceof File ? e.name : "image", q = he(w), N = w === "image/jpg" ? "image/jpeg" : w, ee = new File([k], L.replace(/\.[^.]+$/, q), {
        type: N,
        lastModified: Date.now()
      }), ne = ee.size, oe = i.strict !== !1;
      let Q = ee, $ = ne, W = N, V = M;
      const _ = 0.15, se = i.width !== void 0 && i.width !== u || i.height !== void 0 && i.height !== p || i.maxWidth !== void 0 && g.width < u || i.maxHeight !== void 0 && g.height < p || i.minWidth !== void 0 && g.width > u || i.minHeight !== void 0 && g.height > p || i.resize && i.resize !== "none", J = () => 1 - $ / a;
      if ($ >= a || J() < _) {
        const v = [0.72, 0.62, 0.52, 0.42, 0.32, 0.25], j = (W === "image/png" || $ >= a ? [D, "image/webp", "image/jpeg", W] : se ? [W, "image/webp", "image/jpeg", D] : [D, "image/webp", "image/jpeg", W]).filter((B, O, A) => A.indexOf(B) === O);
        for (const B of j) {
          for (const O of v)
            try {
              const A = B === D ? await G(C, O, { adaptive: !0 }) : await H(C, B, O);
              if (A.size < $) {
                const ce = B === D ? ".pixu" : B === "image/jpeg" ? ".jpg" : B === "image/webp" ? ".webp" : B === "image/png" ? ".png" : ".jpg";
                Q = new File(
                  [A],
                  L.replace(/\.[^.]+$/, ce),
                  { type: B, lastModified: Date.now() }
                ), $ = A.size, W = B, V = O;
              }
              if (J() >= _)
                break;
            } catch {
            }
          if (J() >= _)
            break;
        }
        const X = !!((h = (c = i.watermark) == null ? void 0 : c.text) != null && h.trim()) || !!((y = i.watermark) != null && y.image) || !!(i.filters && i.filters.length > 0) || !!((b = i.smartCrop) != null && b.enabled) || !!((x = i.optimizePNG) != null && x.enabled);
        $ >= a && oe && !X && (Q = e instanceof File ? e : new File([e], L, { type: s }), $ = a, W = s, V = 1);
      }
      const le = Math.max(0, 1 - $ / a);
      return {
        file: Q,
        originalSize: a,
        compressedSize: $,
        compressionRatio: le,
        format: W,
        width: g.width,
        height: g.height,
        metadata: {
          hasExif: !i.stripMetadata && n > 1,
          orientation: n > 1 ? n : void 0,
          quality: V
        }
      };
    } finally {
      URL.revokeObjectURL(o);
    }
  }
  async dualPassCompression(e, i, a, r, n) {
    let s = Math.max(0.1, Math.min(0.99, a)), o = await H(e, i, s), l = 0;
    const f = 10;
    for (; o.size > n && l < f; ) {
      const m = o.size / n;
      if (m > 2 ? s *= 0.7 : m > 1.5 ? s *= 0.8 : s *= 0.9, s = Math.max(0.1, Math.min(0.99, s)), o = await H(e, i, s), l++, s <= 0.1)
        break;
    }
    return o;
  }
  abort() {
    this.aborted = !0;
  }
  registerPlugin(e) {
    this.plugins.register(e);
  }
  unregisterPlugin(e) {
    this.plugins.unregister(e);
  }
}
async function lt(t, e = {}) {
  const i = e.concurrency || 3, a = [], r = [], n = new Y();
  async function s(l, f) {
    try {
      const m = await n.compress(l, e);
      a[f] = m, e.onItemComplete && e.onItemComplete(m, f);
    } catch (m) {
      const c = m instanceof Error ? m : new Error("Unknown error");
      r[f] = c, e.onItemError && e.onItemError(c, f);
    }
  }
  const o = [];
  for (let l = 0; l < t.length; l += i)
    o.push(t.slice(l, l + i));
  for (const l of o)
    await Promise.all(
      l.map((f, m) => {
        const c = o.indexOf(l) * i + m;
        return s(f, c);
      })
    );
  if (r.length > 0 && !e.onItemError)
    throw new Error(`Batch compression failed for ${r.length} file(s)`);
  return a;
}
async function* ct(t, e = {}) {
  const i = new Y();
  for await (const a of t) {
    const r = await i.compress(a, e);
    if (yield r, e.onChunk) {
      const n = r.file instanceof File ? new Blob([r.file]) : r.file;
      e.onChunk(n, 0);
    }
  }
}
async function Ve(t, e) {
  const i = t.getContext("2d");
  if (!i)
    throw new Error("Failed to get canvas context");
  const r = i.getImageData(0, 0, t.width, t.height).data, n = t.width, s = t.height, o = n * s, l = /* @__PURE__ */ new Map();
  let f = 0, m = 0;
  const c = 10;
  for (let C = 0; C < r.length; C += 4 * c) {
    const I = r[C], F = r[C + 1], R = r[C + 2];
    r[C + 3] < 255 && f++;
    const k = `${Math.floor(I / 8)}-${Math.floor(F / 8)}-${Math.floor(R / 8)}`;
    l.set(k, (l.get(k) || 0) + 1);
    const U = C / 4 % n, T = Math.floor(C / 4 / n);
    if (U > 0 && T > 0 && U < n - 1 && T < s - 1) {
      const L = (T * n + U) * 4, q = (T * n + (U + 1)) * 4;
      Math.abs(
        (r[L] + r[L + 1] + r[L + 2]) / 3 - (r[q] + r[q + 1] + r[q + 2]) / 3
      ) > 30 && m++;
    }
  }
  const h = o / c, y = l.size, b = y / h, x = m / h, d = f > h * 0.01;
  let u;
  b > 0.3 && x > 0.1 ? u = "photo" : b < 0.2 && x < 0.05 ? u = "graphic" : x > 0.15 && b < 0.4 ? u = "text" : u = "mixed";
  let p;
  b < 0.1 && x < 0.05 ? p = "low" : b > 0.5 || x > 0.2 ? p = "high" : p = "medium";
  let g = 0.5;
  e && (g = 1 - n * s * 4 / e);
  let w;
  g > 0.8 ? w = "very-high" : g > 0.5 ? w = "high" : g > 0.2 ? w = "medium" : w = "low";
  let M;
  d ? M = "image/png" : u === "photo" && p === "high" ? M = "image/webp" : u === "photo" ? M = "image/jpeg" : M = "image/png";
  let P;
  u === "graphic" || u === "text" ? P = 0.9 : u === "photo" && p === "high" ? P = 0.75 : P = 0.8;
  const E = Math.min(0.9, g + 0.3), S = [];
  return d && M === "image/jpeg" && S.push("Consider converting to PNG to preserve transparency"), y < 256 && u === "graphic" && S.push("Image can benefit from color reduction"), g < 0.3 && S.push("High compression potential - consider lower quality"), (n > 1920 || s > 1080) && S.push("Consider resizing for web use"), {
    quality: w,
    compressionLevel: g,
    contentType: u,
    hasText: u === "text",
    complexity: p,
    colorCount: y,
    hasTransparency: d,
    recommendedFormat: M,
    recommendedQuality: P,
    estimatedSizeReduction: E,
    suggestions: S
  };
}
async function ht(t, e, i) {
  const a = [], r = await Ve(e, t.size);
  t.type === "image/png" && !await ae(e) && t.size > 5e5 && a.push({
    type: "format",
    message: "PNG without transparency can be converted to JPEG",
    suggestion: 'Use convertToJPEG: true or format: "image/jpeg"',
    potentialSavings: 0.5,
    priority: "high"
  }), !i.quality && r.contentType === "photo" && a.push({
    type: "quality",
    message: `Recommended quality for ${r.contentType}: ${r.recommendedQuality}`,
    suggestion: `Set quality: ${r.recommendedQuality}`,
    potentialSavings: r.estimatedSizeReduction,
    priority: "medium"
  }), (e.width > 1920 || e.height > 1080) && a.push({
    type: "size",
    message: "Image is larger than typical web size",
    suggestion: "Consider maxWidth: 1920, maxHeight: 1080",
    potentialSavings: 0.6,
    priority: "high"
  }), !i.stripMetadata && t.size > 1e6 && a.push({
    type: "metadata",
    message: "Large file may contain metadata",
    suggestion: "Use stripMetadata: true to reduce size",
    potentialSavings: 0.05,
    priority: "low"
  }), r.recommendedFormat !== t.type && a.push({
    type: "format",
    message: `Recommended format: ${r.recommendedFormat}`,
    suggestion: `Use format: "${r.recommendedFormat}"`,
    potentialSavings: 0.3,
    priority: "medium"
  });
  for (const n of r.suggestions)
    a.push({
      type: "format",
      message: n,
      suggestion: "Review image analysis results",
      priority: "low"
    });
  return a.sort((n, s) => {
    const o = { high: 3, medium: 2, low: 1 };
    return o[s.priority] - o[n.priority];
  });
}
function mt(t, e) {
  let i = 0;
  return e.quality && e.quality < 0.9 && (i += (0.9 - e.quality) * 0.5), (e.maxWidth || e.maxHeight) && (i += 0.3), e.stripMetadata && (i += 0.05), (e.format === "image/webp" || e.format === "image/avif") && (i += 0.2), Math.min(0.9, i);
}
async function ft(t, e) {
  const i = e.widths || [320, 640, 960, 1280, 1920], a = e.formats || ["image/webp", "image/jpeg"];
  e.quality;
  const r = [], n = [];
  for (const s of a) {
    const o = [];
    for (const l of i)
      o.push(`image-${l}w.${s.split("/")[1]} ${l}w`);
    n.push({
      format: s,
      srcset: o.join(", "),
      sizes: "(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 960px) 960px, 1280px"
    });
  }
  return {
    srcset: r.join(", "),
    sizes: "(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 960px) 960px, 1280px",
    src: "",
    // Default/fallback src
    formats: n
  };
}
function gt(t) {
  return t.map((e) => `${e.url} ${e.width}w`).join(", ");
}
function ut(t) {
  const e = [];
  for (let i = 0; i < t.length - 1; i++)
    e.push(`(max-width: ${t[i]}px) ${t[i]}px`);
  return e.push(`${t[t.length - 1]}px`), e.join(", ");
}
function dt(t) {
  return t.getContext("2d", { colorSpace: "srgb" }), {
    isSRGB: !0,
    // Canvas default
    hasColorProfile: !1,
    gamma: 2.2,
    // Standard sRGB gamma
    needsConversion: !1
    // Already in sRGB
  };
}
function pt(t, e) {
  const i = t.getImageData(0, 0, e.width, e.height), a = i.data;
  for (let r = 0; r < a.length; r += 4)
    ;
  t.putImageData(i, 0, 0);
}
function wt() {
  if (typeof document > "u")
    return !1;
  const t = document.createElement("canvas");
  try {
    return t.getContext("2d", { colorSpace: "display-p3" }) !== null;
  } catch {
    return !1;
  }
}
function yt(t) {
  const e = new DataView(t);
  if (e.getUint8(0) !== 255 || e.getUint8(1) !== 216)
    return !1;
  let i = 2;
  const a = e.byteLength;
  let r = !1;
  for (; i + 1 < a && i < 65536; ) {
    if (e.getUint8(i) === 255) {
      const n = e.getUint8(i + 1);
      if (n >= 192 && n <= 195 && i + 5 < a && (e.getUint8(i + 5), r = !0), n === 218)
        break;
    }
    i++;
  }
  return r;
}
function Mt() {
  return typeof document < "u" && typeof HTMLCanvasElement < "u";
}
class bt {
  constructor() {
    this.paused = !1, this.cancelled = !1, this.startTime = 0, this.completedCount = 0, this.errorCount = 0, this.compressor = new Y();
  }
  async processBatch(e, i = {}) {
    this.startTime = Date.now(), this.completedCount = 0, this.errorCount = 0, this.paused = !1, this.cancelled = !1;
    const {
      concurrency: a = 3,
      retryAttempts: r = 2,
      retryDelay: n = 1e3,
      priority: s = "fifo",
      onProgress: o,
      onItemComplete: l,
      onItemError: f
    } = i, m = this.sortByPriority(e, s), c = new Array(e.length), h = [], y = /* @__PURE__ */ new Map();
    m.forEach((d, u) => {
      y.set(d, e.indexOf(d));
    });
    const b = async (d, u) => {
      if (this.cancelled)
        return;
      for (; this.paused && !this.cancelled; )
        await new Promise((g) => setTimeout(g, 100));
      if (this.cancelled)
        return;
      let p = null;
      for (let g = 0; g <= r; g++)
        try {
          const {
            retryAttempts: w,
            retryDelay: M,
            priority: P,
            onProgress: E,
            pause: S,
            resume: C,
            onItemComplete: I,
            onItemError: F,
            concurrency: R,
            ...z
          } = i, k = await this.compressor.compress(d, z);
          c[u] = k, this.completedCount++, l && l(k, u), o && o(
            this.completedCount,
            e.length,
            this.errorCount
          );
          return;
        } catch (w) {
          p = w instanceof Error ? w : new Error("Unknown error"), g < r && await new Promise((M) => setTimeout(M, n));
        }
      this.errorCount++, h[u] = p, f && f(p, u), o && o(
        this.completedCount,
        e.length,
        this.errorCount
      );
    }, x = [];
    for (let d = 0; d < m.length; d += a)
      x.push(m.slice(d, d + a));
    for (const d of x) {
      if (this.cancelled)
        break;
      await Promise.all(
        d.map((u) => {
          const p = y.get(u);
          return b(u, p);
        })
      );
    }
    if (h.length > 0 && !f)
      throw new Error(`Batch compression failed for ${h.length} file(s)`);
    return c;
  }
  pause() {
    this.paused = !0;
  }
  resume() {
    this.paused = !1;
  }
  cancel() {
    this.cancelled = !0, this.compressor.abort();
  }
  getProgress() {
    const e = Date.now() - this.startTime, i = this.completedCount / (e / 1e3), a = this.completedCount > 0 ? Math.ceil((this.completedCount - this.completedCount) / i * 1e3) : void 0;
    return {
      completed: this.completedCount,
      total: 0,
      // Would need to be passed
      errors: this.errorCount,
      inProgress: 0,
      // Would need to track
      queued: 0,
      // Would need to track
      estimatedTimeRemaining: a
    };
  }
  sortByPriority(e, i) {
    const a = [...e];
    switch (i) {
      case "lifo":
        return a.reverse();
      case "size-asc":
        return a.sort((r, n) => r.size - n.size);
      case "size-desc":
        return a.sort((r, n) => n.size - r.size);
      case "fifo":
      default:
        return a;
    }
  }
}
function _e() {
  if ("memory" in performance) {
    const t = performance.memory;
    return {
      used: t.usedJSHeapSize,
      available: t.totalJSHeapSize - t.usedJSHeapSize,
      limit: t.jsHeapSizeLimit
    };
  }
  return {
    used: 0,
    available: 100 * 1024 * 1024,
    // Assume 100MB available
    limit: 500 * 1024 * 1024
    // Assume 500MB limit
  };
}
function xt(t) {
  return t > 10 * 1024 * 1024;
}
function Ct(t, e) {
  const i = e || _e().available, a = Math.min(i * 0.1, 5 * 1024 * 1024);
  return Math.max(a, 1024 * 1024);
}
const Je = new Y();
async function vt(t, e) {
  return Je.compress(t, e);
}
export {
  bt as AdvancedBatchProcessor,
  Ae as PIXU_EXTENSION,
  D as PIXU_MIME_TYPE,
  at as PIX_EXTENSION,
  rt as PIX_MIME_TYPE,
  Oe as PerformanceMonitor,
  Y as PixuCompressor,
  Ce as PluginManager,
  dt as analyzeColorSpace,
  Ve as analyzeImage,
  je as analyzeImageContent,
  Ee as applyFilter,
  Pe as applyPreset,
  qe as applyWatermark,
  Ct as calculateChunkSize,
  Le as calculateSmartCrop,
  ot as canvasToPix,
  G as canvasToPixu,
  vt as compress,
  lt as compressBatch,
  ct as compressStream,
  et as convertFormat,
  Je as default,
  ae as detectTransparency,
  mt as estimateCompressionSavings,
  st as estimatePixCompression,
  Qe as estimatePixuCompression,
  tt as formatBytes,
  it as formatDuration,
  ft as generateResponsiveImages,
  ut as generateSizes,
  gt as generateSrcset,
  _e as getMemoryInfo,
  ht as getOptimizationHints,
  Ie as getPresetOptions,
  Ue as getSmartQuality,
  nt as isPixSupported,
  Z as isPixuSupported,
  yt as isProgressiveJPEG,
  Ze as isValidImage,
  Xe as normalizePixuFormat,
  pt as normalizeToSRGB,
  $e as optimizePNG,
  Be as shouldConvertToJPEG,
  xt as shouldUseStreaming,
  Mt as supportsProgressiveJPEG,
  wt as supportsWideGamut,
  re as validateImage
};
//# sourceMappingURL=pixu.esm.js.map
