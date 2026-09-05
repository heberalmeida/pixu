function Q(i) {
  if (!i || typeof i != "string")
    return !1;
  const e = i.toLowerCase().replace(/^image\/jpg$/, "image/jpeg");
  return e === "image/pixu" || e === "image/pix" ? !0 : /^image\/(jpeg|png|webp|avif|gif|bmp|svg\+xml)$/i.test(e);
}
function J(i) {
  const e = i.toLowerCase().replace(/^image\/jpg$/, "image/jpeg");
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
function K(i) {
  return new Promise((e, t) => {
    if (typeof document > "u") {
      t(new Error("Not in browser environment"));
      return;
    }
    const a = new Image();
    a.crossOrigin = "anonymous";
    let r = !1;
    const n = () => {
      a.onload = null, a.onerror = null;
    }, l = setTimeout(() => {
      r || (r = !0, n(), t(new Error("Image loading timeout")));
    }, 3e4);
    a.onload = () => {
      clearTimeout(l), r || (r = !0, n(), e(a));
    }, a.onerror = () => {
      clearTimeout(l), r || (r = !0, n(), t(new Error("Failed to load image")));
    }, a.src = i;
  });
}
function Z(i) {
  const {
    naturalWidth: e,
    naturalHeight: t,
    maxWidth: a,
    maxHeight: r,
    minWidth: n = 0,
    minHeight: l = 0,
    width: o,
    height: c,
    mode: m
  } = i, s = e / t;
  let h = e, f = t;
  if (m === "none")
    o !== void 0 && (h = o), c !== void 0 && (f = c), o !== void 0 && c === void 0 ? f = h / s : c !== void 0 && o === void 0 && (h = f * s);
  else if (m === "contain")
    if (o && c) {
      const g = o / c;
      s > g ? (h = o, a !== void 0 && (h = Math.min(h, a)), f = h / s) : (f = c, r !== void 0 && (f = Math.min(f, r)), h = f * s);
    } else o ? (h = o, a !== void 0 && (h = Math.min(h, a)), f = h / s) : c ? (f = c, r !== void 0 && (f = Math.min(f, r)), h = f * s) : (a !== void 0 || r !== void 0) && (a !== void 0 && r !== void 0 ? e / t > a / r ? (h = a, f = h / s) : (f = r, h = f * s) : a !== void 0 ? e > a && (h = a, f = h / s) : r !== void 0 && t > r && (f = r, h = f * s));
  else if (m === "cover")
    if (o && c) {
      const g = o / c;
      s > g ? (f = c, r !== void 0 && (f = Math.min(f, r)), h = f * s) : (h = o, a !== void 0 && (h = Math.min(h, a)), f = h / s);
    } else o ? (h = o, a !== void 0 && (h = Math.min(h, a)), f = h / s) : c ? (f = c, r !== void 0 && (f = Math.min(f, r)), h = f * s) : (a !== void 0 || r !== void 0) && (a !== void 0 && r !== void 0 ? e / t > a / r ? (h = a, f = h / s) : (f = r, h = f * s) : a !== void 0 ? e > a && (h = a, f = h / s) : r !== void 0 && t > r && (f = r, h = f * s));
  else if (m === "fit")
    if (o && c) {
      const g = o / c;
      s > g ? (h = o, a !== void 0 && (h = Math.min(h, a)), f = h / s) : (f = c, r !== void 0 && (f = Math.min(f, r)), h = f * s);
    } else o ? (h = o, a !== void 0 && (h = Math.min(h, a)), f = h / s) : c ? (f = c, r !== void 0 && (f = Math.min(f, r)), h = f * s) : (a !== void 0 || r !== void 0) && (a !== void 0 && r !== void 0 ? e / t > a / r ? (h = a, f = h / s) : (f = r, h = f * s) : a !== void 0 ? e > a && (h = a, f = h / s) : r !== void 0 && t > r && (f = r, h = f * s));
  else m === "fill" && (h = o ?? e, f = c ?? t);
  return n !== void 0 && n > 0 && (h = Math.max(h, n)), l !== void 0 && l > 0 && (f = Math.max(f, l)), a !== void 0 && (h = Math.min(h, a)), r !== void 0 && (f = Math.min(f, r)), {
    width: Math.round(h),
    height: Math.round(f)
  };
}
function ee(i, e, t, a, r) {
  const n = i / e, l = t / a;
  let o = i, c = e, m = 0, s = 0;
  return r === "cover" ? n > l ? (c = e, o = c * l, m = (i - o) / 2) : (o = i, c = o / l, s = (e - c) / 2) : (r === "contain" || r === "fit") && (n > l ? (o = i, c = o / l, s = (e - c) / 2) : (c = e, o = c * l, m = (i - o) / 2)), {
    x: Math.round(m),
    y: Math.round(s),
    width: Math.round(o),
    height: Math.round(c)
  };
}
function te(i) {
  let e = 0, t = 1, a = 1;
  switch (i) {
    case 2:
      t = -1;
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
      e = 90, t = -1;
      break;
    case 8:
      e = -90;
      break;
  }
  return { rotate: e, scaleX: t, scaleY: a };
}
function ie(i) {
  if (!i || i.byteLength < 2)
    return 1;
  const e = new DataView(i);
  let t = 1;
  try {
    if (e.byteLength < 2)
      return 1;
    if (e.getUint8(0) === 255 && e.getUint8(1) === 216) {
      let a = 2;
      const r = e.byteLength, n = Math.min(r, 65536);
      let l = 0;
      const o = 1e3;
      for (; a + 1 < n && l < o && (l++, !(a >= r - 1)); ) {
        if (e.getUint8(a) === 255 && e.getUint8(a + 1) === 225) {
          const c = a + 4;
          if (c + 4 >= r)
            break;
          if (ae(e, c, 4) === "Exif") {
            const m = a + 10;
            if (m + 8 >= r)
              break;
            const s = e.getUint16(m), h = s === 18761;
            if ((h || s === 19789) && e.getUint16(m + 2, h) === 42) {
              const f = e.getUint32(m + 4, h);
              if (f >= 8 && f < 1048576 && // Max 1MB offset
              m + f + 12 < r) {
                const g = m + f, u = e.getUint16(g, h), p = Math.min(u, 100);
                for (let M = 0; M < p; M++) {
                  const d = g + M * 12 + 2;
                  if (d + 10 >= r)
                    break;
                  if (e.getUint16(d, h) === 274) {
                    t = e.getUint16(d + 8, h), (t < 1 || t > 8) && (t = 1);
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
    t = 1;
  }
  return t;
}
function re(i) {
  if (!i || i.byteLength < 2 || i.byteLength > 10 * 1024 * 1024)
    return i;
  const e = new DataView(i), t = new Uint8Array(i), a = new Array(i.byteLength);
  let r = 0, n = 0, l = 0;
  const o = 1e4;
  if (e.getUint8(0) !== 255 || e.getUint8(1) !== 216)
    return i;
  for (a[r++] = 255, a[r++] = 216, n = 2; n < t.length && l < o && (l++, !(n >= t.length - 1)); ) {
    if (t[n] === 255) {
      const c = t[n + 1];
      if (c === void 0)
        break;
      if (c === 224 || c === 225) {
        if (n + 3 >= t.length)
          break;
        const m = t[n + 2] << 8 | t[n + 3];
        if (m < 2 || m > 65535)
          break;
        if (c === 225) {
          if (n += m + 2, n > t.length)
            break;
          continue;
        }
      }
      if (c === 218) {
        const m = t.length - n;
        for (let s = 0; s < m; s++)
          a[r++] = t[n + s];
        break;
      }
    }
    if (t[n] === 255 && n + 3 < t.length) {
      const c = t[n + 2] << 8 | t[n + 3];
      if (c < 2 || c > 65535 || n + c + 2 > t.length)
        break;
      const m = n + c + 2;
      for (let s = n; s < m; s++)
        a[r++] = t[s];
      n += c + 2;
    } else
      a[r++] = t[n], n++;
  }
  return new Uint8Array(a.slice(0, r)).buffer;
}
function ae(i, e, t) {
  let a = "";
  for (let r = 0; r < t; r++)
    a += String.fromCharCode(i.getUint8(e + r));
  return a;
}
function ne(i) {
  return i.enableDualPass === !1 ? !1 : i.enableDualPass === !0 ? !0 : (i.targetSize ? i.targetSize : 0) / (1024 * 1024) > 2 || i.mode === "size";
}
function oe(i, e) {
  const t = i.getImageData(0, 0, e.width, e.height), a = t.data;
  for (let r = 0; r < a.length; r += 4) {
    const n = a[r], l = a[r + 1], o = a[r + 2], c = n * 0.299 + l * 0.587 + o * 0.114, m = 10;
    Math.abs(n - c) < m && (a[r] = c), Math.abs(l - c) < m && (a[r + 1] = c), Math.abs(o - c) < m && (a[r + 2] = c);
  }
  i.putImageData(t, 0, 0);
}
function se(i, e) {
  const t = i.getImageData(0, 0, e.width, e.height), a = t.data;
  for (let r = 0; r < a.length; r += 4) {
    const n = a[r], l = a[r + 1], o = a[r + 2], m = n * 0.2126 + l * 0.7152 + o * 0.0722 > 128 ? 1.05 : 0.95;
    a[r] = Math.min(255, n * m), a[r + 1] = Math.min(255, l * m), a[r + 2] = Math.min(255, o * m);
  }
  i.putImageData(t, 0, 0);
}
function le(i, e) {
  const t = i.getImageData(0, 0, e.width, e.height), a = t.data, r = 0.8;
  for (let n = 0; n < a.length; n += 4)
    a[n] = Math.min(255, a[n] * r), a[n + 1] = Math.min(255, a[n + 1] * r), a[n + 2] = Math.min(255, a[n + 2] * r);
  i.putImageData(t, 0, 0);
}
function W(i, e, t) {
  return new Promise((a, r) => {
    const n = e === "image/jpeg" || e === "image/jpg" || e === "image/webp";
    let l;
    if (n && t !== void 0 && t !== null && (l = Math.max(0, Math.min(1, t)), l >= 0.99 && (l = 0.99)), i.toBlob)
      i.toBlob(
        (o) => {
          o ? a(o) : r(new Error("Failed to convert canvas to blob"));
        },
        e,
        l
      );
    else {
      const o = i.toDataURL(e, l), c = atob(o.split(",")[1]), m = o.split(",")[0].split(":")[1].split(";")[0], s = new ArrayBuffer(c.length), h = new Uint8Array(s);
      for (let f = 0; f < c.length; f++)
        h[f] = c.charCodeAt(f);
      a(new Blob([s], { type: m }));
    }
  });
}
function O(i, e) {
  const t = document.createElement("canvas");
  return t.width = i, t.height = e, t;
}
function Y(i, e, t) {
  const {
    srcX: a = 0,
    srcY: r = 0,
    srcWidth: n = e.width,
    srcHeight: l = e.height,
    destX: o = 0,
    destY: c = 0,
    destWidth: m = e.width,
    destHeight: s = e.height,
    rotate: h = 0,
    scaleX: f = 1,
    scaleY: g = 1
  } = t || {};
  if (i.save(), h !== 0 || f !== 1 || g !== 1) {
    const u = o + m / 2, p = c + s / 2;
    i.translate(u, p), i.rotate(h * Math.PI / 180), i.scale(f, g), i.drawImage(
      e,
      a,
      r,
      n,
      l,
      -m / 2,
      -s / 2,
      m,
      s
    );
  } else
    i.drawImage(
      e,
      a,
      r,
      n,
      l,
      o,
      c,
      m,
      s
    );
  i.restore();
}
class ce {
  constructor() {
    this.plugins = /* @__PURE__ */ new Map();
  }
  register(e) {
    this.plugins.has(e.name) && console.warn(`Plugin ${e.name} is already registered`), this.plugins.set(e.name, e);
  }
  unregister(e) {
    this.plugins.delete(e);
  }
  async runBeforeCompress(e, t) {
    let a = e;
    for (const r of this.plugins.values())
      r.beforeCompress && (a = await Promise.resolve(r.beforeCompress(a, t)));
    return a;
  }
  async runAfterCompress(e, t) {
    let a = e;
    for (const r of this.plugins.values())
      r.afterCompress && (a = await Promise.resolve(r.afterCompress(a, t)));
    return a;
  }
  async runTransform(e, t) {
    for (const a of this.plugins.values())
      a.transform && await Promise.resolve(a.transform(e, t));
  }
  getPlugin(e) {
    return this.plugins.get(e);
  }
  getAllPlugins() {
    return Array.from(this.plugins.values());
  }
}
const he = {
  "social-media": {
    maxWidth: 1080,
    quality: 0.85,
    format: "auto",
    stripMetadata: !0
  },
  print: {
    maxWidth: 3e3,
    quality: 0.95,
    format: "image/jpeg",
    stripMetadata: !1
  },
  web: {
    maxWidth: 1920,
    quality: 0.8,
    format: "auto",
    stripMetadata: !0
  },
  thumbnail: {
    maxWidth: 320,
    quality: 0.7,
    format: "auto",
    stripMetadata: !0
  },
  email: {
    maxWidth: 800,
    quality: 0.75,
    format: "image/jpeg",
    stripMetadata: !0
  }
};
function fe(i) {
  const e = he[i];
  if (!e)
    throw new Error(`Unknown preset: ${i}`);
  return {
    maxWidth: e.maxWidth,
    maxHeight: e.maxWidth,
    // Maintain aspect ratio
    quality: e.quality,
    format: e.format,
    stripMetadata: e.stripMetadata,
    resize: "contain"
    // Presets explicitly use resize mode
  };
}
function me(i, e) {
  const t = fe(e);
  return {
    ...t,
    ...i,
    // Preserve user's quality if specified
    quality: i.quality ?? t.quality
  };
}
function ge(i, e, t, a) {
  let r, n;
  typeof t == "string" ? (r = t, n = a ?? 1) : (r = t.type, n = t.value ?? 1);
  const l = i.getImageData(0, 0, e.width, e.height), o = l.data;
  switch (r) {
    case "grayscale":
      ue(o);
      break;
    case "sepia":
      de(o);
      break;
    case "vintage":
      pe(o);
      break;
    case "brightness":
      we(o, n);
      break;
    case "contrast":
      ye(o, n);
      break;
    case "saturation":
      Me(o, n);
      break;
    case "blur":
      i.filter = `blur(${n}px)`;
      const c = document.createElement("canvas");
      c.width = e.width, c.height = e.height;
      const m = c.getContext("2d");
      m && (m.drawImage(e, 0, 0), i.clearRect(0, 0, e.width, e.height), i.filter = "none", i.drawImage(c, 0, 0));
      return;
    case "sharpen":
      xe(i, e, n);
      return;
  }
  i.putImageData(l, 0, 0);
}
function ue(i) {
  for (let e = 0; e < i.length; e += 4) {
    const t = i[e] * 0.299 + i[e + 1] * 0.587 + i[e + 2] * 0.114;
    i[e] = t, i[e + 1] = t, i[e + 2] = t;
  }
}
function de(i) {
  for (let e = 0; e < i.length; e += 4) {
    const t = i[e], a = i[e + 1], r = i[e + 2];
    i[e] = Math.min(255, t * 0.393 + a * 0.769 + r * 0.189), i[e + 1] = Math.min(255, t * 0.349 + a * 0.686 + r * 0.168), i[e + 2] = Math.min(255, t * 0.272 + a * 0.534 + r * 0.131);
  }
}
function pe(i) {
  for (let e = 0; e < i.length; e += 4) {
    const t = i[e] * 0.3 + i[e + 1] * 0.59 + i[e + 2] * 0.11;
    i[e] = Math.min(255, i[e] * 0.7 + t * 0.3), i[e + 1] = Math.min(255, i[e + 1] * 0.7 + t * 0.3), i[e + 2] = Math.min(255, i[e + 2] * 0.7 + t * 0.3), i[e] = Math.min(255, i[e] * 1.1), i[e + 2] = Math.min(255, i[e + 2] * 0.9);
  }
}
function we(i, e) {
  const t = (e - 0.5) * 2;
  for (let a = 0; a < i.length; a += 4)
    i[a] = Math.max(0, Math.min(255, i[a] + t * 128)), i[a + 1] = Math.max(0, Math.min(255, i[a + 1] + t * 128)), i[a + 2] = Math.max(0, Math.min(255, i[a + 2] + t * 128));
}
function ye(i, e) {
  const t = (e - 0.5) * 2, a = 128 * (1 - t);
  for (let r = 0; r < i.length; r += 4)
    i[r] = Math.max(0, Math.min(255, i[r] * t + a)), i[r + 1] = Math.max(0, Math.min(255, i[r + 1] * t + a)), i[r + 2] = Math.max(0, Math.min(255, i[r + 2] * t + a));
}
function Me(i, e) {
  for (let t = 0; t < i.length; t += 4) {
    const a = i[t] * 0.299 + i[t + 1] * 0.587 + i[t + 2] * 0.114;
    i[t] = Math.max(0, Math.min(255, a + (i[t] - a) * e)), i[t + 1] = Math.max(0, Math.min(255, a + (i[t + 1] - a) * e)), i[t + 2] = Math.max(0, Math.min(255, a + (i[t + 2] - a) * e));
  }
}
function xe(i, e, t) {
  const a = i.getImageData(0, 0, e.width, e.height), r = a.data, n = e.width, l = e.height, o = [
    0,
    -t,
    0,
    -t,
    1 + 4 * t,
    -t,
    0,
    -t,
    0
  ], c = new Uint8ClampedArray(r);
  for (let m = 1; m < l - 1; m++)
    for (let s = 1; s < n - 1; s++)
      for (let h = 0; h < 3; h++) {
        let f = 0;
        for (let u = -1; u <= 1; u++)
          for (let p = -1; p <= 1; p++) {
            const M = ((m + u) * n + (s + p)) * 4 + h, d = o[(u + 1) * 3 + (p + 1)];
            f += c[M] * d;
          }
        const g = (m * n + s) * 4 + h;
        r[g] = Math.max(0, Math.min(255, f));
      }
  i.putImageData(a, 0, 0);
}
async function N(i) {
  const e = {
    isValid: !0,
    errors: [],
    warnings: []
  };
  if (i.size === 0)
    return e.isValid = !1, e.errors.push("File is empty"), e;
  e.fileSize = i.size;
  const t = i.type || "";
  e.declaredFormat = t, (!t || !t.startsWith("image/")) && e.warnings.push("File type not declared or not an image");
  try {
    const a = URL.createObjectURL(i), r = new Image();
    await new Promise((n, l) => {
      const o = setTimeout(() => {
        l(new Error("Image loading timeout"));
      }, 5e3);
      r.onload = () => {
        clearTimeout(o), e.dimensions = {
          width: r.naturalWidth,
          height: r.naturalHeight
        }, (r.naturalWidth <= 0 || r.naturalHeight <= 0) && (e.isValid = !1, e.errors.push("Invalid image dimensions")), (r.naturalWidth > 16384 || r.naturalHeight > 16384) && e.warnings.push("Image dimensions are very large (>16K pixels)");
        const c = document.createElement("canvas");
        c.width = 1, c.height = 1;
        const m = c.getContext("2d");
        if (m) {
          m.drawImage(r, 0, 0);
          try {
            const s = c.toDataURL();
            s.startsWith("data:image/") && (e.actualFormat = s.split(";")[0].split(":")[1]);
          } catch {
          }
        }
        URL.revokeObjectURL(a), n();
      }, r.onerror = () => {
        clearTimeout(o), e.isValid = !1, e.errors.push("Failed to load image - file may be corrupted"), URL.revokeObjectURL(a), l(new Error("Image load failed"));
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
function $e(i) {
  return N(i).then((e) => e.isValid);
}
async function be(i) {
  const e = i.getContext("2d");
  if (!e)
    return {
      isPhoto: !0,
      isGraphic: !1,
      hasText: !1,
      complexity: "medium",
      recommendedQuality: 0.8
    };
  const a = e.getImageData(0, 0, i.width, i.height).data, r = i.width, n = i.height, l = r * n;
  let o = 0;
  const c = /* @__PURE__ */ new Map();
  let m = 0;
  const s = 10;
  for (let w = 0; w < a.length; w += 4 * s) {
    const x = a[w], C = a[w + 1], z = a[w + 2];
    if (a[w + 3] < 255)
      continue;
    const S = `${Math.floor(x / 16)}-${Math.floor(C / 16)}-${Math.floor(z / 16)}`;
    c.has(S) || (o++, c.set(S, 1));
    const E = w / 4 % r, D = Math.floor(w / 4 / r);
    if (E > 0 && D > 0 && E < r - 1 && D < n - 1) {
      const k = (D * r + E) * 4, T = (D * r + (E + 1)) * 4;
      Math.abs(
        (a[k] + a[k + 1] + a[k + 2]) / 3 - (a[T] + a[T + 1] + a[T + 2]) / 3
      ) > 30 && m++;
    }
  }
  const h = l / s, f = o / h, g = m / h, u = f > 0.3 && g > 0.1, p = f < 0.2 && g < 0.05, M = g > 0.15 && f < 0.4;
  let d;
  f < 0.1 && g < 0.05 ? d = "low" : f > 0.5 || g > 0.2 ? d = "high" : d = "medium";
  let y;
  return p || M ? y = 0.9 : u && d === "high" ? y = 0.75 : u && d === "low" ? y = 0.85 : y = 0.8, {
    isPhoto: u,
    isGraphic: p,
    hasText: M,
    complexity: d,
    recommendedQuality: y
  };
}
function Ce(i, e) {
  return i.quality !== void 0 && i.quality !== null ? i.quality : e.recommendedQuality;
}
async function Be(i, e, t = {}) {
  const a = document.createElement("canvas");
  i instanceof HTMLImageElement ? (a.width = i.naturalWidth, a.height = i.naturalHeight) : (a.width = i.width, a.height = i.height);
  const r = a.getContext("2d");
  if (!r)
    throw new Error("Failed to get canvas context");
  if (e === "image/jpeg" || e === "image/jpg") {
    const n = t.backgroundColor || "#ffffff";
    r.fillStyle = n, r.fillRect(0, 0, a.width, a.height);
  }
  return i instanceof HTMLImageElement, r.drawImage(i, 0, 0), a;
}
async function V(i) {
  let e, t;
  if (i instanceof HTMLImageElement) {
    if (e = document.createElement("canvas"), e.width = i.naturalWidth, e.height = i.naturalHeight, t = e.getContext("2d"), !t)
      return !1;
    t.drawImage(i, 0, 0);
  } else if (e = i, t = e.getContext("2d"), !t)
    return !1;
  const r = t.getImageData(0, 0, e.width, e.height).data, n = 100;
  for (let l = 3; l < r.length; l += 4 * n)
    if (r[l] < 255)
      return !0;
  return !1;
}
function ve(i, e, t) {
  return i === "image/jpeg" || i === "image/jpg" || i === "image/png" && e ? !1 : i === "image/png" && t > 5e5;
}
function ze(i, e = {}) {
  const t = i.getContext("2d");
  if (!t)
    return i;
  const a = t.getImageData(0, 0, i.width, i.height), r = a.data, n = /* @__PURE__ */ new Map();
  let l = 0;
  for (let o = 0; o < r.length; o += 4) {
    const c = r[o], m = r[o + 1], s = r[o + 2];
    if (r[o + 3] < 255 && l++, e.reduceColors) {
      const f = `${Math.floor(c / 16) * 16}-${Math.floor(m / 16) * 16}-${Math.floor(s / 16) * 16}`;
      n.set(f, (n.get(f) || 0) + 1);
    }
  }
  if (e.reduceColors && e.maxColors) {
    const o = Math.min(e.maxColors, 256), c = Array.from(n.entries()).sort((s, h) => h[1] - s[1]).slice(0, o), m = /* @__PURE__ */ new Map();
    c.forEach(([s]) => {
      const [h, f, g] = s.split("-").map(Number);
      m.set(s, [h, f, g]);
    });
    for (let s = 0; s < r.length; s += 4) {
      const h = r[s], f = r[s + 1], g = r[s + 2];
      let u = 1 / 0, p = [h, f, g];
      for (const [M, d] of m.entries()) {
        const y = Math.sqrt(
          Math.pow(h - d[0], 2) + Math.pow(f - d[1], 2) + Math.pow(g - d[2], 2)
        );
        y < u && (u = y, p = d);
      }
      r[s] = p[0], r[s + 1] = p[1], r[s + 2] = p[2];
    }
  }
  if (e.optimizeTransparency && l > 0)
    for (let o = 0; o < r.length; o += 4)
      r[o + 3] === 0 && (r[o] = 0, r[o + 1] = 0, r[o + 2] = 0);
  return t.putImageData(a, 0, 0), i;
}
function Ie(i, e) {
  const t = i.getContext("2d");
  if (!t)
    return { x: 0, y: 0, width: i.width, height: i.height };
  const r = t.getImageData(0, 0, i.width, i.height).data, n = i.width, l = i.height;
  let o = 0, c = 0, m = 0;
  const s = 5;
  for (let C = 0; C < l; C += s)
    for (let z = 0; z < n; z += s) {
      const v = (C * n + z) * 4, S = r[v], E = r[v + 1], D = r[v + 2];
      if (r[v + 3] < 128) continue;
      const T = (S + E + D) / 3;
      let I = 0;
      if (z > 0 && z < n - 1 && C > 0 && C < l - 1) {
        const R = (C * n + (z + 1)) * 4, j = ((C + 1) * n + z) * 4;
        I = Math.abs(
          (r[R] + r[R + 1] + r[R + 2]) / 3 - T
        ) + Math.abs(
          (r[j] + r[j + 1] + r[j + 2]) / 3 - T
        );
      }
      const U = T * 0.5 + I * 0.5;
      o += U, c += z * U, m += C * U;
    }
  const h = o > 0 ? c / o : n / 2, f = o > 0 ? m / o : l / 2;
  let g = h, u = f;
  switch (e.focus) {
    case "top":
      u = l * 0.25;
      break;
    case "bottom":
      u = l * 0.75;
      break;
    case "left":
      g = n * 0.25;
      break;
    case "right":
      g = n * 0.75;
      break;
  }
  const p = e.width / e.height, M = n / l;
  let d, y;
  p > M ? (y = l, d = l * p) : (d = n, y = n / p), d = Math.min(d, n), y = Math.min(y, l);
  let w = g - d / 2, x = u - y / 2;
  return w = Math.max(0, Math.min(w, n - d)), x = Math.max(0, Math.min(x, l - y)), {
    x: Math.floor(w),
    y: Math.floor(x),
    width: Math.floor(d),
    height: Math.floor(y)
  };
}
function Ee(i, e, t) {
  const {
    text: a,
    image: r,
    position: n = "bottom-right",
    opacity: l = 0.7,
    fontSize: o = 16,
    fontFamily: c = "Arial",
    color: m = "#ffffff",
    padding: s = 10,
    scale: h = 0.2,
    rotation: f = 0
  } = t;
  i.save(), i.globalAlpha = l;
  let g = 0, u = 0;
  switch (n) {
    case "top-left":
      g = s, u = s;
      break;
    case "top-right":
      g = e.width - s, u = s;
      break;
    case "bottom-left":
      g = s, u = e.height - s;
      break;
    case "bottom-right":
      g = e.width - s, u = e.height - s;
      break;
    case "center":
      g = e.width / 2, u = e.height / 2;
      break;
  }
  if (f !== 0 && (i.translate(g, u), i.rotate(f * Math.PI / 180), i.translate(-g, -u)), a && (i.font = `${o}px ${c}`, i.fillStyle = m, i.textAlign = n.includes("right") ? "right" : n.includes("left") ? "left" : "center", i.textBaseline = n.includes("bottom") ? "bottom" : n.includes("top") ? "top" : "middle", i.fillText(a, g, u)), r) {
    const p = r.width * h, M = r.height * h;
    let d = g, y = u;
    n.includes("right") ? d = g - p : n === "center" && (d = g - p / 2), n.includes("bottom") ? y = u - M : n === "center" && (y = u - M / 2), i.drawImage(r, d, y, p, M);
  }
  i.restore();
}
class Pe {
  constructor(e) {
    this.metrics = {
      startTime: performance.now(),
      originalSize: e,
      compressedSize: 0,
      compressionRatio: 0
    }, this.startMemory = this.getCurrentMemory();
  }
  recordCompression(e) {
    const t = performance.now(), a = t - this.metrics.startTime, r = 1 - e / this.metrics.originalSize, n = this.metrics.originalSize / (a / 1e3), l = this.getCurrentMemory(), o = l - this.startMemory;
    return this.metrics = {
      ...this.metrics,
      endTime: t,
      duration: a,
      compressedSize: e,
      compressionRatio: r,
      throughput: n,
      memoryUsed: o,
      memoryPeak: l
    }, this.metrics;
  }
  getMetrics() {
    return { ...this.metrics };
  }
  getCurrentMemory() {
    return "memory" in performance ? performance.memory.usedJSHeapSize : 0;
  }
}
function We(i) {
  if (i === 0) return "0 B";
  const e = 1024, t = ["B", "KB", "MB", "GB"], a = Math.floor(Math.log(i) / Math.log(e));
  return Math.round(i / Math.pow(e, a) * 100) / 100 + " " + t[a];
}
function He(i) {
  return i < 1e3 ? `${Math.round(i)}ms` : i < 6e4 ? `${(i / 1e3).toFixed(2)}s` : `${(i / 6e4).toFixed(2)}min`;
}
const $ = "image/pixu", Se = ".pixu", qe = $, Ae = Se;
function _() {
  return !0;
}
const Oe = _;
function ke(i) {
  return i === "image/pix" ? $ : i;
}
async function q(i, e = 0.85, t = {}) {
  const {
    adaptive: a = !0
  } = t, r = i.getContext("2d", {
    willReadFrequently: !0,
    colorSpace: "srgb"
  });
  if (!r)
    throw new Error("Failed to get canvas context");
  const n = i.width, l = i.height, c = r.getImageData(0, 0, n, l).data;
  let m = e;
  a && (m = De(c, n, l, e));
  const s = Re(m, c), h = Math.max(0.5, Math.min(0.95, s));
  try {
    const f = await W(i, "image/webp", h);
    return new Blob([f], { type: $ });
  } catch {
    const f = Math.max(0.6, h), g = await W(i, "image/jpeg", f);
    return new Blob([g], { type: $ });
  }
}
const Xe = q;
function De(i, e, t, a) {
  let r = 0, n = 0;
  const l = 8, o = Math.floor(e / l), c = Math.floor(t / l);
  for (let f = 0; f < c; f++)
    for (let g = 0; g < o; g++) {
      const u = Fe(
        i,
        e,
        t,
        g * l,
        f * l,
        l
      );
      u > 500 ? r++ : u < 100 && n++;
    }
  const m = o * c, s = r / m, h = n / m;
  return s > 0.3 ? Math.max(0.6, a - 0.1) : h > 0.5 ? Math.max(0.5, a - 0.15) : a;
}
function Fe(i, e, t, a, r, n) {
  let l = 0, o = 0, c = 0;
  for (let s = r; s < Math.min(r + n, t); s++)
    for (let h = a; h < Math.min(a + n, e); h++) {
      const f = (s * e + h) * 4, g = i[f], u = i[f + 1], p = i[f + 2], M = 0.299 * g + 0.587 * u + 0.114 * p;
      l += M, o += M * M, c++;
    }
  if (c === 0) return 0;
  const m = l / c;
  return o / c - m * m;
}
function Re(i, e, t, a) {
  let r = 0, n = 0;
  for (let o = 0; o < e.length; o += 4) {
    const c = e[o], m = e[o + 1], s = e[o + 2], h = Math.max(c, m, s), f = Math.min(c, m, s);
    (h === 0 ? 0 : (h - f) / h) > 0.5 && r++, n++;
  }
  const l = r / n;
  return l < 0.2 ? Math.max(0.5, i - 0.08) : (l > 0.6, i);
}
function Te(i, e, t, a) {
  const n = 1 - e, l = Math.min(1, t * a / (1920 * 1080)), o = 0.7 - n * 0.2 + l * 0.1;
  return Math.max(0.4, Math.min(0.8, o));
}
const Ge = Te;
class A {
  constructor() {
    this.aborted = !1, this.isCompressing = !1, this.plugins = new ce();
  }
  async compress(e, t = {}) {
    if (this.aborted)
      throw new Error("Compression was aborted");
    if (this.isCompressing)
      throw new Error("Compression already in progress");
    const r = (e.type || "").toLowerCase().replace(/^image\/jpg$/, "image/jpeg");
    if (!Q(r))
      throw new Error("File must be an image");
    let n = t;
    if (t.preset && (n = me(t, t.preset)), n.validateImage) {
      const l = await N(e);
      if (!l.isValid)
        throw new Error(`Image validation failed: ${l.errors.join(", ")}`);
      l.warnings.length > 0 && console.warn("Image validation warnings:", l.warnings);
    }
    this.isCompressing = !0;
    try {
      let l = e;
      try {
        l = await this.plugins.runBeforeCompress(e, n);
      } catch (m) {
        console.warn("Plugin beforeCompress error:", m);
      }
      const o = await this.performCompression(l, n);
      let c = o;
      try {
        c = await this.plugins.runAfterCompress(o, n);
      } catch (m) {
        console.warn("Plugin afterCompress error:", m);
      }
      return c;
    } finally {
      this.isCompressing = !1;
    }
  }
  async performCompression(e, t) {
    var c, m;
    if (this.aborted)
      throw new Error("Compression was aborted");
    const a = e.size;
    t.monitorPerformance && new Pe(a);
    let r = null, n = 1, l = (e.type || "image/jpeg").toLowerCase();
    if (l === "image/jpg" && (l = "image/jpeg"), t.fixOrientation || t.stripMetadata)
      try {
        if (r = await e.arrayBuffer(), !r || r.byteLength === 0)
          throw new Error("Invalid image data");
        if (t.fixOrientation)
          try {
            n = ie(r), (!n || n < 1 || n > 8) && (n = 1);
          } catch (s) {
            console.warn("Failed to read EXIF orientation, using default:", s), n = 1;
          }
        if (t.stripMetadata)
          try {
            r = re(r);
          } catch (s) {
            console.warn("Failed to strip EXIF, continuing with original:", s);
          }
      } catch (s) {
        console.warn("Failed to process image buffer, continuing without EXIF processing:", s), r = null, n = 1;
      }
    let o;
    if (r) {
      const s = new Blob([r], { type: l });
      o = URL.createObjectURL(s);
    } else
      o = URL.createObjectURL(e);
    try {
      const s = await K(o), h = s.naturalWidth, f = s.naturalHeight;
      if (!h || !f || h <= 0 || f <= 0)
        throw new Error("Invalid image dimensions");
      const g = Z({
        naturalWidth: h,
        naturalHeight: f,
        maxWidth: t.maxWidth,
        // undefined if not set
        maxHeight: t.maxHeight,
        // undefined if not set
        minWidth: t.minWidth,
        // undefined if not set
        minHeight: t.minHeight,
        // undefined if not set
        width: t.width,
        // undefined if not set
        height: t.height,
        // undefined if not set
        mode: t.resize || "none"
        // 'none' by default - no resizing
      });
      let u = l;
      if (t.format && t.format !== "auto")
        u = t.format.toLowerCase(), u === "image/jpg" && (u = "image/jpeg");
      else if (t.format === "auto")
        if (_() && (l === "image/jpeg" || l === "image/png"))
          u = $;
        else if (l === "image/jpeg" || l === "image/png")
          try {
            if (typeof document < "u") {
              const b = document.createElement("canvas");
              b.width = 1, b.height = 1;
              const P = b.toDataURL("image/webp");
              P && P.indexOf("image/webp") === 5 ? u = "image/webp" : u = l;
            } else
              u = l;
          } catch {
            u = l;
          }
        else
          u = l;
      u = ke(u), (!u || !Q(u) && u !== $) && (u = "image/jpeg"), u === "image/jpg" && (u = "image/jpeg");
      let p = t.quality ?? 0.8;
      if (t.enableSmartQuality === !0 || u === $ && t.enableSmartQuality !== !1)
        try {
          const b = O(h, f), P = b.getContext("2d");
          if (P) {
            P.drawImage(s, 0, 0);
            const F = await be(b);
            t.quality == null ? p = Ce(
              { ...t, enableSmartQuality: !0 },
              F
            ) : p = Math.min(
              t.quality,
              (t.quality + F.recommendedQuality) / 2
            );
          }
        } catch (b) {
          console.warn("Smart quality analysis failed, using default:", b);
        }
      else if (t.mode === "adaptive" && !t.quality) {
        const b = e.size / 1048576;
        b > 10 ? p = 0.7 : b > 5 ? p = 0.75 : b < 1 ? p = 0.85 : p = 0.8;
      }
      p = Math.max(0.1, Math.min(0.99, p)), t.onProgress && t.onProgress(0.3);
      let d = null;
      if ((c = t.smartCrop) != null && c.enabled) {
        const b = O(h, f), P = b.getContext("2d");
        P && (P.drawImage(s, 0, 0), d = Ie(b, {
          width: t.smartCrop.width,
          height: t.smartCrop.height,
          focus: t.smartCrop.focus
        }), g.width = d.width, g.height = d.height);
      }
      if (g.width <= 0 || g.height <= 0 || !isFinite(g.width) || !isFinite(g.height))
        throw new Error("Invalid canvas dimensions");
      const y = 16384;
      if (g.width > y || g.height > y)
        throw new Error(`Canvas dimensions too large (max ${y}px)`);
      const w = O(g.width, g.height), x = w.getContext("2d", { willReadFrequently: !0 });
      if (!x)
        throw new Error("Failed to get canvas context");
      if (x.fillStyle = u === "image/jpeg" ? "#ffffff" : "transparent", x.fillRect(0, 0, g.width, g.height), t.beforeProcess && t.beforeProcess(x, w), this.aborted)
        throw new Error("Compression was aborted");
      const C = te(n), z = t.resize || "none";
      let v;
      if ((z === "cover" || z === "contain") && (v = ee(
        h,
        f,
        g.width,
        g.height,
        z
      )), d ? Y(x, s, {
        srcX: d.x,
        srcY: d.y,
        srcWidth: d.width,
        srcHeight: d.height,
        destX: 0,
        destY: 0,
        destWidth: g.width,
        destHeight: g.height,
        rotate: C.rotate,
        scaleX: C.scaleX,
        scaleY: C.scaleY
      }) : Y(x, s, {
        srcX: v == null ? void 0 : v.x,
        srcY: v == null ? void 0 : v.y,
        srcWidth: v == null ? void 0 : v.width,
        srcHeight: v == null ? void 0 : v.height,
        destX: 0,
        destY: 0,
        destWidth: g.width,
        destHeight: g.height,
        rotate: C.rotate,
        scaleX: C.scaleX,
        scaleY: C.scaleY
      }), t.enableNoiseAware && oe(x, w), t.enableColorWeighting && se(x, w), t.enableHdrToSdr && le(x, w), u === "image/png" && ((m = t.optimizePNG) != null && m.enabled))
        try {
          ze(w, {
            reduceColors: t.optimizePNG.reduceColors,
            maxColors: t.optimizePNG.maxColors,
            optimizeTransparency: t.optimizePNG.optimizeTransparency
          });
        } catch (b) {
          console.warn("PNG optimization failed:", b);
        }
      if (t.filters && t.filters.length > 0)
        for (const b of t.filters)
          try {
            ge(x, w, b);
          } catch (P) {
            console.warn("Filter application failed:", P);
          }
      if (t.watermark)
        try {
          Ee(x, w, t.watermark);
        } catch (b) {
          console.warn("Watermark application failed:", b);
        }
      if (t.convertToJPEG && u !== "image/jpeg")
        try {
          const b = await V(w);
          ve(u, b, a) && (x.fillStyle = "#ffffff", x.globalCompositeOperation = "destination-over", x.fillRect(0, 0, w.width, w.height), x.globalCompositeOperation = "source-over", u = "image/jpeg");
        } catch (b) {
          console.warn("Format conversion failed:", b);
        }
      t.afterProcess && t.afterProcess(x, w);
      try {
        await this.plugins.runTransform(w, t);
      } catch (b) {
        console.warn("Plugin transform error:", b);
      }
      if (this.aborted)
        throw new Error("Compression was aborted");
      t.onProgress && t.onProgress(0.8);
      let S;
      const E = ne(t) && t.mode === "size" && t.targetSize, D = u;
      E && t.targetSize ? D === $ ? S = await q(w, p, { adaptive: !0 }) : S = await this.dualPassCompression(w, D, p, a, t.targetSize) : D === $ ? S = await q(w, p, {
        progressive: t.enableProgressive !== !1,
        adaptive: !0,
        chromaSubsampling: "4:2:0"
      }) : S = await W(w, D, p), t.onProgress && t.onProgress(1);
      const k = e instanceof File ? e.name : "image", T = J(u), I = u === "image/jpg" ? "image/jpeg" : u, U = new File([S], k.replace(/\.[^.]+$/, T), {
        type: I,
        lastModified: Date.now()
      }), R = U.size, j = t.strict !== !1;
      let B = U, L = R;
      if (R >= a) {
        if (!(t.width !== void 0 && t.width !== h || t.height !== void 0 && t.height !== f || t.maxWidth !== void 0 && g.width < h || t.maxHeight !== void 0 && g.height < f || t.minWidth !== void 0 && g.width > h || t.minHeight !== void 0 && g.height > f || t.resize && t.resize !== "none") && I === l)
          try {
            const P = Math.max(0.5, (p || 0.8) - 0.2);
            let F;
            if (I === $ ? F = await q(w, P, { adaptive: !0 }) : F = await W(w, I, P), F.size < a)
              B = new File([F], k, { type: I }), L = F.size;
            else {
              const G = Math.max(0.4, P - 0.15);
              let H;
              I === $ ? H = await q(w, G, { adaptive: !0 }) : H = await W(w, I, G), H.size < a ? (B = new File([H], k, { type: I }), L = H.size) : j ? (B = e instanceof File ? e : new File([e], k, { type: l }), L = a) : (B = new File([H], k, { type: I }), L = H.size);
            }
          } catch {
            j && (B = e instanceof File ? e : new File([e], k, { type: l }), L = a);
          }
        else if (j && R > a)
          try {
            const P = Math.max(0.5, (p || 0.8) - 0.15);
            let F;
            I === $ ? F = await q(w, P, { adaptive: !0 }) : F = await W(w, I, P), F.size < R && (B = new File([F], k, { type: I }), L = F.size);
          } catch {
          }
      }
      const X = 1 - L / a;
      return {
        file: B,
        originalSize: a,
        compressedSize: L,
        compressionRatio: X,
        format: I,
        width: g.width,
        height: g.height,
        metadata: {
          hasExif: !t.stripMetadata && n > 1,
          orientation: n > 1 ? n : void 0
        }
      };
    } finally {
      URL.revokeObjectURL(o);
    }
  }
  async dualPassCompression(e, t, a, r, n) {
    let l = Math.max(0.1, Math.min(0.99, a)), o = await W(e, t, l), c = 0;
    const m = 10;
    for (; o.size > n && c < m; ) {
      const s = o.size / n;
      if (s > 2 ? l *= 0.7 : s > 1.5 ? l *= 0.8 : l *= 0.9, l = Math.max(0.1, Math.min(0.99, l)), o = await W(e, t, l), c++, l <= 0.1)
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
async function Qe(i, e = {}) {
  const t = e.concurrency || 3, a = [], r = [], n = new A();
  async function l(c, m) {
    try {
      const s = await n.compress(c, e);
      a[m] = s, e.onItemComplete && e.onItemComplete(s, m);
    } catch (s) {
      const h = s instanceof Error ? s : new Error("Unknown error");
      r[m] = h, e.onItemError && e.onItemError(h, m);
    }
  }
  const o = [];
  for (let c = 0; c < i.length; c += t)
    o.push(i.slice(c, c + t));
  for (const c of o)
    await Promise.all(
      c.map((m, s) => {
        const h = o.indexOf(c) * t + s;
        return l(m, h);
      })
    );
  if (r.length > 0 && !e.onItemError)
    throw new Error(`Batch compression failed for ${r.length} file(s)`);
  return a;
}
async function* Ye(i, e = {}) {
  const t = new A();
  for await (const a of i) {
    const r = await t.compress(a, e);
    if (yield r, e.onChunk) {
      const n = r.file instanceof File ? new Blob([r.file]) : r.file;
      e.onChunk(n, 0);
    }
  }
}
async function Ue(i, e) {
  const t = i.getContext("2d");
  if (!t)
    throw new Error("Failed to get canvas context");
  const r = t.getImageData(0, 0, i.width, i.height).data, n = i.width, l = i.height, o = n * l, c = /* @__PURE__ */ new Map();
  let m = 0, s = 0;
  const h = 10;
  for (let E = 0; E < r.length; E += 4 * h) {
    const D = r[E], k = r[E + 1], T = r[E + 2];
    r[E + 3] < 255 && m++;
    const U = `${Math.floor(D / 8)}-${Math.floor(k / 8)}-${Math.floor(T / 8)}`;
    c.set(U, (c.get(U) || 0) + 1);
    const R = E / 4 % n, j = Math.floor(E / 4 / n);
    if (R > 0 && j > 0 && R < n - 1 && j < l - 1) {
      const B = (j * n + R) * 4, L = (j * n + (R + 1)) * 4;
      Math.abs(
        (r[B] + r[B + 1] + r[B + 2]) / 3 - (r[L] + r[L + 1] + r[L + 2]) / 3
      ) > 30 && s++;
    }
  }
  const f = o / h, g = c.size, u = g / f, p = s / f, M = m > f * 0.01;
  let d;
  u > 0.3 && p > 0.1 ? d = "photo" : u < 0.2 && p < 0.05 ? d = "graphic" : p > 0.15 && u < 0.4 ? d = "text" : d = "mixed";
  let y;
  u < 0.1 && p < 0.05 ? y = "low" : u > 0.5 || p > 0.2 ? y = "high" : y = "medium";
  let w = 0.5;
  e && (w = 1 - n * l * 4 / e);
  let x;
  w > 0.8 ? x = "very-high" : w > 0.5 ? x = "high" : w > 0.2 ? x = "medium" : x = "low";
  let C;
  M ? C = "image/png" : d === "photo" && y === "high" ? C = "image/webp" : d === "photo" ? C = "image/jpeg" : C = "image/png";
  let z;
  d === "graphic" || d === "text" ? z = 0.9 : d === "photo" && y === "high" ? z = 0.75 : z = 0.8;
  const v = Math.min(0.9, w + 0.3), S = [];
  return M && C === "image/jpeg" && S.push("Consider converting to PNG to preserve transparency"), g < 256 && d === "graphic" && S.push("Image can benefit from color reduction"), w < 0.3 && S.push("High compression potential - consider lower quality"), (n > 1920 || l > 1080) && S.push("Consider resizing for web use"), {
    quality: x,
    compressionLevel: w,
    contentType: d,
    hasText: d === "text",
    complexity: y,
    colorCount: g,
    hasTransparency: M,
    recommendedFormat: C,
    recommendedQuality: z,
    estimatedSizeReduction: v,
    suggestions: S
  };
}
async function Ne(i, e, t) {
  const a = [], r = await Ue(e, i.size);
  i.type === "image/png" && !await V(e) && i.size > 5e5 && a.push({
    type: "format",
    message: "PNG without transparency can be converted to JPEG",
    suggestion: 'Use convertToJPEG: true or format: "image/jpeg"',
    potentialSavings: 0.5,
    priority: "high"
  }), !t.quality && r.contentType === "photo" && a.push({
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
  }), !t.stripMetadata && i.size > 1e6 && a.push({
    type: "metadata",
    message: "Large file may contain metadata",
    suggestion: "Use stripMetadata: true to reduce size",
    potentialSavings: 0.05,
    priority: "low"
  }), r.recommendedFormat !== i.type && a.push({
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
  return a.sort((n, l) => {
    const o = { high: 3, medium: 2, low: 1 };
    return o[l.priority] - o[n.priority];
  });
}
function Ve(i, e) {
  let t = 0;
  return e.quality && e.quality < 0.9 && (t += (0.9 - e.quality) * 0.5), (e.maxWidth || e.maxHeight) && (t += 0.3), e.stripMetadata && (t += 0.05), (e.format === "image/webp" || e.format === "image/avif") && (t += 0.2), Math.min(0.9, t);
}
async function _e(i, e) {
  const t = e.widths || [320, 640, 960, 1280, 1920], a = e.formats || ["image/webp", "image/jpeg"];
  e.quality;
  const r = [], n = [];
  for (const l of a) {
    const o = [];
    for (const c of t)
      o.push(`image-${c}w.${l.split("/")[1]} ${c}w`);
    n.push({
      format: l,
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
function Je(i) {
  return i.map((e) => `${e.url} ${e.width}w`).join(", ");
}
function Ke(i) {
  const e = [];
  for (let t = 0; t < i.length - 1; t++)
    e.push(`(max-width: ${i[t]}px) ${i[t]}px`);
  return e.push(`${i[i.length - 1]}px`), e.join(", ");
}
function Ze(i) {
  return i.getContext("2d", { colorSpace: "srgb" }), {
    isSRGB: !0,
    // Canvas default
    hasColorProfile: !1,
    gamma: 2.2,
    // Standard sRGB gamma
    needsConversion: !1
    // Already in sRGB
  };
}
function et(i, e) {
  const t = i.getImageData(0, 0, e.width, e.height), a = t.data;
  for (let r = 0; r < a.length; r += 4)
    ;
  i.putImageData(t, 0, 0);
}
function tt() {
  if (typeof document > "u")
    return !1;
  const i = document.createElement("canvas");
  try {
    return i.getContext("2d", { colorSpace: "display-p3" }) !== null;
  } catch {
    return !1;
  }
}
function it(i) {
  const e = new DataView(i);
  if (e.getUint8(0) !== 255 || e.getUint8(1) !== 216)
    return !1;
  let t = 2;
  const a = e.byteLength;
  let r = !1;
  for (; t + 1 < a && t < 65536; ) {
    if (e.getUint8(t) === 255) {
      const n = e.getUint8(t + 1);
      if (n >= 192 && n <= 195 && t + 5 < a && (e.getUint8(t + 5), r = !0), n === 218)
        break;
    }
    t++;
  }
  return r;
}
function rt() {
  return typeof document < "u" && typeof HTMLCanvasElement < "u";
}
class at {
  constructor() {
    this.paused = !1, this.cancelled = !1, this.startTime = 0, this.completedCount = 0, this.errorCount = 0, this.compressor = new A();
  }
  async processBatch(e, t = {}) {
    this.startTime = Date.now(), this.completedCount = 0, this.errorCount = 0, this.paused = !1, this.cancelled = !1;
    const {
      concurrency: a = 3,
      retryAttempts: r = 2,
      retryDelay: n = 1e3,
      priority: l = "fifo",
      onProgress: o,
      onItemComplete: c,
      onItemError: m
    } = t, s = this.sortByPriority(e, l), h = new Array(e.length), f = [], g = /* @__PURE__ */ new Map();
    s.forEach((M, d) => {
      g.set(M, e.indexOf(M));
    });
    const u = async (M, d) => {
      if (this.cancelled)
        return;
      for (; this.paused && !this.cancelled; )
        await new Promise((w) => setTimeout(w, 100));
      if (this.cancelled)
        return;
      let y = null;
      for (let w = 0; w <= r; w++)
        try {
          const {
            retryAttempts: x,
            retryDelay: C,
            priority: z,
            onProgress: v,
            pause: S,
            resume: E,
            onItemComplete: D,
            onItemError: k,
            concurrency: T,
            ...I
          } = t, U = await this.compressor.compress(M, I);
          h[d] = U, this.completedCount++, c && c(U, d), o && o(
            this.completedCount,
            e.length,
            this.errorCount
          );
          return;
        } catch (x) {
          y = x instanceof Error ? x : new Error("Unknown error"), w < r && await new Promise((C) => setTimeout(C, n));
        }
      this.errorCount++, f[d] = y, m && m(y, d), o && o(
        this.completedCount,
        e.length,
        this.errorCount
      );
    }, p = [];
    for (let M = 0; M < s.length; M += a)
      p.push(s.slice(M, M + a));
    for (const M of p) {
      if (this.cancelled)
        break;
      await Promise.all(
        M.map((d) => {
          const y = g.get(d);
          return u(d, y);
        })
      );
    }
    if (f.length > 0 && !m)
      throw new Error(`Batch compression failed for ${f.length} file(s)`);
    return h;
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
    const e = Date.now() - this.startTime, t = this.completedCount / (e / 1e3), a = this.completedCount > 0 ? Math.ceil((this.completedCount - this.completedCount) / t * 1e3) : void 0;
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
  sortByPriority(e, t) {
    const a = [...e];
    switch (t) {
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
function je() {
  if ("memory" in performance) {
    const i = performance.memory;
    return {
      used: i.usedJSHeapSize,
      available: i.totalJSHeapSize - i.usedJSHeapSize,
      limit: i.jsHeapSizeLimit
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
function nt(i) {
  return i > 10 * 1024 * 1024;
}
function ot(i, e) {
  const t = e || je().available, a = Math.min(t * 0.1, 5 * 1024 * 1024);
  return Math.max(a, 1024 * 1024);
}
const Le = new A();
async function st(i, e) {
  return Le.compress(i, e);
}
export {
  at as AdvancedBatchProcessor,
  Se as PIXU_EXTENSION,
  $ as PIXU_MIME_TYPE,
  Ae as PIX_EXTENSION,
  qe as PIX_MIME_TYPE,
  Pe as PerformanceMonitor,
  A as PixuCompressor,
  ce as PluginManager,
  Ze as analyzeColorSpace,
  Ue as analyzeImage,
  be as analyzeImageContent,
  ge as applyFilter,
  me as applyPreset,
  Ee as applyWatermark,
  ot as calculateChunkSize,
  Ie as calculateSmartCrop,
  Xe as canvasToPix,
  q as canvasToPixu,
  st as compress,
  Qe as compressBatch,
  Ye as compressStream,
  Be as convertFormat,
  Le as default,
  V as detectTransparency,
  Ve as estimateCompressionSavings,
  Ge as estimatePixCompression,
  Te as estimatePixuCompression,
  We as formatBytes,
  He as formatDuration,
  _e as generateResponsiveImages,
  Ke as generateSizes,
  Je as generateSrcset,
  je as getMemoryInfo,
  Ne as getOptimizationHints,
  fe as getPresetOptions,
  Ce as getSmartQuality,
  Oe as isPixSupported,
  _ as isPixuSupported,
  it as isProgressiveJPEG,
  $e as isValidImage,
  ke as normalizePixuFormat,
  et as normalizeToSRGB,
  ze as optimizePNG,
  ve as shouldConvertToJPEG,
  nt as shouldUseStreaming,
  rt as supportsProgressiveJPEG,
  tt as supportsWideGamut,
  N as validateImage
};
//# sourceMappingURL=pixu.esm.js.map
