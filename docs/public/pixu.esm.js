function J(i) {
  if (!i || typeof i != "string")
    return !1;
  const e = i.toLowerCase().replace(/^image\/jpg$/, "image/jpeg");
  return e === "image/pixu" || e === "image/pix" ? !0 : /^image\/(jpeg|png|webp|avif|gif|bmp|svg\+xml)$/i.test(e);
}
function ae(i) {
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
function ne(i) {
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
    }, s = setTimeout(() => {
      r || (r = !0, n(), t(new Error("Image loading timeout")));
    }, 3e4);
    a.onload = () => {
      clearTimeout(s), r || (r = !0, n(), e(a));
    }, a.onerror = () => {
      clearTimeout(s), r || (r = !0, n(), t(new Error("Failed to load image")));
    }, a.src = i;
  });
}
function oe(i) {
  const {
    naturalWidth: e,
    naturalHeight: t,
    maxWidth: a,
    maxHeight: r,
    minWidth: n = 0,
    minHeight: s = 0,
    width: o,
    height: l,
    mode: f
  } = i, m = e / t;
  let c = e, h = t;
  if (f === "none")
    o !== void 0 && (c = o), l !== void 0 && (h = l), o !== void 0 && l === void 0 ? h = c / m : l !== void 0 && o === void 0 && (c = h * m);
  else if (f === "contain")
    if (o && l) {
      const u = o / l;
      m > u ? (c = o, a !== void 0 && (c = Math.min(c, a)), h = c / m) : (h = l, r !== void 0 && (h = Math.min(h, r)), c = h * m);
    } else o ? (c = o, a !== void 0 && (c = Math.min(c, a)), h = c / m) : l ? (h = l, r !== void 0 && (h = Math.min(h, r)), c = h * m) : (a !== void 0 || r !== void 0) && (a !== void 0 && r !== void 0 ? e / t > a / r ? (c = a, h = c / m) : (h = r, c = h * m) : a !== void 0 ? e > a && (c = a, h = c / m) : r !== void 0 && t > r && (h = r, c = h * m));
  else if (f === "cover")
    if (o && l) {
      const u = o / l;
      m > u ? (h = l, r !== void 0 && (h = Math.min(h, r)), c = h * m) : (c = o, a !== void 0 && (c = Math.min(c, a)), h = c / m);
    } else o ? (c = o, a !== void 0 && (c = Math.min(c, a)), h = c / m) : l ? (h = l, r !== void 0 && (h = Math.min(h, r)), c = h * m) : (a !== void 0 || r !== void 0) && (a !== void 0 && r !== void 0 ? e / t > a / r ? (c = a, h = c / m) : (h = r, c = h * m) : a !== void 0 ? e > a && (c = a, h = c / m) : r !== void 0 && t > r && (h = r, c = h * m));
  else if (f === "fit")
    if (o && l) {
      const u = o / l;
      m > u ? (c = o, a !== void 0 && (c = Math.min(c, a)), h = c / m) : (h = l, r !== void 0 && (h = Math.min(h, r)), c = h * m);
    } else o ? (c = o, a !== void 0 && (c = Math.min(c, a)), h = c / m) : l ? (h = l, r !== void 0 && (h = Math.min(h, r)), c = h * m) : (a !== void 0 || r !== void 0) && (a !== void 0 && r !== void 0 ? e / t > a / r ? (c = a, h = c / m) : (h = r, c = h * m) : a !== void 0 ? e > a && (c = a, h = c / m) : r !== void 0 && t > r && (h = r, c = h * m));
  else f === "fill" && (c = o ?? e, h = l ?? t);
  return n !== void 0 && n > 0 && (c = Math.max(c, n)), s !== void 0 && s > 0 && (h = Math.max(h, s)), a !== void 0 && (c = Math.min(c, a)), r !== void 0 && (h = Math.min(h, r)), {
    width: Math.round(c),
    height: Math.round(h)
  };
}
function se(i, e, t, a, r) {
  const n = i / e, s = t / a;
  let o = i, l = e, f = 0, m = 0;
  return r === "cover" ? n > s ? (l = e, o = l * s, f = (i - o) / 2) : (o = i, l = o / s, m = (e - l) / 2) : (r === "contain" || r === "fit") && (n > s ? (o = i, l = o / s, m = (e - l) / 2) : (l = e, o = l * s, f = (i - o) / 2)), {
    x: Math.round(f),
    y: Math.round(m),
    width: Math.round(o),
    height: Math.round(l)
  };
}
function ce(i) {
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
function le(i) {
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
      let s = 0;
      const o = 1e3;
      for (; a + 1 < n && s < o && (s++, !(a >= r - 1)); ) {
        if (e.getUint8(a) === 255 && e.getUint8(a + 1) === 225) {
          const l = a + 4;
          if (l + 4 >= r)
            break;
          if (me(e, l, 4) === "Exif") {
            const f = a + 10;
            if (f + 8 >= r)
              break;
            const m = e.getUint16(f), c = m === 18761;
            if ((c || m === 19789) && e.getUint16(f + 2, c) === 42) {
              const h = e.getUint32(f + 4, c);
              if (h >= 8 && h < 1048576 && // Max 1MB offset
              f + h + 12 < r) {
                const u = f + h, g = e.getUint16(u, c), d = Math.min(g, 100);
                for (let w = 0; w < d; w++) {
                  const p = u + w * 12 + 2;
                  if (p + 10 >= r)
                    break;
                  if (e.getUint16(p, c) === 274) {
                    t = e.getUint16(p + 8, c), (t < 1 || t > 8) && (t = 1);
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
function he(i) {
  if (!i || i.byteLength < 2 || i.byteLength > 10 * 1024 * 1024)
    return i;
  const e = new DataView(i), t = new Uint8Array(i), a = new Array(i.byteLength);
  let r = 0, n = 0, s = 0;
  const o = 1e4;
  if (e.getUint8(0) !== 255 || e.getUint8(1) !== 216)
    return i;
  for (a[r++] = 255, a[r++] = 216, n = 2; n < t.length && s < o && (s++, !(n >= t.length - 1)); ) {
    if (t[n] === 255) {
      const l = t[n + 1];
      if (l === void 0)
        break;
      if (l === 224 || l === 225) {
        if (n + 3 >= t.length)
          break;
        const f = t[n + 2] << 8 | t[n + 3];
        if (f < 2 || f > 65535)
          break;
        if (l === 225) {
          if (n += f + 2, n > t.length)
            break;
          continue;
        }
      }
      if (l === 218) {
        const f = t.length - n;
        for (let m = 0; m < f; m++)
          a[r++] = t[n + m];
        break;
      }
    }
    if (t[n] === 255 && n + 3 < t.length) {
      const l = t[n + 2] << 8 | t[n + 3];
      if (l < 2 || l > 65535 || n + l + 2 > t.length)
        break;
      const f = n + l + 2;
      for (let m = n; m < f; m++)
        a[r++] = t[m];
      n += l + 2;
    } else
      a[r++] = t[n], n++;
  }
  return new Uint8Array(a.slice(0, r)).buffer;
}
function me(i, e, t) {
  let a = "";
  for (let r = 0; r < t; r++)
    a += String.fromCharCode(i.getUint8(e + r));
  return a;
}
function fe(i) {
  return i.enableDualPass === !1 ? !1 : i.enableDualPass === !0 ? !0 : (i.targetSize ? i.targetSize : 0) / (1024 * 1024) > 2 || i.mode === "size";
}
function ge(i, e) {
  const t = i.getImageData(0, 0, e.width, e.height), a = t.data;
  for (let r = 0; r < a.length; r += 4) {
    const n = a[r], s = a[r + 1], o = a[r + 2], l = n * 0.299 + s * 0.587 + o * 0.114, f = 10;
    Math.abs(n - l) < f && (a[r] = l), Math.abs(s - l) < f && (a[r + 1] = l), Math.abs(o - l) < f && (a[r + 2] = l);
  }
  i.putImageData(t, 0, 0);
}
function ue(i, e) {
  const t = i.getImageData(0, 0, e.width, e.height), a = t.data;
  for (let r = 0; r < a.length; r += 4) {
    const n = a[r], s = a[r + 1], o = a[r + 2], f = n * 0.2126 + s * 0.7152 + o * 0.0722 > 128 ? 1.05 : 0.95;
    a[r] = Math.min(255, n * f), a[r + 1] = Math.min(255, s * f), a[r + 2] = Math.min(255, o * f);
  }
  i.putImageData(t, 0, 0);
}
function de(i, e) {
  const t = i.getImageData(0, 0, e.width, e.height), a = t.data, r = 0.8;
  for (let n = 0; n < a.length; n += 4)
    a[n] = Math.min(255, a[n] * r), a[n + 1] = Math.min(255, a[n + 1] * r), a[n + 2] = Math.min(255, a[n + 2] * r);
  i.putImageData(t, 0, 0);
}
function H(i, e, t) {
  return new Promise((a, r) => {
    const n = e === "image/jpeg" || e === "image/jpg" || e === "image/webp";
    let s;
    if (n && t !== void 0 && t !== null && (s = Math.max(0, Math.min(1, t)), s >= 0.99 && (s = 0.99)), i.toBlob)
      i.toBlob(
        (o) => {
          o ? a(o) : r(new Error("Failed to convert canvas to blob"));
        },
        e,
        s
      );
    else {
      const o = i.toDataURL(e, s), l = atob(o.split(",")[1]), f = o.split(",")[0].split(":")[1].split(";")[0], m = new ArrayBuffer(l.length), c = new Uint8Array(m);
      for (let h = 0; h < l.length; h++)
        c[h] = l.charCodeAt(h);
      a(new Blob([m], { type: f }));
    }
  });
}
function V(i, e) {
  const t = document.createElement("canvas");
  return t.width = i, t.height = e, t;
}
function K(i, e, t) {
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
    scaleY: u = 1
  } = t || {};
  if (i.save(), c !== 0 || h !== 1 || u !== 1) {
    const g = o + f / 2, d = l + m / 2;
    i.translate(g, d), i.rotate(c * Math.PI / 180), i.scale(h, u), i.drawImage(
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
    i.drawImage(
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
  i.restore();
}
class pe {
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
const we = {
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
function ye(i) {
  const e = we[i];
  if (!e)
    throw new Error(`Unknown preset: ${i}`);
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
function Me(i, e) {
  const t = ye(e);
  return {
    ...t,
    ...i,
    // Preserve user's quality if specified
    quality: i.quality ?? t.quality
  };
}
function xe(i, e, t, a) {
  let r, n;
  typeof t == "string" ? (r = t, n = a ?? 1) : (r = t.type, n = t.value ?? 1);
  const s = i.getImageData(0, 0, e.width, e.height), o = s.data;
  switch (r) {
    case "grayscale":
      be(o);
      break;
    case "sepia":
      Ce(o);
      break;
    case "vintage":
      ve(o);
      break;
    case "brightness":
      Ie(o, n);
      break;
    case "contrast":
      Pe(o, n);
      break;
    case "saturation":
      ze(o, n);
      break;
    case "blur":
      i.filter = `blur(${n}px)`;
      const l = document.createElement("canvas");
      l.width = e.width, l.height = e.height;
      const f = l.getContext("2d");
      f && (f.drawImage(e, 0, 0), i.clearRect(0, 0, e.width, e.height), i.filter = "none", i.drawImage(l, 0, 0));
      return;
    case "sharpen":
      Ee(i, e, n);
      return;
  }
  i.putImageData(s, 0, 0);
}
function be(i) {
  for (let e = 0; e < i.length; e += 4) {
    const t = i[e] * 0.299 + i[e + 1] * 0.587 + i[e + 2] * 0.114;
    i[e] = t, i[e + 1] = t, i[e + 2] = t;
  }
}
function Ce(i) {
  for (let e = 0; e < i.length; e += 4) {
    const t = i[e], a = i[e + 1], r = i[e + 2];
    i[e] = Math.min(255, t * 0.393 + a * 0.769 + r * 0.189), i[e + 1] = Math.min(255, t * 0.349 + a * 0.686 + r * 0.168), i[e + 2] = Math.min(255, t * 0.272 + a * 0.534 + r * 0.131);
  }
}
function ve(i) {
  for (let e = 0; e < i.length; e += 4) {
    const t = i[e] * 0.3 + i[e + 1] * 0.59 + i[e + 2] * 0.11;
    i[e] = Math.min(255, i[e] * 0.7 + t * 0.3), i[e + 1] = Math.min(255, i[e + 1] * 0.7 + t * 0.3), i[e + 2] = Math.min(255, i[e + 2] * 0.7 + t * 0.3), i[e] = Math.min(255, i[e] * 1.1), i[e + 2] = Math.min(255, i[e + 2] * 0.9);
  }
}
function Ie(i, e) {
  const t = (e - 0.5) * 2;
  for (let a = 0; a < i.length; a += 4)
    i[a] = Math.max(0, Math.min(255, i[a] + t * 128)), i[a + 1] = Math.max(0, Math.min(255, i[a + 1] + t * 128)), i[a + 2] = Math.max(0, Math.min(255, i[a + 2] + t * 128));
}
function Pe(i, e) {
  const t = (e - 0.5) * 2, a = 128 * (1 - t);
  for (let r = 0; r < i.length; r += 4)
    i[r] = Math.max(0, Math.min(255, i[r] * t + a)), i[r + 1] = Math.max(0, Math.min(255, i[r + 1] * t + a)), i[r + 2] = Math.max(0, Math.min(255, i[r + 2] * t + a));
}
function ze(i, e) {
  for (let t = 0; t < i.length; t += 4) {
    const a = i[t] * 0.299 + i[t + 1] * 0.587 + i[t + 2] * 0.114;
    i[t] = Math.max(0, Math.min(255, a + (i[t] - a) * e)), i[t + 1] = Math.max(0, Math.min(255, a + (i[t + 1] - a) * e)), i[t + 2] = Math.max(0, Math.min(255, a + (i[t + 2] - a) * e));
  }
}
function Ee(i, e, t) {
  const a = i.getImageData(0, 0, e.width, e.height), r = a.data, n = e.width, s = e.height, o = [
    0,
    -t,
    0,
    -t,
    1 + 4 * t,
    -t,
    0,
    -t,
    0
  ], l = new Uint8ClampedArray(r);
  for (let f = 1; f < s - 1; f++)
    for (let m = 1; m < n - 1; m++)
      for (let c = 0; c < 3; c++) {
        let h = 0;
        for (let g = -1; g <= 1; g++)
          for (let d = -1; d <= 1; d++) {
            const w = ((f + g) * n + (m + d)) * 4 + c, p = o[(g + 1) * 3 + (d + 1)];
            h += l[w] * p;
          }
        const u = (f * n + m) * 4 + c;
        r[u] = Math.max(0, Math.min(255, h));
      }
  i.putImageData(a, 0, 0);
}
async function Z(i) {
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
function Ge(i) {
  return Z(i).then((e) => e.isValid);
}
async function Se(i) {
  const e = i.getContext("2d");
  if (!e)
    return {
      isPhoto: !0,
      isGraphic: !1,
      hasText: !1,
      complexity: "medium",
      recommendedQuality: 0.8
    };
  const a = e.getImageData(0, 0, i.width, i.height).data, r = i.width, n = i.height, s = r * n;
  let o = 0;
  const l = /* @__PURE__ */ new Map();
  let f = 0;
  const m = 10;
  for (let b = 0; b < a.length; b += 4 * m) {
    const x = a[b], M = a[b + 1], I = a[b + 2];
    if (a[b + 3] < 255)
      continue;
    const v = `${Math.floor(x / 16)}-${Math.floor(M / 16)}-${Math.floor(I / 16)}`;
    l.has(v) || (o++, l.set(v, 1));
    const P = b / 4 % r, T = Math.floor(b / 4 / r);
    if (P > 0 && T > 0 && P < r - 1 && T < n - 1) {
      const D = (T * r + P) * 4, E = (T * r + (P + 1)) * 4;
      Math.abs(
        (a[D] + a[D + 1] + a[D + 2]) / 3 - (a[E] + a[E + 1] + a[E + 2]) / 3
      ) > 30 && f++;
    }
  }
  const c = s / m, h = o / c, u = f / c, g = h > 0.3 && u > 0.1, d = h < 0.2 && u < 0.05, w = u > 0.15 && h < 0.4;
  let p;
  h < 0.1 && u < 0.05 ? p = "low" : h > 0.5 || u > 0.2 ? p = "high" : p = "medium";
  let y;
  return d || w ? y = 0.9 : g && p === "high" ? y = 0.75 : g && p === "low" ? y = 0.85 : y = 0.8, {
    isPhoto: g,
    isGraphic: d,
    hasText: w,
    complexity: p,
    recommendedQuality: y
  };
}
function ke(i, e) {
  return i.quality !== void 0 && i.quality !== null ? i.quality : e.recommendedQuality;
}
async function Qe(i, e, t = {}) {
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
async function ee(i) {
  let e, t;
  if (i instanceof HTMLImageElement) {
    if (e = document.createElement("canvas"), e.width = i.naturalWidth, e.height = i.naturalHeight, t = e.getContext("2d"), !t)
      return !1;
    t.drawImage(i, 0, 0);
  } else if (e = i, t = e.getContext("2d"), !t)
    return !1;
  const r = t.getImageData(0, 0, e.width, e.height).data, n = 100;
  for (let s = 3; s < r.length; s += 4 * n)
    if (r[s] < 255)
      return !0;
  return !1;
}
function De(i, e, t) {
  return i === "image/jpeg" || i === "image/jpg" || i === "image/png" && e ? !1 : i === "image/png" && t > 5e5;
}
function Re(i, e = {}) {
  const t = i.getContext("2d");
  if (!t)
    return i;
  const a = t.getImageData(0, 0, i.width, i.height), r = a.data, n = /* @__PURE__ */ new Map();
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
      const [c, h, u] = m.split("-").map(Number);
      f.set(m, [c, h, u]);
    });
    for (let m = 0; m < r.length; m += 4) {
      const c = r[m], h = r[m + 1], u = r[m + 2];
      let g = 1 / 0, d = [c, h, u];
      for (const [w, p] of f.entries()) {
        const y = Math.sqrt(
          Math.pow(c - p[0], 2) + Math.pow(h - p[1], 2) + Math.pow(u - p[2], 2)
        );
        y < g && (g = y, d = p);
      }
      r[m] = d[0], r[m + 1] = d[1], r[m + 2] = d[2];
    }
  }
  if (e.optimizeTransparency && s > 0)
    for (let o = 0; o < r.length; o += 4)
      r[o + 3] === 0 && (r[o] = 0, r[o + 1] = 0, r[o + 2] = 0);
  return t.putImageData(a, 0, 0), i;
}
function Fe(i, e) {
  const t = i.getContext("2d");
  if (!t)
    return { x: 0, y: 0, width: i.width, height: i.height };
  const r = t.getImageData(0, 0, i.width, i.height).data, n = i.width, s = i.height;
  let o = 0, l = 0, f = 0;
  const m = 5;
  for (let M = 0; M < s; M += m)
    for (let I = 0; I < n; I += m) {
      const k = (M * n + I) * 4, v = r[k], P = r[k + 1], T = r[k + 2];
      if (r[k + 3] < 128) continue;
      const E = (v + P + T) / 3;
      let L = 0;
      if (I > 0 && I < n - 1 && M > 0 && M < s - 1) {
        const j = (M * n + (I + 1)) * 4, U = ((M + 1) * n + I) * 4;
        L = Math.abs(
          (r[j] + r[j + 1] + r[j + 2]) / 3 - E
        ) + Math.abs(
          (r[U] + r[U + 1] + r[U + 2]) / 3 - E
        );
      }
      const R = E * 0.5 + L * 0.5;
      o += R, l += I * R, f += M * R;
    }
  const c = o > 0 ? l / o : n / 2, h = o > 0 ? f / o : s / 2;
  let u = c, g = h;
  switch (e.focus) {
    case "top":
      g = s * 0.25;
      break;
    case "bottom":
      g = s * 0.75;
      break;
    case "left":
      u = n * 0.25;
      break;
    case "right":
      u = n * 0.75;
      break;
  }
  const d = e.width / e.height, w = n / s;
  let p, y;
  d > w ? (y = s, p = s * d) : (p = n, y = n / d), p = Math.min(p, n), y = Math.min(y, s);
  let b = u - p / 2, x = g - y / 2;
  return b = Math.max(0, Math.min(b, n - p)), x = Math.max(0, Math.min(x, s - y)), {
    x: Math.floor(b),
    y: Math.floor(x),
    width: Math.floor(p),
    height: Math.floor(y)
  };
}
function Te(i, e, t) {
  const {
    text: a,
    image: r,
    position: n = "bottom-right",
    opacity: s = 0.7,
    fontSize: o = 16,
    fontFamily: l = "Arial",
    color: f = "#ffffff",
    padding: m = 10,
    scale: c = 0.2,
    rotation: h = 0
  } = t;
  i.save(), i.globalAlpha = s;
  let u = 0, g = 0;
  switch (n) {
    case "top-left":
      u = m, g = m;
      break;
    case "top-right":
      u = e.width - m, g = m;
      break;
    case "bottom-left":
      u = m, g = e.height - m;
      break;
    case "bottom-right":
      u = e.width - m, g = e.height - m;
      break;
    case "center":
      u = e.width / 2, g = e.height / 2;
      break;
  }
  if (h !== 0 && (i.translate(u, g), i.rotate(h * Math.PI / 180), i.translate(-u, -g)), a && (i.font = `${o}px ${l}`, i.fillStyle = f, i.textAlign = n.includes("right") ? "right" : n.includes("left") ? "left" : "center", i.textBaseline = n.includes("bottom") ? "bottom" : n.includes("top") ? "top" : "middle", i.fillText(a, u, g)), r) {
    const d = r.width * c, w = r.height * c;
    let p = u, y = g;
    n.includes("right") ? p = u - d : n === "center" && (p = u - d / 2), n.includes("bottom") ? y = g - w : n === "center" && (y = g - w / 2), i.drawImage(r, p, y, d, w);
  }
  i.restore();
}
class je {
  constructor(e) {
    this.metrics = {
      startTime: performance.now(),
      originalSize: e,
      compressedSize: 0,
      compressionRatio: 0
    }, this.startMemory = this.getCurrentMemory();
  }
  recordCompression(e) {
    const t = performance.now(), a = t - this.metrics.startTime, r = 1 - e / this.metrics.originalSize, n = this.metrics.originalSize / (a / 1e3), s = this.getCurrentMemory(), o = s - this.startMemory;
    return this.metrics = {
      ...this.metrics,
      endTime: t,
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
function Ye(i) {
  if (!Number.isFinite(i) || i === 0) return "0 B";
  const e = i < 0 ? "-" : "", t = Math.abs(i), a = 1024, r = ["B", "KB", "MB", "GB"], n = Math.min(r.length - 1, Math.floor(Math.log(t) / Math.log(a)));
  return `${e}${Math.round(t / Math.pow(a, n) * 100) / 100} ${r[n]}`;
}
function Ne(i) {
  return i < 1e3 ? `${Math.round(i)}ms` : i < 6e4 ? `${(i / 1e3).toFixed(2)}s` : `${(i / 6e4).toFixed(2)}min`;
}
const z = "image/pixu", Ue = ".pixu", Ve = z, _e = Ue;
function _() {
  return !0;
}
const Je = _;
function $e(i) {
  return i === "image/pix" ? z : i;
}
async function X(i, e = 0.85, t = {}) {
  const {
    adaptive: a = !0
  } = t, r = i.getContext("2d", {
    willReadFrequently: !0,
    colorSpace: "srgb"
  });
  if (!r)
    throw new Error("Failed to get canvas context");
  const n = i.width, s = i.height, l = r.getImageData(0, 0, n, s).data;
  let f = e;
  a && (f = Le(l, n, s, e));
  const m = Be(f, l), c = Math.max(0.5, Math.min(0.95, m));
  try {
    const h = await H(i, "image/webp", c);
    return new Blob([h], { type: z });
  } catch {
    const h = Math.max(0.6, c), u = await H(i, "image/jpeg", h);
    return new Blob([u], { type: z });
  }
}
const Ke = X;
function Le(i, e, t, a) {
  let r = 0, n = 0;
  const s = 8, o = Math.floor(e / s), l = Math.floor(t / s);
  for (let h = 0; h < l; h++)
    for (let u = 0; u < o; u++) {
      const g = We(
        i,
        e,
        t,
        u * s,
        h * s,
        s
      );
      g > 500 ? r++ : g < 100 && n++;
    }
  const f = o * l, m = r / f, c = n / f;
  return m > 0.3 ? Math.max(0.6, a - 0.1) : c > 0.5 ? Math.max(0.5, a - 0.15) : a;
}
function We(i, e, t, a, r, n) {
  let s = 0, o = 0, l = 0;
  for (let m = r; m < Math.min(r + n, t); m++)
    for (let c = a; c < Math.min(a + n, e); c++) {
      const h = (m * e + c) * 4, u = i[h], g = i[h + 1], d = i[h + 2], w = 0.299 * u + 0.587 * g + 0.114 * d;
      s += w, o += w * w, l++;
    }
  if (l === 0) return 0;
  const f = s / l;
  return o / l - f * f;
}
function Be(i, e, t, a) {
  let r = 0, n = 0;
  for (let o = 0; o < e.length; o += 4) {
    const l = e[o], f = e[o + 1], m = e[o + 2], c = Math.max(l, f, m), h = Math.min(l, f, m);
    (c === 0 ? 0 : (c - h) / c) > 0.5 && r++, n++;
  }
  const s = r / n;
  return s < 0.2 ? Math.max(0.5, i - 0.08) : (s > 0.6, i);
}
function He(i, e, t, a) {
  const n = 1 - e, s = Math.min(1, t * a / (1920 * 1080)), o = 0.7 - n * 0.2 + s * 0.1;
  return Math.max(0.4, Math.min(0.8, o));
}
const Ze = He;
class G {
  constructor() {
    this.aborted = !1, this.isCompressing = !1, this.plugins = new pe();
  }
  async compress(e, t = {}) {
    if (this.aborted)
      throw new Error("Compression was aborted");
    if (this.isCompressing)
      throw new Error("Compression already in progress");
    const r = (e.type || "").toLowerCase().replace(/^image\/jpg$/, "image/jpeg");
    if (!J(r))
      throw new Error("File must be an image");
    let n = t;
    if (t.preset && (n = Me(t, t.preset)), n.validateImage) {
      const s = await Z(e);
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
  async performCompression(e, t) {
    var l, f, m;
    if (this.aborted)
      throw new Error("Compression was aborted");
    const a = e.size;
    t.monitorPerformance && new je(a);
    let r = null, n = 1, s = (e.type || "image/jpeg").toLowerCase();
    if (s === "image/jpg" && (s = "image/jpeg"), t.fixOrientation || t.stripMetadata)
      try {
        if (r = await e.arrayBuffer(), !r || r.byteLength === 0)
          throw new Error("Invalid image data");
        if (t.fixOrientation)
          try {
            n = le(r), (!n || n < 1 || n > 8) && (n = 1);
          } catch (c) {
            console.warn("Failed to read EXIF orientation, using default:", c), n = 1;
          }
        if (t.stripMetadata)
          try {
            r = he(r);
          } catch (c) {
            console.warn("Failed to strip EXIF, continuing with original:", c);
          }
      } catch (c) {
        console.warn("Failed to process image buffer, continuing without EXIF processing:", c), r = null, n = 1;
      }
    let o;
    if (r) {
      const c = new Blob([r], { type: s });
      o = URL.createObjectURL(c);
    } else
      o = URL.createObjectURL(e);
    try {
      const c = await ne(o), h = c.naturalWidth, u = c.naturalHeight;
      if (!h || !u || h <= 0 || u <= 0)
        throw new Error("Invalid image dimensions");
      const g = oe({
        naturalWidth: h,
        naturalHeight: u,
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
      let d = s;
      if (t.format && t.format !== "auto")
        d = t.format.toLowerCase(), d === "image/jpg" && (d = "image/jpeg");
      else if (t.format === "auto")
        if (_() && (s === "image/jpeg" || s === "image/png"))
          d = z;
        else if (s === "image/jpeg" || s === "image/png")
          try {
            if (typeof document < "u") {
              const C = document.createElement("canvas");
              C.width = 1, C.height = 1;
              const F = C.toDataURL("image/webp");
              F && F.indexOf("image/webp") === 5 ? d = "image/webp" : d = s;
            } else
              d = s;
          } catch {
            d = s;
          }
        else
          d = s;
      d === "image/png" && s !== "image/png" && !((l = t.optimizePNG) != null && l.enabled) && _() && (d = z), d = $e(d), (!d || !J(d) && d !== z) && (d = "image/jpeg"), d === "image/jpg" && (d = "image/jpeg");
      let w = t.quality ?? 0.8;
      if (t.enableSmartQuality === !0 || d === z && t.enableSmartQuality !== !1)
        try {
          const C = V(h, u), F = C.getContext("2d");
          if (F) {
            F.drawImage(c, 0, 0);
            const S = await Se(C);
            t.quality == null ? w = ke(
              { ...t, enableSmartQuality: !0 },
              S
            ) : w = Math.min(
              t.quality,
              (t.quality + S.recommendedQuality) / 2
            );
          }
        } catch (C) {
          console.warn("Smart quality analysis failed, using default:", C);
        }
      else if (t.mode === "adaptive" && !t.quality) {
        const C = e.size / 1048576;
        C > 10 ? w = 0.7 : C > 5 ? w = 0.75 : C < 1 ? w = 0.85 : w = 0.8;
      }
      w = Math.max(0.1, Math.min(0.99, w)), t.onProgress && t.onProgress(0.3);
      let y = null;
      if ((f = t.smartCrop) != null && f.enabled) {
        const C = V(h, u), F = C.getContext("2d");
        F && (F.drawImage(c, 0, 0), y = Fe(C, {
          width: t.smartCrop.width,
          height: t.smartCrop.height,
          focus: t.smartCrop.focus
        }), g.width = y.width, g.height = y.height);
      }
      if (g.width <= 0 || g.height <= 0 || !isFinite(g.width) || !isFinite(g.height))
        throw new Error("Invalid canvas dimensions");
      const b = 16384;
      if (g.width > b || g.height > b)
        throw new Error(`Canvas dimensions too large (max ${b}px)`);
      const x = V(g.width, g.height), M = x.getContext("2d", { willReadFrequently: !0 });
      if (!M)
        throw new Error("Failed to get canvas context");
      if (M.fillStyle = d === "image/jpeg" ? "#ffffff" : "transparent", M.fillRect(0, 0, g.width, g.height), t.beforeProcess && t.beforeProcess(M, x), this.aborted)
        throw new Error("Compression was aborted");
      const I = ce(n), k = t.resize || "none";
      let v;
      if ((k === "cover" || k === "contain") && (v = se(
        h,
        u,
        g.width,
        g.height,
        k
      )), y ? K(M, c, {
        srcX: y.x,
        srcY: y.y,
        srcWidth: y.width,
        srcHeight: y.height,
        destX: 0,
        destY: 0,
        destWidth: g.width,
        destHeight: g.height,
        rotate: I.rotate,
        scaleX: I.scaleX,
        scaleY: I.scaleY
      }) : K(M, c, {
        srcX: v == null ? void 0 : v.x,
        srcY: v == null ? void 0 : v.y,
        srcWidth: v == null ? void 0 : v.width,
        srcHeight: v == null ? void 0 : v.height,
        destX: 0,
        destY: 0,
        destWidth: g.width,
        destHeight: g.height,
        rotate: I.rotate,
        scaleX: I.scaleX,
        scaleY: I.scaleY
      }), t.enableNoiseAware && ge(M, x), t.enableColorWeighting && ue(M, x), t.enableHdrToSdr && de(M, x), d === "image/png" && ((m = t.optimizePNG) != null && m.enabled))
        try {
          Re(x, {
            reduceColors: t.optimizePNG.reduceColors,
            maxColors: t.optimizePNG.maxColors,
            optimizeTransparency: t.optimizePNG.optimizeTransparency
          });
        } catch (C) {
          console.warn("PNG optimization failed:", C);
        }
      if (t.filters && t.filters.length > 0)
        for (const C of t.filters)
          try {
            xe(M, x, C);
          } catch (F) {
            console.warn("Filter application failed:", F);
          }
      if (t.watermark)
        try {
          Te(M, x, t.watermark);
        } catch (C) {
          console.warn("Watermark application failed:", C);
        }
      if (t.convertToJPEG && d !== "image/jpeg")
        try {
          const C = await ee(x);
          De(d, C, a) && (M.fillStyle = "#ffffff", M.globalCompositeOperation = "destination-over", M.fillRect(0, 0, x.width, x.height), M.globalCompositeOperation = "source-over", d = "image/jpeg");
        } catch (C) {
          console.warn("Format conversion failed:", C);
        }
      t.afterProcess && t.afterProcess(M, x);
      try {
        await this.plugins.runTransform(x, t);
      } catch (C) {
        console.warn("Plugin transform error:", C);
      }
      if (this.aborted)
        throw new Error("Compression was aborted");
      t.onProgress && t.onProgress(0.8);
      let P;
      const T = fe(t) && t.mode === "size" && t.targetSize, D = d;
      T && t.targetSize ? D === z ? P = await X(x, w, { adaptive: !0 }) : P = await this.dualPassCompression(x, D, w, a, t.targetSize) : D === z ? P = await X(x, w, {
        progressive: t.enableProgressive !== !1,
        adaptive: !0,
        chromaSubsampling: "4:2:0"
      }) : P = await H(x, D, w), t.onProgress && t.onProgress(1);
      const E = e instanceof File ? e.name : "image", L = ae(d), R = d === "image/jpg" ? "image/jpeg" : d, j = new File([P], E.replace(/\.[^.]+$/, L), {
        type: R,
        lastModified: Date.now()
      }), U = j.size, q = t.strict !== !1;
      let W = j, $ = U, B = R, Q = w;
      const Y = 0.15, te = t.width !== void 0 && t.width !== h || t.height !== void 0 && t.height !== u || t.maxWidth !== void 0 && g.width < h || t.maxHeight !== void 0 && g.height < u || t.minWidth !== void 0 && g.width > h || t.minHeight !== void 0 && g.height > u || t.resize && t.resize !== "none", N = () => 1 - $ / a;
      if ($ >= a || N() < Y) {
        const C = [0.72, 0.62, 0.52, 0.42, 0.32, 0.25], F = (B === "image/png" || $ >= a ? [z, "image/webp", "image/jpeg", B] : te ? [B, "image/webp", "image/jpeg", z] : [z, "image/webp", "image/jpeg", B]).filter((S, A, O) => O.indexOf(S) === A);
        for (const S of F) {
          for (const A of C)
            try {
              const O = S === z ? await X(x, A, { adaptive: !0 }) : await H(x, S, A);
              if (O.size < $) {
                const re = S === z ? ".pixu" : S === "image/jpeg" ? ".jpg" : S === "image/webp" ? ".webp" : S === "image/png" ? ".png" : ".jpg";
                W = new File(
                  [O],
                  E.replace(/\.[^.]+$/, re),
                  { type: S, lastModified: Date.now() }
                ), $ = O.size, B = S, Q = A;
              }
              if (N() >= Y)
                break;
            } catch {
            }
          if (N() >= Y)
            break;
        }
        $ >= a && q && (W = e instanceof File ? e : new File([e], E, { type: s }), $ = a, B = s, Q = 1);
      }
      const ie = Math.max(0, 1 - $ / a);
      return {
        file: W,
        originalSize: a,
        compressedSize: $,
        compressionRatio: ie,
        format: B,
        width: g.width,
        height: g.height,
        metadata: {
          hasExif: !t.stripMetadata && n > 1,
          orientation: n > 1 ? n : void 0,
          quality: Q
        }
      };
    } finally {
      URL.revokeObjectURL(o);
    }
  }
  async dualPassCompression(e, t, a, r, n) {
    let s = Math.max(0.1, Math.min(0.99, a)), o = await H(e, t, s), l = 0;
    const f = 10;
    for (; o.size > n && l < f; ) {
      const m = o.size / n;
      if (m > 2 ? s *= 0.7 : m > 1.5 ? s *= 0.8 : s *= 0.9, s = Math.max(0.1, Math.min(0.99, s)), o = await H(e, t, s), l++, s <= 0.1)
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
async function et(i, e = {}) {
  const t = e.concurrency || 3, a = [], r = [], n = new G();
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
  for (let l = 0; l < i.length; l += t)
    o.push(i.slice(l, l + t));
  for (const l of o)
    await Promise.all(
      l.map((f, m) => {
        const c = o.indexOf(l) * t + m;
        return s(f, c);
      })
    );
  if (r.length > 0 && !e.onItemError)
    throw new Error(`Batch compression failed for ${r.length} file(s)`);
  return a;
}
async function* tt(i, e = {}) {
  const t = new G();
  for await (const a of i) {
    const r = await t.compress(a, e);
    if (yield r, e.onChunk) {
      const n = r.file instanceof File ? new Blob([r.file]) : r.file;
      e.onChunk(n, 0);
    }
  }
}
async function qe(i, e) {
  const t = i.getContext("2d");
  if (!t)
    throw new Error("Failed to get canvas context");
  const r = t.getImageData(0, 0, i.width, i.height).data, n = i.width, s = i.height, o = n * s, l = /* @__PURE__ */ new Map();
  let f = 0, m = 0;
  const c = 10;
  for (let P = 0; P < r.length; P += 4 * c) {
    const T = r[P], D = r[P + 1], E = r[P + 2];
    r[P + 3] < 255 && f++;
    const R = `${Math.floor(T / 8)}-${Math.floor(D / 8)}-${Math.floor(E / 8)}`;
    l.set(R, (l.get(R) || 0) + 1);
    const j = P / 4 % n, U = Math.floor(P / 4 / n);
    if (j > 0 && U > 0 && j < n - 1 && U < s - 1) {
      const q = (U * n + j) * 4, W = (U * n + (j + 1)) * 4;
      Math.abs(
        (r[q] + r[q + 1] + r[q + 2]) / 3 - (r[W] + r[W + 1] + r[W + 2]) / 3
      ) > 30 && m++;
    }
  }
  const h = o / c, u = l.size, g = u / h, d = m / h, w = f > h * 0.01;
  let p;
  g > 0.3 && d > 0.1 ? p = "photo" : g < 0.2 && d < 0.05 ? p = "graphic" : d > 0.15 && g < 0.4 ? p = "text" : p = "mixed";
  let y;
  g < 0.1 && d < 0.05 ? y = "low" : g > 0.5 || d > 0.2 ? y = "high" : y = "medium";
  let b = 0.5;
  e && (b = 1 - n * s * 4 / e);
  let x;
  b > 0.8 ? x = "very-high" : b > 0.5 ? x = "high" : b > 0.2 ? x = "medium" : x = "low";
  let M;
  w ? M = "image/png" : p === "photo" && y === "high" ? M = "image/webp" : p === "photo" ? M = "image/jpeg" : M = "image/png";
  let I;
  p === "graphic" || p === "text" ? I = 0.9 : p === "photo" && y === "high" ? I = 0.75 : I = 0.8;
  const k = Math.min(0.9, b + 0.3), v = [];
  return w && M === "image/jpeg" && v.push("Consider converting to PNG to preserve transparency"), u < 256 && p === "graphic" && v.push("Image can benefit from color reduction"), b < 0.3 && v.push("High compression potential - consider lower quality"), (n > 1920 || s > 1080) && v.push("Consider resizing for web use"), {
    quality: x,
    compressionLevel: b,
    contentType: p,
    hasText: p === "text",
    complexity: y,
    colorCount: u,
    hasTransparency: w,
    recommendedFormat: M,
    recommendedQuality: I,
    estimatedSizeReduction: k,
    suggestions: v
  };
}
async function it(i, e, t) {
  const a = [], r = await qe(e, i.size);
  i.type === "image/png" && !await ee(e) && i.size > 5e5 && a.push({
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
  return a.sort((n, s) => {
    const o = { high: 3, medium: 2, low: 1 };
    return o[s.priority] - o[n.priority];
  });
}
function rt(i, e) {
  let t = 0;
  return e.quality && e.quality < 0.9 && (t += (0.9 - e.quality) * 0.5), (e.maxWidth || e.maxHeight) && (t += 0.3), e.stripMetadata && (t += 0.05), (e.format === "image/webp" || e.format === "image/avif") && (t += 0.2), Math.min(0.9, t);
}
async function at(i, e) {
  const t = e.widths || [320, 640, 960, 1280, 1920], a = e.formats || ["image/webp", "image/jpeg"];
  e.quality;
  const r = [], n = [];
  for (const s of a) {
    const o = [];
    for (const l of t)
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
function nt(i) {
  return i.map((e) => `${e.url} ${e.width}w`).join(", ");
}
function ot(i) {
  const e = [];
  for (let t = 0; t < i.length - 1; t++)
    e.push(`(max-width: ${i[t]}px) ${i[t]}px`);
  return e.push(`${i[i.length - 1]}px`), e.join(", ");
}
function st(i) {
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
function ct(i, e) {
  const t = i.getImageData(0, 0, e.width, e.height), a = t.data;
  for (let r = 0; r < a.length; r += 4)
    ;
  i.putImageData(t, 0, 0);
}
function lt() {
  if (typeof document > "u")
    return !1;
  const i = document.createElement("canvas");
  try {
    return i.getContext("2d", { colorSpace: "display-p3" }) !== null;
  } catch {
    return !1;
  }
}
function ht(i) {
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
function mt() {
  return typeof document < "u" && typeof HTMLCanvasElement < "u";
}
class ft {
  constructor() {
    this.paused = !1, this.cancelled = !1, this.startTime = 0, this.completedCount = 0, this.errorCount = 0, this.compressor = new G();
  }
  async processBatch(e, t = {}) {
    this.startTime = Date.now(), this.completedCount = 0, this.errorCount = 0, this.paused = !1, this.cancelled = !1;
    const {
      concurrency: a = 3,
      retryAttempts: r = 2,
      retryDelay: n = 1e3,
      priority: s = "fifo",
      onProgress: o,
      onItemComplete: l,
      onItemError: f
    } = t, m = this.sortByPriority(e, s), c = new Array(e.length), h = [], u = /* @__PURE__ */ new Map();
    m.forEach((w, p) => {
      u.set(w, e.indexOf(w));
    });
    const g = async (w, p) => {
      if (this.cancelled)
        return;
      for (; this.paused && !this.cancelled; )
        await new Promise((b) => setTimeout(b, 100));
      if (this.cancelled)
        return;
      let y = null;
      for (let b = 0; b <= r; b++)
        try {
          const {
            retryAttempts: x,
            retryDelay: M,
            priority: I,
            onProgress: k,
            pause: v,
            resume: P,
            onItemComplete: T,
            onItemError: D,
            concurrency: E,
            ...L
          } = t, R = await this.compressor.compress(w, L);
          c[p] = R, this.completedCount++, l && l(R, p), o && o(
            this.completedCount,
            e.length,
            this.errorCount
          );
          return;
        } catch (x) {
          y = x instanceof Error ? x : new Error("Unknown error"), b < r && await new Promise((M) => setTimeout(M, n));
        }
      this.errorCount++, h[p] = y, f && f(y, p), o && o(
        this.completedCount,
        e.length,
        this.errorCount
      );
    }, d = [];
    for (let w = 0; w < m.length; w += a)
      d.push(m.slice(w, w + a));
    for (const w of d) {
      if (this.cancelled)
        break;
      await Promise.all(
        w.map((p) => {
          const y = u.get(p);
          return g(p, y);
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
function Ae() {
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
function gt(i) {
  return i > 10 * 1024 * 1024;
}
function ut(i, e) {
  const t = e || Ae().available, a = Math.min(t * 0.1, 5 * 1024 * 1024);
  return Math.max(a, 1024 * 1024);
}
const Oe = new G();
async function dt(i, e) {
  return Oe.compress(i, e);
}
export {
  ft as AdvancedBatchProcessor,
  Ue as PIXU_EXTENSION,
  z as PIXU_MIME_TYPE,
  _e as PIX_EXTENSION,
  Ve as PIX_MIME_TYPE,
  je as PerformanceMonitor,
  G as PixuCompressor,
  pe as PluginManager,
  st as analyzeColorSpace,
  qe as analyzeImage,
  Se as analyzeImageContent,
  xe as applyFilter,
  Me as applyPreset,
  Te as applyWatermark,
  ut as calculateChunkSize,
  Fe as calculateSmartCrop,
  Ke as canvasToPix,
  X as canvasToPixu,
  dt as compress,
  et as compressBatch,
  tt as compressStream,
  Qe as convertFormat,
  Oe as default,
  ee as detectTransparency,
  rt as estimateCompressionSavings,
  Ze as estimatePixCompression,
  He as estimatePixuCompression,
  Ye as formatBytes,
  Ne as formatDuration,
  at as generateResponsiveImages,
  ot as generateSizes,
  nt as generateSrcset,
  Ae as getMemoryInfo,
  it as getOptimizationHints,
  ye as getPresetOptions,
  ke as getSmartQuality,
  Je as isPixSupported,
  _ as isPixuSupported,
  ht as isProgressiveJPEG,
  Ge as isValidImage,
  $e as normalizePixuFormat,
  ct as normalizeToSRGB,
  Re as optimizePNG,
  De as shouldConvertToJPEG,
  gt as shouldUseStreaming,
  mt as supportsProgressiveJPEG,
  lt as supportsWideGamut,
  Z as validateImage
};
//# sourceMappingURL=pixu.esm.js.map
