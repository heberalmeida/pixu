function re(t) {
  if (!t || typeof t != "string")
    return !1;
  const e = t.toLowerCase().replace(/^image\/jpg$/, "image/jpeg");
  return e === "image/pixu" || e === "image/pix" ? !0 : /^image\/(jpeg|png|webp|avif|gif|bmp|svg\+xml)$/i.test(e);
}
function ae(t) {
  const e = t.toLowerCase().replace(/^image\/jpg$/, "image/jpeg");
  return {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/avif": ".avif",
    "image/pixu": ".webp",
    "image/pix": ".webp",
    "image/gif": ".gif",
    "image/bmp": ".bmp"
  }[e] || ".jpg";
}
function de(t) {
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
function pe(t) {
  const {
    naturalWidth: e,
    naturalHeight: i,
    maxWidth: a,
    maxHeight: r,
    minWidth: n = 0,
    minHeight: s = 0,
    width: o,
    height: c,
    mode: f
  } = t, m = e / i;
  let l = e, h = i;
  if (f === "none")
    o !== void 0 && (l = o), c !== void 0 && (h = c), o !== void 0 && c === void 0 ? h = l / m : c !== void 0 && o === void 0 && (l = h * m);
  else if (f === "contain")
    if (o && c) {
      const y = o / c;
      m > y ? (l = o, a !== void 0 && (l = Math.min(l, a)), h = l / m) : (h = c, r !== void 0 && (h = Math.min(h, r)), l = h * m);
    } else o ? (l = o, a !== void 0 && (l = Math.min(l, a)), h = l / m) : c ? (h = c, r !== void 0 && (h = Math.min(h, r)), l = h * m) : (a !== void 0 || r !== void 0) && (a !== void 0 && r !== void 0 ? e / i > a / r ? (l = a, h = l / m) : (h = r, l = h * m) : a !== void 0 ? e > a && (l = a, h = l / m) : r !== void 0 && i > r && (h = r, l = h * m));
  else if (f === "cover")
    if (o && c) {
      const y = o / c;
      m > y ? (h = c, r !== void 0 && (h = Math.min(h, r)), l = h * m) : (l = o, a !== void 0 && (l = Math.min(l, a)), h = l / m);
    } else o ? (l = o, a !== void 0 && (l = Math.min(l, a)), h = l / m) : c ? (h = c, r !== void 0 && (h = Math.min(h, r)), l = h * m) : (a !== void 0 || r !== void 0) && (a !== void 0 && r !== void 0 ? e / i > a / r ? (l = a, h = l / m) : (h = r, l = h * m) : a !== void 0 ? e > a && (l = a, h = l / m) : r !== void 0 && i > r && (h = r, l = h * m));
  else if (f === "fit")
    if (o && c) {
      const y = o / c;
      m > y ? (l = o, a !== void 0 && (l = Math.min(l, a)), h = l / m) : (h = c, r !== void 0 && (h = Math.min(h, r)), l = h * m);
    } else o ? (l = o, a !== void 0 && (l = Math.min(l, a)), h = l / m) : c ? (h = c, r !== void 0 && (h = Math.min(h, r)), l = h * m) : (a !== void 0 || r !== void 0) && (a !== void 0 && r !== void 0 ? e / i > a / r ? (l = a, h = l / m) : (h = r, l = h * m) : a !== void 0 ? e > a && (l = a, h = l / m) : r !== void 0 && i > r && (h = r, l = h * m));
  else f === "fill" && (l = o ?? e, h = c ?? i);
  return n !== void 0 && n > 0 && (l = Math.max(l, n)), s !== void 0 && s > 0 && (h = Math.max(h, s)), a !== void 0 && (l = Math.min(l, a)), r !== void 0 && (h = Math.min(h, r)), {
    width: Math.round(l),
    height: Math.round(h)
  };
}
function we(t, e, i, a, r) {
  const n = t / e, s = i / a;
  let o = t, c = e, f = 0, m = 0;
  return r === "cover" ? n > s ? (c = e, o = c * s, f = (t - o) / 2) : (o = t, c = o / s, m = (e - c) / 2) : (r === "contain" || r === "fit") && (n > s ? (o = t, c = o / s, m = (e - c) / 2) : (c = e, o = c * s, f = (t - o) / 2)), {
    x: Math.round(f),
    y: Math.round(m),
    width: Math.round(o),
    height: Math.round(c)
  };
}
function ye(t) {
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
function Me(t) {
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
          const c = a + 4;
          if (c + 4 >= r)
            break;
          if (xe(e, c, 4) === "Exif") {
            const f = a + 10;
            if (f + 8 >= r)
              break;
            const m = e.getUint16(f), l = m === 18761;
            if ((l || m === 19789) && e.getUint16(f + 2, l) === 42) {
              const h = e.getUint32(f + 4, l);
              if (h >= 8 && h < 1048576 && // Max 1MB offset
              f + h + 12 < r) {
                const y = f + h, b = e.getUint16(y, l), x = Math.min(b, 100);
                for (let d = 0; d < x; d++) {
                  const u = y + d * 12 + 2;
                  if (u + 10 >= r)
                    break;
                  if (e.getUint16(u, l) === 274) {
                    i = e.getUint16(u + 8, l), (i < 1 || i > 8) && (i = 1);
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
function be(t) {
  if (!t || t.byteLength < 2 || t.byteLength > 10 * 1024 * 1024)
    return t;
  const e = new DataView(t), i = new Uint8Array(t), a = new Array(t.byteLength);
  let r = 0, n = 0, s = 0;
  const o = 1e4;
  if (e.getUint8(0) !== 255 || e.getUint8(1) !== 216)
    return t;
  for (a[r++] = 255, a[r++] = 216, n = 2; n < i.length && s < o && (s++, !(n >= i.length - 1)); ) {
    if (i[n] === 255) {
      const c = i[n + 1];
      if (c === void 0)
        break;
      if (c === 224 || c === 225) {
        if (n + 3 >= i.length)
          break;
        const f = i[n + 2] << 8 | i[n + 3];
        if (f < 2 || f > 65535)
          break;
        if (c === 225) {
          if (n += f + 2, n > i.length)
            break;
          continue;
        }
      }
      if (c === 218) {
        const f = i.length - n;
        for (let m = 0; m < f; m++)
          a[r++] = i[n + m];
        break;
      }
    }
    if (i[n] === 255 && n + 3 < i.length) {
      const c = i[n + 2] << 8 | i[n + 3];
      if (c < 2 || c > 65535 || n + c + 2 > i.length)
        break;
      const f = n + c + 2;
      for (let m = n; m < f; m++)
        a[r++] = i[m];
      n += c + 2;
    } else
      a[r++] = i[n], n++;
  }
  return new Uint8Array(a.slice(0, r)).buffer;
}
function xe(t, e, i) {
  let a = "";
  for (let r = 0; r < i; r++)
    a += String.fromCharCode(t.getUint8(e + r));
  return a;
}
function Ce(t) {
  return t.enableDualPass === !1 ? !1 : t.enableDualPass === !0 ? !0 : (t.targetSize ? t.targetSize : 0) / (1024 * 1024) > 2 || t.mode === "size";
}
function ve(t, e) {
  const i = t.getImageData(0, 0, e.width, e.height), a = i.data;
  for (let r = 0; r < a.length; r += 4) {
    const n = a[r], s = a[r + 1], o = a[r + 2], c = n * 0.299 + s * 0.587 + o * 0.114, f = 10;
    Math.abs(n - c) < f && (a[r] = c), Math.abs(s - c) < f && (a[r + 1] = c), Math.abs(o - c) < f && (a[r + 2] = c);
  }
  t.putImageData(i, 0, 0);
}
function Pe(t, e) {
  const i = t.getImageData(0, 0, e.width, e.height), a = i.data;
  for (let r = 0; r < a.length; r += 4) {
    const n = a[r], s = a[r + 1], o = a[r + 2], f = n * 0.2126 + s * 0.7152 + o * 0.0722 > 128 ? 1.05 : 0.95;
    a[r] = Math.min(255, n * f), a[r + 1] = Math.min(255, s * f), a[r + 2] = Math.min(255, o * f);
  }
  t.putImageData(i, 0, 0);
}
function Ie(t, e) {
  const i = t.getImageData(0, 0, e.width, e.height), a = i.data, r = 0.8;
  for (let n = 0; n < a.length; n += 4)
    a[n] = Math.min(255, a[n] * r), a[n + 1] = Math.min(255, a[n + 1] * r), a[n + 2] = Math.min(255, a[n + 2] * r);
  t.putImageData(i, 0, 0);
}
function W(t, e, i) {
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
      const o = t.toDataURL(e, s), c = atob(o.split(",")[1]), f = o.split(",")[0].split(":")[1].split(";")[0], m = new ArrayBuffer(c.length), l = new Uint8Array(m);
      for (let h = 0; h < c.length; h++)
        l[h] = c.charCodeAt(h);
      a(new Blob([m], { type: f }));
    }
  });
}
function ee(t, e) {
  const i = document.createElement("canvas");
  return i.width = t, i.height = e, i;
}
function ne(t, e, i) {
  const {
    srcX: a = 0,
    srcY: r = 0,
    srcWidth: n = e.width,
    srcHeight: s = e.height,
    destX: o = 0,
    destY: c = 0,
    destWidth: f = e.width,
    destHeight: m = e.height,
    rotate: l = 0,
    scaleX: h = 1,
    scaleY: y = 1
  } = i || {};
  if (t.save(), l !== 0 || h !== 1 || y !== 1) {
    const b = o + f / 2, x = c + m / 2;
    t.translate(b, x), t.rotate(l * Math.PI / 180), t.scale(h, y), t.drawImage(
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
      c,
      f,
      m
    );
  t.restore();
}
class Ee {
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
const Se = {
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
function ze(t) {
  const e = Se[t];
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
function ke(t, e) {
  const i = ze(e);
  return {
    ...i,
    ...t,
    // Preserve user's quality if specified
    quality: t.quality ?? i.quality
  };
}
function Re(t, e, i, a) {
  let r, n;
  typeof i == "string" ? (r = i, n = a ?? 1) : (r = i.type, n = i.value ?? 1);
  const s = t.getImageData(0, 0, e.width, e.height), o = s.data;
  switch (r) {
    case "grayscale":
      je(o);
      break;
    case "sepia":
      De(o);
      break;
    case "vintage":
      Ue(o);
      break;
    case "brightness":
      Fe(o, n);
      break;
    case "contrast":
      Le(o, n);
      break;
    case "saturation":
      Te(o, n);
      break;
    case "blur":
      t.filter = `blur(${n}px)`;
      const c = document.createElement("canvas");
      c.width = e.width, c.height = e.height;
      const f = c.getContext("2d");
      f && (f.drawImage(e, 0, 0), t.clearRect(0, 0, e.width, e.height), t.filter = "none", t.drawImage(c, 0, 0));
      return;
    case "sharpen":
      Be(t, e, n);
      return;
  }
  t.putImageData(s, 0, 0);
}
function je(t) {
  for (let e = 0; e < t.length; e += 4) {
    const i = t[e] * 0.299 + t[e + 1] * 0.587 + t[e + 2] * 0.114;
    t[e] = i, t[e + 1] = i, t[e + 2] = i;
  }
}
function De(t) {
  for (let e = 0; e < t.length; e += 4) {
    const i = t[e], a = t[e + 1], r = t[e + 2];
    t[e] = Math.min(255, i * 0.393 + a * 0.769 + r * 0.189), t[e + 1] = Math.min(255, i * 0.349 + a * 0.686 + r * 0.168), t[e + 2] = Math.min(255, i * 0.272 + a * 0.534 + r * 0.131);
  }
}
function Ue(t) {
  for (let e = 0; e < t.length; e += 4) {
    const i = t[e] * 0.3 + t[e + 1] * 0.59 + t[e + 2] * 0.11;
    t[e] = Math.min(255, t[e] * 0.7 + i * 0.3), t[e + 1] = Math.min(255, t[e + 1] * 0.7 + i * 0.3), t[e + 2] = Math.min(255, t[e + 2] * 0.7 + i * 0.3), t[e] = Math.min(255, t[e] * 1.1), t[e + 2] = Math.min(255, t[e + 2] * 0.9);
  }
}
function Fe(t, e) {
  const i = (e - 0.5) * 2;
  for (let a = 0; a < t.length; a += 4)
    t[a] = Math.max(0, Math.min(255, t[a] + i * 128)), t[a + 1] = Math.max(0, Math.min(255, t[a + 1] + i * 128)), t[a + 2] = Math.max(0, Math.min(255, t[a + 2] + i * 128));
}
function Le(t, e) {
  const i = (e - 0.5) * 2, a = 128 * (1 - i);
  for (let r = 0; r < t.length; r += 4)
    t[r] = Math.max(0, Math.min(255, t[r] * i + a)), t[r + 1] = Math.max(0, Math.min(255, t[r + 1] * i + a)), t[r + 2] = Math.max(0, Math.min(255, t[r + 2] * i + a));
}
function Te(t, e) {
  for (let i = 0; i < t.length; i += 4) {
    const a = t[i] * 0.299 + t[i + 1] * 0.587 + t[i + 2] * 0.114;
    t[i] = Math.max(0, Math.min(255, a + (t[i] - a) * e)), t[i + 1] = Math.max(0, Math.min(255, a + (t[i + 1] - a) * e)), t[i + 2] = Math.max(0, Math.min(255, a + (t[i + 2] - a) * e));
  }
}
function Be(t, e, i) {
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
  ], c = new Uint8ClampedArray(r);
  for (let f = 1; f < s - 1; f++)
    for (let m = 1; m < n - 1; m++)
      for (let l = 0; l < 3; l++) {
        let h = 0;
        for (let b = -1; b <= 1; b++)
          for (let x = -1; x <= 1; x++) {
            const d = ((f + b) * n + (m + x)) * 4 + l, u = o[(b + 1) * 3 + (x + 1)];
            h += c[d] * u;
          }
        const y = (f * n + m) * 4 + l;
        r[y] = Math.max(0, Math.min(255, h));
      }
  t.putImageData(a, 0, 0);
}
async function se(t) {
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
        const c = document.createElement("canvas");
        c.width = 1, c.height = 1;
        const f = c.getContext("2d");
        if (f) {
          f.drawImage(r, 0, 0);
          try {
            const m = c.toDataURL();
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
function ht(t) {
  return se(t).then((e) => e.isValid);
}
async function $e(t) {
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
  const c = /* @__PURE__ */ new Map();
  let f = 0;
  const m = 10;
  for (let g = 0; g < a.length; g += 4 * m) {
    const p = a[g], M = a[g + 1], I = a[g + 2];
    if (a[g + 3] < 255)
      continue;
    const R = `${Math.floor(p / 16)}-${Math.floor(M / 16)}-${Math.floor(I / 16)}`;
    c.has(R) || (o++, c.set(R, 1));
    const C = g / 4 % r, P = Math.floor(g / 4 / r);
    if (C > 0 && P > 0 && C < r - 1 && P < n - 1) {
      const j = (P * r + C) * 4, D = (P * r + (C + 1)) * 4;
      Math.abs(
        (a[j] + a[j + 1] + a[j + 2]) / 3 - (a[D] + a[D + 1] + a[D + 2]) / 3
      ) > 30 && f++;
    }
  }
  const l = s / m, h = o / l, y = f / l, b = h > 0.3 && y > 0.1, x = h < 0.2 && y < 0.05, d = y > 0.15 && h < 0.4;
  let u;
  h < 0.1 && y < 0.05 ? u = "low" : h > 0.5 || y > 0.2 ? u = "high" : u = "medium";
  let w;
  return x || d ? w = 0.9 : b && u === "high" ? w = 0.75 : b && u === "low" ? w = 0.85 : w = 0.8, {
    isPhoto: b,
    isGraphic: x,
    hasText: d,
    complexity: u,
    recommendedQuality: w
  };
}
function We(t, e) {
  return t.quality !== void 0 && t.quality !== null ? t.quality : e.recommendedQuality;
}
async function ft(t, e, i = {}) {
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
async function ce(t) {
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
function Oe(t, e, i) {
  return t === "image/jpeg" || t === "image/jpg" || t === "image/png" && e ? !1 : t === "image/png" && i > 5e5;
}
function He(t, e = {}) {
  const i = t.getContext("2d");
  if (!i)
    return t;
  const a = i.getImageData(0, 0, t.width, t.height), r = a.data, n = /* @__PURE__ */ new Map();
  let s = 0;
  for (let o = 0; o < r.length; o += 4) {
    const c = r[o], f = r[o + 1], m = r[o + 2];
    if (r[o + 3] < 255 && s++, e.reduceColors) {
      const h = `${Math.floor(c / 16) * 16}-${Math.floor(f / 16) * 16}-${Math.floor(m / 16) * 16}`;
      n.set(h, (n.get(h) || 0) + 1);
    }
  }
  if (e.reduceColors && e.maxColors) {
    const o = Math.min(e.maxColors, 256), c = Array.from(n.entries()).sort((m, l) => l[1] - m[1]).slice(0, o), f = /* @__PURE__ */ new Map();
    c.forEach(([m]) => {
      const [l, h, y] = m.split("-").map(Number);
      f.set(m, [l, h, y]);
    });
    for (let m = 0; m < r.length; m += 4) {
      const l = r[m], h = r[m + 1], y = r[m + 2];
      let b = 1 / 0, x = [l, h, y];
      for (const [d, u] of f.entries()) {
        const w = Math.sqrt(
          Math.pow(l - u[0], 2) + Math.pow(h - u[1], 2) + Math.pow(y - u[2], 2)
        );
        w < b && (b = w, x = u);
      }
      r[m] = x[0], r[m + 1] = x[1], r[m + 2] = x[2];
    }
  }
  if (e.optimizeTransparency && s > 0)
    for (let o = 0; o < r.length; o += 4)
      r[o + 3] === 0 && (r[o] = 0, r[o + 1] = 0, r[o + 2] = 0);
  return i.putImageData(a, 0, 0), t;
}
function Ae(t, e) {
  const i = t.getContext("2d");
  if (!i)
    return { x: 0, y: 0, width: t.width, height: t.height };
  const r = i.getImageData(0, 0, t.width, t.height).data, n = t.width, s = t.height;
  let o = 0, c = 0, f = 0;
  const m = 5;
  for (let M = 0; M < s; M += m)
    for (let I = 0; I < n; I += m) {
      const E = (M * n + I) * 4, R = r[E], C = r[E + 1], P = r[E + 2];
      if (r[E + 3] < 128) continue;
      const D = (R + C + P) / 3;
      let S = 0;
      if (I > 0 && I < n - 1 && M > 0 && M < s - 1) {
        const L = (M * n + (I + 1)) * 4, U = ((M + 1) * n + I) * 4;
        S = Math.abs(
          (r[L] + r[L + 1] + r[L + 2]) / 3 - D
        ) + Math.abs(
          (r[U] + r[U + 1] + r[U + 2]) / 3 - D
        );
      }
      const k = D * 0.5 + S * 0.5;
      o += k, c += I * k, f += M * k;
    }
  const l = o > 0 ? c / o : n / 2, h = o > 0 ? f / o : s / 2;
  let y = l, b = h;
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
  let u, w;
  x > d ? (w = s, u = s * x) : (u = n, w = n / x), u = Math.min(u, n), w = Math.min(w, s);
  let g = y - u / 2, p = b - w / 2;
  return g = Math.max(0, Math.min(g, n - u)), p = Math.max(0, Math.min(p, s - w)), {
    x: Math.floor(g),
    y: Math.floor(p),
    width: Math.floor(u),
    height: Math.floor(w)
  };
}
function qe(t, e) {
  const i = Math.min(t.width, t.height), a = Math.max(18, Math.round(i * 0.045));
  if (e == null || e <= 0)
    return a;
  if (e <= 1)
    return Math.max(12, Math.round(i * e));
  const r = Math.round(e * (i / 720));
  return Math.max(e, r, Math.round(a * 0.75));
}
function Xe(t, e) {
  const i = Math.min(t.width, t.height), a = Math.max(8, Math.round(i * 0.025));
  return e == null ? a : Math.max(e, Math.round(a * 0.5));
}
function Ge(t, e, i) {
  const {
    text: a,
    image: r,
    position: n = "bottom-right",
    opacity: s = 0.85,
    fontSize: o,
    fontFamily: c = "Arial, Helvetica, sans-serif",
    color: f = "#ffffff",
    padding: m,
    scale: l = 0.2,
    rotation: h = 0,
    stroke: y = !0,
    strokeColor: b = "rgba(0, 0, 0, 0.65)"
  } = i, x = typeof a == "string" && a.trim().length > 0;
  if (!x && !r)
    return;
  const d = Xe(e, m), u = qe(e, o);
  t.save(), t.globalAlpha = Math.min(1, Math.max(0, s));
  let w = 0, g = 0;
  switch (n) {
    case "top-left":
      w = d, g = d;
      break;
    case "top-right":
      w = e.width - d, g = d;
      break;
    case "bottom-left":
      w = d, g = e.height - d;
      break;
    case "bottom-right":
      w = e.width - d, g = e.height - d;
      break;
    case "center":
      w = e.width / 2, g = e.height / 2;
      break;
  }
  if (h !== 0 && (t.translate(w, g), t.rotate(h * Math.PI / 180), t.translate(-w, -g)), x) {
    const p = a.trim();
    t.font = `600 ${u}px ${c}`, t.fillStyle = f, t.textAlign = n.includes("right") ? "right" : n.includes("left") ? "left" : "center", t.textBaseline = n.includes("bottom") ? "bottom" : n.includes("top") ? "top" : "middle", y && (t.lineJoin = "round", t.miterLimit = 2, t.lineWidth = Math.max(2, Math.round(u / 10)), t.strokeStyle = b, t.strokeText(p, w, g)), t.shadowColor = "rgba(0, 0, 0, 0.35)", t.shadowBlur = Math.max(2, Math.round(u / 8)), t.shadowOffsetX = 0, t.shadowOffsetY = Math.max(1, Math.round(u / 20)), t.fillText(p, w, g), t.shadowColor = "transparent", t.shadowBlur = 0;
  }
  if (r) {
    const p = r.width * l, M = r.height * l;
    let I = w, E = g;
    n.includes("right") ? I = w - p : n === "center" && (I = w - p / 2), n.includes("bottom") ? E = g - M : n === "center" && (E = g - M / 2), t.drawImage(r, I, E, p, M);
  }
  t.restore();
}
class Ne {
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
function gt(t) {
  if (!Number.isFinite(t) || t === 0) return "0 B";
  const e = t < 0 ? "-" : "", i = Math.abs(t), a = 1024, r = ["B", "KB", "MB", "GB"], n = Math.min(r.length - 1, Math.floor(Math.log(i) / Math.log(a)));
  return `${e}${Math.round(i / Math.pow(a, n) * 100) / 100} ${r[n]}`;
}
function ut(t) {
  return t < 1e3 ? `${Math.round(t)}ms` : t < 6e4 ? `${(t / 1e3).toFixed(2)}s` : `${(t / 6e4).toFixed(2)}min`;
}
const z = "image/pixu", Ye = ".webp", dt = z, pt = Ye;
function te() {
  return !0;
}
const wt = te;
function Qe(t) {
  return t === "image/pix" ? z : t;
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
  const n = t.width, s = t.height, c = r.getImageData(0, 0, n, s).data;
  let f = e;
  a && (f = _e(c, n, s, e));
  const m = Je(f, c), l = Math.max(0.5, Math.min(0.95, m));
  try {
    return await W(t, "image/webp", l);
  } catch {
    const h = Math.max(0.6, l);
    return await W(t, "image/jpeg", h);
  }
}
const yt = G;
function _e(t, e, i, a) {
  let r = 0, n = 0;
  const s = 8, o = Math.floor(e / s), c = Math.floor(i / s);
  for (let h = 0; h < c; h++)
    for (let y = 0; y < o; y++) {
      const b = Ve(
        t,
        e,
        i,
        y * s,
        h * s,
        s
      );
      b > 500 ? r++ : b < 100 && n++;
    }
  const f = o * c, m = r / f, l = n / f;
  return m > 0.3 ? Math.max(0.6, a - 0.1) : l > 0.5 ? Math.max(0.5, a - 0.15) : a;
}
function Ve(t, e, i, a, r, n) {
  let s = 0, o = 0, c = 0;
  for (let m = r; m < Math.min(r + n, i); m++)
    for (let l = a; l < Math.min(a + n, e); l++) {
      const h = (m * e + l) * 4, y = t[h], b = t[h + 1], x = t[h + 2], d = 0.299 * y + 0.587 * b + 0.114 * x;
      s += d, o += d * d, c++;
    }
  if (c === 0) return 0;
  const f = s / c;
  return o / c - f * f;
}
function Je(t, e, i, a) {
  let r = 0, n = 0;
  for (let o = 0; o < e.length; o += 4) {
    const c = e[o], f = e[o + 1], m = e[o + 2], l = Math.max(c, f, m), h = Math.min(c, f, m);
    (l === 0 ? 0 : (l - h) / l) > 0.5 && r++, n++;
  }
  const s = r / n;
  return s < 0.2 ? Math.max(0.5, t - 0.08) : (s > 0.6, t);
}
function Ke(t, e, i, a) {
  const n = 1 - e, s = Math.min(1, i * a / (1920 * 1080)), o = 0.7 - n * 0.2 + s * 0.1;
  return Math.max(0.4, Math.min(0.8, o));
}
const Mt = Ke;
function Ze(t) {
  const e = t instanceof Uint8Array ? t : new Uint8Array(t);
  if (e.length >= 12) {
    const i = e[0] === 82 && e[1] === 73 && e[2] === 70 && e[3] === 70, a = e[8] === 87 && e[9] === 69 && e[10] === 66 && e[11] === 80;
    if (i && a) return "image/webp";
  }
  return e.length >= 3 && e[0] === 255 && e[1] === 216 && e[2] === 255 ? "image/jpeg" : null;
}
function N(t) {
  const e = (t.type || "").toLowerCase();
  return e === z || e === "image/pix" || e.endsWith("+pixu");
}
async function et(t) {
  if (!N(t) && t.type && !t.type.startsWith("application/"))
    return t;
  const e = await t.arrayBuffer(), i = Ze(e);
  if (!i) {
    if (N(t) || !t.type)
      throw new Error("Invalid PIXU payload: expected WebP or JPEG bytes");
    return t;
  }
  return new Blob([e], { type: i });
}
async function le(t) {
  const e = await et(t);
  return URL.createObjectURL(e);
}
async function bt(t) {
  const e = await le(t), i = new Image();
  return i.decoding = "async", await new Promise((a, r) => {
    i.onload = () => a(), i.onerror = () => {
      URL.revokeObjectURL(e), r(new Error("Failed to decode PIXU image"));
    }, i.src = e;
  }), i;
}
async function tt(t, e) {
  const i = (e || t.type || "").toLowerCase();
  return i === z || i === "image/pix" || N(t) ? le(t) : URL.createObjectURL(t);
}
class Y {
  constructor() {
    this.aborted = !1, this.isCompressing = !1, this.plugins = new Ee();
  }
  async compress(e, i = {}) {
    if (this.aborted)
      throw new Error("Compression was aborted");
    if (this.isCompressing)
      throw new Error("Compression already in progress");
    const r = (e.type || "").toLowerCase().replace(/^image\/jpg$/, "image/jpeg");
    if (!re(r))
      throw new Error("File must be an image");
    let n = i;
    if (i.preset && (n = ke(i, i.preset)), n.validateImage) {
      const s = await se(e);
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
      let c = o;
      try {
        c = await this.plugins.runAfterCompress(o, n);
      } catch (f) {
        console.warn("Plugin afterCompress error:", f);
      }
      return c;
    } finally {
      this.isCompressing = !1;
    }
  }
  async performCompression(e, i) {
    var c, f, m, l, h, y, b, x;
    if (this.aborted)
      throw new Error("Compression was aborted");
    const a = e.size;
    i.monitorPerformance && new Ne(a);
    let r = null, n = 1, s = (e.type || "image/jpeg").toLowerCase();
    if (s === "image/jpg" && (s = "image/jpeg"), i.fixOrientation || i.stripMetadata)
      try {
        if (r = await e.arrayBuffer(), !r || r.byteLength === 0)
          throw new Error("Invalid image data");
        if (i.fixOrientation)
          try {
            n = Me(r), (!n || n < 1 || n > 8) && (n = 1);
          } catch (d) {
            console.warn("Failed to read EXIF orientation, using default:", d), n = 1;
          }
        if (i.stripMetadata)
          try {
            r = be(r);
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
      const d = await de(o), u = d.naturalWidth, w = d.naturalHeight;
      if (!u || !w || u <= 0 || w <= 0)
        throw new Error("Invalid image dimensions");
      const g = pe({
        naturalWidth: u,
        naturalHeight: w,
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
      let p = s;
      if (i.format && i.format !== "auto")
        p = i.format.toLowerCase(), p === "image/jpg" && (p = "image/jpeg");
      else if (i.format === "auto")
        if (te() && (s === "image/jpeg" || s === "image/png"))
          p = z;
        else if (s === "image/jpeg" || s === "image/png")
          try {
            if (typeof document < "u") {
              const v = document.createElement("canvas");
              v.width = 1, v.height = 1;
              const F = v.toDataURL("image/webp");
              F && F.indexOf("image/webp") === 5 ? p = "image/webp" : p = s;
            } else
              p = s;
          } catch {
            p = s;
          }
        else
          p = s;
      p === "image/png" && s !== "image/png" && !((c = i.optimizePNG) != null && c.enabled) && te() && (p = z), p = Qe(p), (!p || !re(p) && p !== z) && (p = "image/jpeg"), p === "image/jpg" && (p = "image/jpeg");
      let M = i.quality ?? 0.8;
      if (i.enableSmartQuality === !0 || p === z && i.enableSmartQuality !== !1)
        try {
          const v = ee(u, w), F = v.getContext("2d");
          if (F) {
            F.drawImage(d, 0, 0);
            const X = await $e(v);
            i.quality == null ? M = We(
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
        const v = ee(u, w), F = v.getContext("2d");
        F && (F.drawImage(d, 0, 0), E = Ae(v, {
          width: i.smartCrop.width,
          height: i.smartCrop.height,
          focus: i.smartCrop.focus
        }), g.width = E.width, g.height = E.height);
      }
      if (g.width <= 0 || g.height <= 0 || !isFinite(g.width) || !isFinite(g.height))
        throw new Error("Invalid canvas dimensions");
      const R = 16384;
      if (g.width > R || g.height > R)
        throw new Error(`Canvas dimensions too large (max ${R}px)`);
      const C = ee(g.width, g.height), P = C.getContext("2d", { willReadFrequently: !0 });
      if (!P)
        throw new Error("Failed to get canvas context");
      if (P.fillStyle = p === "image/jpeg" ? "#ffffff" : "transparent", P.fillRect(0, 0, g.width, g.height), i.beforeProcess && i.beforeProcess(P, C), this.aborted)
        throw new Error("Compression was aborted");
      const j = ye(n), D = i.resize || "none";
      let S;
      if ((D === "cover" || D === "contain") && (S = we(
        u,
        w,
        g.width,
        g.height,
        D
      )), E ? ne(P, d, {
        srcX: E.x,
        srcY: E.y,
        srcWidth: E.width,
        srcHeight: E.height,
        destX: 0,
        destY: 0,
        destWidth: g.width,
        destHeight: g.height,
        rotate: j.rotate,
        scaleX: j.scaleX,
        scaleY: j.scaleY
      }) : ne(P, d, {
        srcX: S == null ? void 0 : S.x,
        srcY: S == null ? void 0 : S.y,
        srcWidth: S == null ? void 0 : S.width,
        srcHeight: S == null ? void 0 : S.height,
        destX: 0,
        destY: 0,
        destWidth: g.width,
        destHeight: g.height,
        rotate: j.rotate,
        scaleX: j.scaleX,
        scaleY: j.scaleY
      }), i.enableNoiseAware && ve(P, C), i.enableColorWeighting && Pe(P, C), i.enableHdrToSdr && Ie(P, C), p === "image/png" && ((m = i.optimizePNG) != null && m.enabled))
        try {
          He(C, {
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
            Re(P, C, v);
          } catch (F) {
            console.warn("Filter application failed:", F);
          }
      if (i.watermark)
        try {
          Ge(P, C, i.watermark);
        } catch (v) {
          console.warn("Watermark application failed:", v);
        }
      if (i.convertToJPEG && p !== "image/jpeg")
        try {
          const v = await ce(C);
          Oe(p, v, a) && (P.fillStyle = "#ffffff", P.globalCompositeOperation = "destination-over", P.fillRect(0, 0, C.width, C.height), P.globalCompositeOperation = "source-over", p = "image/jpeg");
        } catch (v) {
          console.warn("Format conversion failed:", v);
        }
      i.afterProcess && i.afterProcess(P, C);
      try {
        await this.plugins.runTransform(C, i);
      } catch (v) {
        console.warn("Plugin transform error:", v);
      }
      if (this.aborted)
        throw new Error("Compression was aborted");
      i.onProgress && i.onProgress(0.8);
      let k;
      const L = Ce(i) && i.mode === "size" && i.targetSize, U = p;
      L && i.targetSize ? U === z ? k = await G(C, M, { adaptive: !0 }) : k = await this.dualPassCompression(C, U, M, a, i.targetSize) : U === z ? k = await G(C, M, {
        progressive: i.enableProgressive !== !1,
        adaptive: !0,
        chromaSubsampling: "4:2:0"
      }) : k = await W(C, U, M), U === z && (p = k.type === "image/jpeg" ? "image/jpeg" : "image/webp"), i.onProgress && i.onProgress(1);
      const B = e instanceof File ? e.name : "image", A = ae(p), Q = p === "image/jpg" ? "image/jpeg" : p, ie = new File([k], B.replace(/\.[^.]+$/, A), {
        type: Q,
        lastModified: Date.now()
      }), me = ie.size, he = i.strict !== !1;
      let _ = ie, T = me, $ = Q, V = M;
      const J = 0.15, fe = i.width !== void 0 && i.width !== u || i.height !== void 0 && i.height !== w || i.maxWidth !== void 0 && g.width < u || i.maxHeight !== void 0 && g.height < w || i.minWidth !== void 0 && g.width > u || i.minHeight !== void 0 && g.height > w || i.resize && i.resize !== "none", K = () => 1 - T / a;
      if (T >= a || K() < J) {
        const v = [0.72, 0.62, 0.52, 0.42, 0.32, 0.25], F = ($ === "image/png" || T >= a ? [z, "image/webp", "image/jpeg", $] : fe ? [$, "image/webp", "image/jpeg", z] : [z, "image/webp", "image/jpeg", $]).filter((O, q, H) => H.indexOf(O) === q);
        for (const O of F) {
          for (const q of v)
            try {
              const H = O === z ? await G(C, q, { adaptive: !0 }) : await W(C, O, q);
              if (H.size < T) {
                const Z = O === z ? H.type === "image/jpeg" ? "image/jpeg" : "image/webp" : O, ue = ae(Z);
                _ = new File(
                  [H],
                  B.replace(/\.[^.]+$/, ue),
                  { type: Z, lastModified: Date.now() }
                ), T = H.size, $ = Z, V = q;
              }
              if (K() >= J)
                break;
            } catch {
            }
          if (K() >= J)
            break;
        }
        const X = !!((h = (l = i.watermark) == null ? void 0 : l.text) != null && h.trim()) || !!((y = i.watermark) != null && y.image) || !!(i.filters && i.filters.length > 0) || !!((b = i.smartCrop) != null && b.enabled) || !!((x = i.optimizePNG) != null && x.enabled);
        T >= a && he && !X && (_ = e instanceof File ? e : new File([e], B, { type: s }), T = a, $ = s, V = 1);
      }
      const ge = Math.max(0, 1 - T / a);
      return {
        file: _,
        originalSize: a,
        compressedSize: T,
        compressionRatio: ge,
        format: $,
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
    let s = Math.max(0.1, Math.min(0.99, a)), o = await W(e, i, s), c = 0;
    const f = 10;
    for (; o.size > n && c < f; ) {
      const m = o.size / n;
      if (m > 2 ? s *= 0.7 : m > 1.5 ? s *= 0.8 : s *= 0.9, s = Math.max(0.1, Math.min(0.99, s)), o = await W(e, i, s), c++, s <= 0.1)
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
async function xt(t, e = {}) {
  const i = e.concurrency || 3, a = [], r = [], n = new Y();
  async function s(c, f) {
    try {
      const m = await n.compress(c, e);
      a[f] = m, e.onItemComplete && e.onItemComplete(m, f);
    } catch (m) {
      const l = m instanceof Error ? m : new Error("Unknown error");
      r[f] = l, e.onItemError && e.onItemError(l, f);
    }
  }
  const o = [];
  for (let c = 0; c < t.length; c += i)
    o.push(t.slice(c, c + i));
  for (const c of o)
    await Promise.all(
      c.map((f, m) => {
        const l = o.indexOf(c) * i + m;
        return s(f, l);
      })
    );
  if (r.length > 0 && !e.onItemError)
    throw new Error(`Batch compression failed for ${r.length} file(s)`);
  return a;
}
async function* Ct(t, e = {}) {
  const i = new Y();
  for await (const a of t) {
    const r = await i.compress(a, e);
    if (yield r, e.onChunk) {
      const n = r.file instanceof File ? new Blob([r.file]) : r.file;
      e.onChunk(n, 0);
    }
  }
}
async function it(t, e) {
  const i = t.getContext("2d");
  if (!i)
    throw new Error("Failed to get canvas context");
  const r = i.getImageData(0, 0, t.width, t.height).data, n = t.width, s = t.height, o = n * s, c = /* @__PURE__ */ new Map();
  let f = 0, m = 0;
  const l = 10;
  for (let C = 0; C < r.length; C += 4 * l) {
    const P = r[C], j = r[C + 1], D = r[C + 2];
    r[C + 3] < 255 && f++;
    const k = `${Math.floor(P / 8)}-${Math.floor(j / 8)}-${Math.floor(D / 8)}`;
    c.set(k, (c.get(k) || 0) + 1);
    const L = C / 4 % n, U = Math.floor(C / 4 / n);
    if (L > 0 && U > 0 && L < n - 1 && U < s - 1) {
      const B = (U * n + L) * 4, A = (U * n + (L + 1)) * 4;
      Math.abs(
        (r[B] + r[B + 1] + r[B + 2]) / 3 - (r[A] + r[A + 1] + r[A + 2]) / 3
      ) > 30 && m++;
    }
  }
  const h = o / l, y = c.size, b = y / h, x = m / h, d = f > h * 0.01;
  let u;
  b > 0.3 && x > 0.1 ? u = "photo" : b < 0.2 && x < 0.05 ? u = "graphic" : x > 0.15 && b < 0.4 ? u = "text" : u = "mixed";
  let w;
  b < 0.1 && x < 0.05 ? w = "low" : b > 0.5 || x > 0.2 ? w = "high" : w = "medium";
  let g = 0.5;
  e && (g = 1 - n * s * 4 / e);
  let p;
  g > 0.8 ? p = "very-high" : g > 0.5 ? p = "high" : g > 0.2 ? p = "medium" : p = "low";
  let M;
  d ? M = "image/png" : u === "photo" && w === "high" ? M = "image/webp" : u === "photo" ? M = "image/jpeg" : M = "image/png";
  let I;
  u === "graphic" || u === "text" ? I = 0.9 : u === "photo" && w === "high" ? I = 0.75 : I = 0.8;
  const E = Math.min(0.9, g + 0.3), R = [];
  return d && M === "image/jpeg" && R.push("Consider converting to PNG to preserve transparency"), y < 256 && u === "graphic" && R.push("Image can benefit from color reduction"), g < 0.3 && R.push("High compression potential - consider lower quality"), (n > 1920 || s > 1080) && R.push("Consider resizing for web use"), {
    quality: p,
    compressionLevel: g,
    contentType: u,
    hasText: u === "text",
    complexity: w,
    colorCount: y,
    hasTransparency: d,
    recommendedFormat: M,
    recommendedQuality: I,
    estimatedSizeReduction: E,
    suggestions: R
  };
}
async function vt(t, e, i) {
  const a = [], r = await it(e, t.size);
  t.type === "image/png" && !await ce(e) && t.size > 5e5 && a.push({
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
function Pt(t, e) {
  let i = 0;
  return e.quality && e.quality < 0.9 && (i += (0.9 - e.quality) * 0.5), (e.maxWidth || e.maxHeight) && (i += 0.3), e.stripMetadata && (i += 0.05), (e.format === "image/webp" || e.format === "image/avif") && (i += 0.2), Math.min(0.9, i);
}
async function It(t, e) {
  const i = e.widths || [320, 640, 960, 1280, 1920], a = e.formats || ["image/webp", "image/jpeg"];
  e.quality;
  const r = [], n = [];
  for (const s of a) {
    const o = [];
    for (const c of i)
      o.push(`image-${c}w.${s.split("/")[1]} ${c}w`);
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
function Et(t) {
  return t.map((e) => `${e.url} ${e.width}w`).join(", ");
}
function St(t) {
  const e = [];
  for (let i = 0; i < t.length - 1; i++)
    e.push(`(max-width: ${t[i]}px) ${t[i]}px`);
  return e.push(`${t[t.length - 1]}px`), e.join(", ");
}
function zt(t) {
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
function kt(t, e) {
  const i = t.getImageData(0, 0, e.width, e.height), a = i.data;
  for (let r = 0; r < a.length; r += 4)
    ;
  t.putImageData(i, 0, 0);
}
function Rt() {
  if (typeof document > "u")
    return !1;
  const t = document.createElement("canvas");
  try {
    return t.getContext("2d", { colorSpace: "display-p3" }) !== null;
  } catch {
    return !1;
  }
}
function jt(t) {
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
function Dt() {
  return typeof document < "u" && typeof HTMLCanvasElement < "u";
}
class Ut {
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
      onItemComplete: c,
      onItemError: f
    } = i, m = this.sortByPriority(e, s), l = new Array(e.length), h = [], y = /* @__PURE__ */ new Map();
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
      let w = null;
      for (let g = 0; g <= r; g++)
        try {
          const {
            retryAttempts: p,
            retryDelay: M,
            priority: I,
            onProgress: E,
            pause: R,
            resume: C,
            onItemComplete: P,
            onItemError: j,
            concurrency: D,
            ...S
          } = i, k = await this.compressor.compress(d, S);
          l[u] = k, this.completedCount++, c && c(k, u), o && o(
            this.completedCount,
            e.length,
            this.errorCount
          );
          return;
        } catch (p) {
          w = p instanceof Error ? p : new Error("Unknown error"), g < r && await new Promise((M) => setTimeout(M, n));
        }
      this.errorCount++, h[u] = w, f && f(w, u), o && o(
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
          const w = y.get(u);
          return b(u, w);
        })
      );
    }
    if (h.length > 0 && !f)
      throw new Error(`Batch compression failed for ${h.length} file(s)`);
    return l;
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
function rt() {
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
function Ft(t) {
  return t > 10 * 1024 * 1024;
}
function Lt(t, e) {
  const i = e || rt().available, a = Math.min(i * 0.1, 5 * 1024 * 1024);
  return Math.max(a, 1024 * 1024);
}
const Tt = [
  "image/webp",
  "image/jpeg"
], oe = {
  [z]: ".webp",
  "image/pix": ".webp",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif"
};
function at(t) {
  const e = String(t || "image/jpeg").toLowerCase().trim();
  if (oe[e])
    return oe[e];
  if (e.includes("/")) {
    const i = e.split("/")[1] || "";
    return i === "jpeg" ? ".jpg" : i ? `.${i}` : ".jpg";
  }
  return e.startsWith(".") ? e : e ? `.${e}` : ".jpg";
}
function nt(t, e) {
  return `${String(t || "compressed").replace(/\.[^.]+$/, "")}${at(e)}`;
}
function ot(t, e) {
  const i = (t || "").toLowerCase();
  return e === "image/webp" ? i === "image/webp" : i === "image/jpeg" || i === "image/jpg";
}
async function st(t, e, i = 0.92) {
  if (!N(t) && ot(t.type, e))
    return t;
  const a = await tt(t);
  try {
    const r = await new Promise((o, c) => {
      const f = new Image();
      f.decoding = "async", f.onload = () => o(f), f.onerror = () => c(new Error("Failed to decode image for download")), f.src = a;
    }), n = document.createElement("canvas");
    n.width = r.naturalWidth, n.height = r.naturalHeight;
    const s = n.getContext("2d");
    if (!s)
      throw new Error("Failed to get canvas context");
    return e === "image/jpeg" && (s.fillStyle = "#ffffff", s.fillRect(0, 0, n.width, n.height)), s.drawImage(r, 0, 0), W(n, e, i);
  } finally {
    URL.revokeObjectURL(a);
  }
}
function ct(t, e) {
  const i = URL.createObjectURL(t), a = document.createElement("a");
  a.href = i, a.download = e, document.body.appendChild(a), a.click(), document.body.removeChild(a), URL.revokeObjectURL(i);
}
async function Bt(t, e, i, a = 0.92) {
  const r = await st(t, i, a);
  ct(r, nt(e, i));
}
const lt = new Y();
async function $t(t, e) {
  return lt.compress(t, e);
}
export {
  Ut as AdvancedBatchProcessor,
  Tt as DOWNLOAD_IMAGE_FORMATS,
  Ye as PIXU_EXTENSION,
  z as PIXU_MIME_TYPE,
  pt as PIX_EXTENSION,
  dt as PIX_MIME_TYPE,
  Ne as PerformanceMonitor,
  Y as PixuCompressor,
  Ee as PluginManager,
  zt as analyzeColorSpace,
  it as analyzeImage,
  $e as analyzeImageContent,
  Re as applyFilter,
  ke as applyPreset,
  Ge as applyWatermark,
  nt as buildDownloadName,
  Lt as calculateChunkSize,
  Ae as calculateSmartCrop,
  yt as canvasToPix,
  G as canvasToPixu,
  $t as compress,
  xt as compressBatch,
  Ct as compressStream,
  ft as convertFormat,
  le as createPixuObjectURL,
  tt as createPreviewObjectURL,
  lt as default,
  Ze as detectPixuPayloadMime,
  ce as detectTransparency,
  Bt as downloadImageAs,
  Pt as estimateCompressionSavings,
  Mt as estimatePixCompression,
  Ke as estimatePixuCompression,
  gt as formatBytes,
  ut as formatDuration,
  It as generateResponsiveImages,
  St as generateSizes,
  Et as generateSrcset,
  rt as getMemoryInfo,
  vt as getOptimizationHints,
  at as getOutputExtension,
  ze as getPresetOptions,
  We as getSmartQuality,
  wt as isPixSupported,
  N as isPixuBlob,
  te as isPixuSupported,
  jt as isProgressiveJPEG,
  ht as isValidImage,
  bt as loadPixuImage,
  Qe as normalizePixuFormat,
  kt as normalizeToSRGB,
  He as optimizePNG,
  et as pixuToDisplayBlob,
  Oe as shouldConvertToJPEG,
  Ft as shouldUseStreaming,
  Dt as supportsProgressiveJPEG,
  Rt as supportsWideGamut,
  st as toDownloadableBlob,
  ct as triggerBlobDownload,
  se as validateImage
};
//# sourceMappingURL=pixu.esm.js.map
