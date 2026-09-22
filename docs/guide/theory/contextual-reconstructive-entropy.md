# Contextual Reconstructive Entropy (TECR)

Pixu’s compression model is grounded in **Contextual Reconstructive Entropy** — a practical extension of classical information theory for images on the web.

It does **not** claim to break Shannon’s theorem. It changes the problem we optimize for: minimize what you *ship*, given shared context and an acceptable reconstruction error.

## Why Shannon is not the whole story

Shannon’s source coding theorem states that, under a fixed probabilistic model of a source, you cannot losslessly compress *every* message below its average entropy $H(X)$.

That bound holds when:

- compressor and decompressor share **no** extra knowledge beyond the codec;
- the goal is **exact** recovery ($x' = x$);
- “information” means statistical redundancy only.

Real image delivery violates those assumptions all the time:

| Classical premise | Web / Pixu reality |
|-------------------|--------------------|
| Exact bit recovery | Perceptual equivalence is enough |
| No shared prior | Codec + analysis + domain heuristics act as shared $M$ |
| Symbol statistics only | Structure, edges, saturation, content class matter |
| Cost = bitstream size | Cost = file + model + context + allowed error |

## Core idea

> The minimum size needed to represent an object depends not only on the data itself, but on the **shared knowledge** and **reconstruction capacity** of the receiver.

We write the shortest description length of $x$ under shared model $M$, context $C$, and error budget $\varepsilon$ as:

$$
L(x \mid M, C, \varepsilon)
$$

### Total representation cost

$$
C_{\text{total}} = C_{\text{file}} + C_{\text{model}} + C_{\text{context}} + C_{\text{error}}
$$

| Term | Meaning in Pixu |
|------|-----------------|
| $C_{\text{file}}$ | Bytes in the output file (WebP/JPEG from the PIXU path, or other) |
| $C_{\text{model}}$ | Codec + Pixu reconstructive pipeline (WebP/JPEG proxy, adaptive encoder) |
| $C_{\text{context}}$ | Content analysis: photo vs graphic, complexity, edges, chroma |
| $C_{\text{error}}$ | Allowed perceptual distortion $\varepsilon$ (quality / smart quality) |

A method can produce files **much smaller** than entropy estimated on pixels alone. The missing bits did not vanish — they live in $M$ and $C$, or were spent as $\varepsilon$.

## Levels of TECR in Pixu

| Level | Name | What Pixu does |
|-------|------|----------------|
| **0** | Signal context | Block variance, saturation, chroma-aware quality |
| **1** | Content context | Smart Quality: photo / graphic / text priors |
| **2** | Format context | PIXU path: adaptive encode + perceptual $\varepsilon$ as first-class |
| **3** *(roadmap)* | Semantic / generative | Shared generative $M$; store prompts or latents, not all pixels |

Levels 0–2 ship today. Level 3 is the research horizon (versioned models, explicit $C_{\text{model}}$ accounting).

## What “best compression” means here

Pixu optimizes for:

$$
\min \; C_{\text{file}} \quad \text{s.t.} \quad d(x, \hat{x}) \le \varepsilon
$$

where $d$ is a **perceptual** distortion (implicit in quality + content-aware tuning), not bit-exact equality.

That is why PIXU routinely beats naive JPEG/WebP at the same visual budget: it spends bits where the eye cares and borrows structure from $C$ and $M$.

### Honest comparison to Shannon

| Claim | Status |
|-------|--------|
| “We beat Shannon losslessly on arbitrary data” | **False** — impossible under classical premises |
| “We beat naive codecs under perceptual $\varepsilon$ + context” | **True** — this is Pixu’s product claim |
| “Future generative codecs rewrite $L(x\mid M,C,\varepsilon)$” | **Research** — TECR level 3 |

## Mapping to the API

```typescript
import { compress } from 'pixu'

const result = await compress(file, {
  format: 'image/pixu',   // prefer reconstructive PIXU path (M)
  enableSmartQuality: true, // build C from image content
  quality: 0.85,          // ε budget when you fix it explicitly
  stripMetadata: true,    // drop context the receiver does not need
})
```

| Option | TECR role |
|--------|-----------|
| `format: 'image/pixu'` | Selects reconstructive model $M$ |
| `enableSmartQuality` | Estimates content context $C$ |
| `quality` / adaptive quality | Sets $\varepsilon$ |
| Dual-pass / target size | Search over $C_{\text{file}}$ under $\varepsilon$ |

See also:

- [PIXU Format](/guide/features/pixu-format) — format that implements TECR levels 0–2
- [Smart Quality](/guide/features/smart-quality) — content context $C$
- [Image Analysis](/guide/features/image-analysis) — inspecting $C$ explicitly

## Scientific checklist (for contributors)

To deepen TECR as a theory — not marketing:

1. Define information, context, reconstruction, and error rigorously
2. State theorems / limits for $L(x\mid M,C,\varepsilon)$
3. Prove or bound propositions formally
4. Publish reproducible experiments (bitrate vs perceptual metrics)
5. Always report $C_{\text{total}}$, never only $C_{\text{file}}$
6. Prefer predictions classical codecs do not explain well

The valuable discovery is not “Shannon was wrong.” It is a **new practical limit** for contextual and reconstructive image compression — the foundation of Pixu.
