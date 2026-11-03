// Shared config, math helpers and the "runway bend" shader patch.
import * as THREE from 'three';

THREE.ColorManagement.enabled = false;

const Q = new URLSearchParams(location.search);
export const CFG = {
  render: Q.has('render'),
  W: +(Q.get('w') || 1080),
  H: +(Q.get('h') || 1080),
  fps: +(Q.get('fps') || 30),
  pr: +(Q.get('pr') || (Q.has('render') ? 1 : Math.min(2, devicePixelRatio || 1))),
  style: Q.get('style') || 'duotone',
  palette: Q.get('palette') || 'editions',
  title: Q.get('title') || '',
  data: Q.get('data') || '/capture/',
  duration: Q.get('duration') ? +Q.get('duration') : 0,
};
CFG.S = Math.min(CFG.W, CFG.H) / 1080; // UI scale

// World layout: runway is RW units wide; page y grows toward -z.
export const RW = 10;
export const LIFT = 0.16;

export function rng(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) { h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  let a = h >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
export const easeOutCubic = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);

// Bend: flat near the camera, curving up into a wall ahead (Editions "expo mode" look).
export const U = { uFocusZ: { value: 0 }, uBendStart: { value: 9 }, uBendR: { value: 6.5 } };

const BEND_GLSL = /* glsl */ `
uniform float uFocusZ; uniform float uBendStart; uniform float uBendR;
vec3 bendPos(vec3 p) {
  float zb = uFocusZ - uBendStart;
  float d = zb - p.z;
  if (d <= 0.0) return p;
  float R = uBendR; float r = R - p.y; float th = d / R;
  const float HP = 1.5707963;
  if (th < HP) return vec3(p.x, R - r * cos(th), zb - r * sin(th));
  return vec3(p.x, R + (d - R * HP), zb - r);
}`;

export function bendJS(x, y, z) {
  const zb = U.uFocusZ.value - U.uBendStart.value;
  const d = zb - z;
  if (d <= 0) return [x, y, z];
  const R = U.uBendR.value, r = R - y, th = d / R, HP = Math.PI / 2;
  if (th < HP) return [x, R - r * Math.cos(th), zb - r * Math.sin(th)];
  return [x, R + (d - R * HP), zb - r];
}

export function bendify(mat, key = 'bend', extra) {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n' + BEND_GLSL)
      .replace('#include <project_vertex>', /* glsl */ `
        vec4 mvPosition = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          mvPosition = instanceMatrix * mvPosition;
        #endif
        vec4 bwp = modelMatrix * mvPosition;
        bwp.xyz = bendPos(bwp.xyz);
        mvPosition = viewMatrix * bwp;
        gl_Position = projectionMatrix * mvPosition;`);
    if (extra) extra(sh);
  };
  // Distinct cache keys: closures share source text, so three would otherwise reuse the wrong program.
  mat.customProgramCacheKey = () => key;
  return mat;
}

export function lineMat(opacity = 0.5, color = 0xffffff) {
  return bendify(new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }));
}

// Palettes. With 5+ sections the last one goes dark, like the reference.
const PALETTES = {
  editions: ['#1f1bd1', '#7c1fe6', '#cc128a', '#cf3a10', '#12a53b'],
  mono: ['#121212'],
  night: ['#0f1b4d', '#2a0f4d', '#4d0f33', '#4d1f0f', '#0f4d2a'],
};
export function sectionColors(n, brand) {
  let pal;
  if (CFG.palette === 'brand' && brand) {
    const c = new THREE.Color(`rgb(${brand.join(',')})`);
    const hsl = {}; c.getHSL(hsl);
    pal = Array.from({ length: 5 }, (_, i) => '#' + new THREE.Color().setHSL((hsl.h + i * 0.09) % 1, 0.78, 0.42).getHexString());
  } else if (PALETTES[CFG.palette]) pal = PALETTES[CFG.palette];
  else pal = CFG.palette.split(',').map((s) => (s.startsWith('#') ? s : '#' + s));
  return Array.from({ length: n }, (_, i) => (n >= 5 && i === n - 1 && CFG.palette !== 'mono' ? '#111111' : pal[i % pal.length]));
}

// Fritsch–Carlson monotone cubic interpolation for the scroll timeline.
export function monotone(xs, ys) {
  const n = xs.length, d = [], m = new Array(n);
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
    if (h > 9) { const t = 3 / Math.sqrt(h); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return (x) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}

export function el(tag, cls, parent, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
}
