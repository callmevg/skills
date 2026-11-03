// Loads capture output and turns it into textures + per-section metadata.
import * as THREE from 'three';
import { CFG, RW, sectionColors } from './core.js';

export async function loadPage() {
  const L = await (await fetch(CFG.data + 'layout.json')).json();
  const imgs = {};
  await Promise.all(L.tiles.map((t) => new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => { imgs[t.file] = im; res(); };
    im.onerror = rej;
    im.src = CFG.data + t.file;
  })));
  const k = RW / L.width;
  const scale = L.scale || 1;

  // Draw an arbitrary page rect into a canvas (rects can span tiles).
  function crop(x, y, w, h, maxDim = 900) {
    x = Math.max(0, x); w = Math.min(w, L.width - x);
    const f = Math.min(scale, maxDim / Math.max(w, h));
    const c = document.createElement('canvas');
    c.width = Math.max(2, Math.round(w * f)); c.height = Math.max(2, Math.round(h * f));
    const g = c.getContext('2d');
    for (const t of L.tiles) {
      const sy = Math.max(y, t.y), ey = Math.min(y + h, t.y + t.h);
      if (ey <= sy) continue;
      g.drawImage(imgs[t.file], x * scale, (sy - t.y) * scale, w * scale, (ey - sy) * scale, 0, (sy - y) * f, w * f, (ey - sy) * f);
    }
    return c;
  }
  function cropTex(x, y, w, h, maxDim) {
    const tex = new THREE.CanvasTexture(crop(x, y, w, h, maxDim));
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }

  // Low-res copy of the page, used to find each row's background luminance.
  const MW = 48, MH = Math.max(1, Math.ceil((L.height * MW) / L.width));
  const mini = document.createElement('canvas'); mini.width = MW; mini.height = MH;
  const mg = mini.getContext('2d', { willReadFrequently: true });
  for (const t of L.tiles) mg.drawImage(imgs[t.file], 0, (t.y * MW) / L.width, MW, (t.h * MW) / L.width);
  const md = mg.getImageData(0, 0, MW, MH).data;

  // Per-row background luminance (row median) so mixed light/dark sections tint correctly.
  const rowBg = new Uint8Array(MH);
  for (let r = 0; r < MH; r++) {
    const ls = [];
    for (let c = 0; c < MW; c++) { const i = (r * MW + c) * 4; ls.push(0.299 * md[i] + 0.587 * md[i + 1] + 0.114 * md[i + 2]); }
    ls.sort((x, y) => x - y);
    rowBg[r] = ls[MW >> 1];
  }
  // Median-filter rows so thin mid-gray rows don't flash as stripes
  const rowF = new Uint8Array(MH);
  for (let r = 0; r < MH; r++) {
    const win = [];
    for (let j = Math.max(0, r - 4); j <= Math.min(MH - 1, r + 4); j++) win.push(rowBg[j]);
    win.sort((x, y) => x - y);
    rowF[r] = win[win.length >> 1];
  }
  const rowTex = new THREE.DataTexture(rowF, 1, MH, THREE.RedFormat, THREE.UnsignedByteType);
  rowTex.magFilter = rowTex.minFilter = THREE.LinearFilter;
  rowTex.needsUpdate = true;

  const secs = L.sections.length ? L.sections : [{ index: 0, y0: 0, y1: L.height, label: L.siteName || 'Home', titleY: 80 }];
  const colors = sectionColors(secs.length, L.brand);
  secs.forEach((s, i) => {
    s.color = colors[i];
    s.label = s.label.replace(/…$/, '');
  });
  const sectionAt = (py) => { let a = 0; for (let i = 0; i < secs.length; i++) if (py >= secs[i].y0) a = i; return a; };
  for (const b of L.blocks) b.sec = sectionAt(b.y + Math.min(b.h, 200) / 2);
  for (const h of L.headings) h.sec = sectionAt(h.y);

  return { L, imgs, k, crop, cropTex, secs, sectionAt, rowTex };
}
