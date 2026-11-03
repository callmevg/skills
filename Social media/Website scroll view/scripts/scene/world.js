// Builds every 3D object. Each builder returns an update(frameState) hook (or nothing).
import * as THREE from 'three';
import { CFG, RW, LIFT, U, bendify, lineMat, rng, smooth } from './core.js';

export function buildWorld(scene, renderer, P, anchors) {
  const { L, k, imgs, cropTex, secs } = P;
  const R = rng(L.host || L.url || 'site');
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const pageLen = L.height * k;
  const X = (px) => px * k - RW / 2;
  const Z = (py) => py * k; // page top is far away, later content comes toward the camera
  const updaters = [];
  const add = (o) => { o.frustumCulled = false; o.traverse?.((c) => (c.frustumCulled = false)); scene.add(o); return o; };

  // ---------- Runway tiles (duotone-tinted per section) ----------
  const SEC = {
    uSecY: { value: new Float32Array(12) },
    uSecCol: { value: Array.from({ length: 12 }, () => new THREE.Vector3()) },
    uSecN: { value: Math.min(12, secs.length) },
    uDuo: { value: CFG.style === 'duotone' ? 1 : 0 },
    uRowBg: { value: P.rowTex },
    uPageH: { value: L.height },
  };
  secs.slice(0, 12).forEach((s, i) => {
    const c = new THREE.Color(s.color);
    SEC.uSecY.value[i] = s.y0; SEC.uSecCol.value[i].set(c.r, c.g, c.b);
  });
  for (const t of L.tiles) {
    const tex = new THREE.Texture(imgs[t.file]);
    tex.anisotropy = maxAniso; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.needsUpdate = true;
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    const loc = { uTileY: { value: t.y }, uTileH: { value: t.h } };
    bendify(mat, 'tile', (sh) => {
      Object.assign(sh.uniforms, SEC, loc);
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
          uniform float uSecY[12]; uniform vec3 uSecCol[12]; uniform int uSecN; uniform sampler2D uRowBg; uniform float uPageH; uniform float uDuo; uniform float uTileY; uniform float uTileH;`)
        .replace('#include <map_fragment>', `#include <map_fragment>
          if (uDuo > 0.5) {
            float py = uTileY + (1.0 - vMapUv.y) * uTileH;
            vec3 sc = uSecCol[0];
            for (int i = 1; i < 12; i++) { if (i >= uSecN) break; if (py >= uSecY[i]) sc = uSecCol[i]; }
            float inv = smoothstep(0.4, 0.6, texture2D(uRowBg, vec2(0.5, py / uPageH)).r);
            vec3 o = diffuseColor.rgb;
            float l = dot(o, vec3(0.299, 0.587, 0.114));
            l = mix(l, 1.0 - l, inv);
            float tt = smoothstep(0.22, 0.92, l);
            diffuseColor.rgb = mix(mix(sc, vec3(1.0), 0.06 * tt), mix(sc, vec3(1.0), 0.93), tt);
            diffuseColor.rgb = mix(diffuseColor.rgb, o, 0.05);
          }`);
    });
    const h = t.h * k;
    const g = new THREE.PlaneGeometry(RW, h, 1, Math.max(4, Math.ceil(h / 0.25)));
    g.rotateX(-Math.PI / 2);
    const m = add(new THREE.Mesh(g, mat));
    m.position.set(0, 0, Z(t.y + t.h / 2));
  }
  // Lead-in before the page top so the far wall isn't empty in the intro
  {
    const len = 90;
    const g = new THREE.PlaneGeometry(RW, len, 1, 200); g.rotateX(-Math.PI / 2);
    const m = add(new THREE.Mesh(g, bendify(new THREE.MeshBasicMaterial({ color: new THREE.Color(secs[0].color) }), 'leadin')));
    m.position.set(0, -0.001, -len / 2 + 0.01);
  }
  // Dark runway extension after the page for the outro
  {
    const len = 90;
    const g = new THREE.PlaneGeometry(RW, len, 1, 200); g.rotateX(-Math.PI / 2);
    const m = add(new THREE.Mesh(g, bendify(new THREE.MeshBasicMaterial({ color: 0x0c0c0c }))));
    m.position.set(0, -0.001, pageLen + len / 2 - 0.01);
  }

  // ---------- Raised blocks (cards + media keep their original colors) ----------
  const shadowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'); g.filter = 'blur(14px)'; g.fillStyle = '#000'; g.fillRect(24, 24, 80, 80);
    return new THREE.CanvasTexture(c);
  })();
  const edgeMat = lineMat(0.45);
  const blocks = [];
  for (const b of L.blocks) {
    const w = Math.min(b.w, L.width - b.x) * k, d = b.h * k;
    if (w < 0.3 || d < 0.2) continue;
    const segZ = Math.max(1, Math.ceil(d / 0.3));
    const geo = new THREE.BoxGeometry(w, 1, d, 1, 1, segZ).translate(0, 0.5, 0);
    const top = bendify(new THREE.MeshBasicMaterial({ map: cropTex(b.x, b.y, b.w, b.h, 900), transparent: true, polygonOffset: true, polygonOffsetFactor: -2 }), 'blockTop');
    top.map.anisotropy = maxAniso;
    const side = bendify(new THREE.MeshBasicMaterial({ color: new THREE.Color(secs[b.sec].color).multiplyScalar(0.55) }), 'blockSide');
    const mesh = add(new THREE.Mesh(geo, [side, side, top, side, side, side]));
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));
    mesh.traverse((c) => (c.frustumCulled = false));
    const cx = X(b.x) + w / 2, cz = Z(b.y) + d / 2;
    mesh.position.set(cx, 0, cz);
    let shadow = null;
    if (b.depth === 0) {
      const sg = new THREE.PlaneGeometry(w * 1.12, d * 1.1, 1, segZ); sg.rotateX(-Math.PI / 2);
      shadow = add(new THREE.Mesh(sg, bendify(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0 }), 'shadow')));
      shadow.position.set(cx + 0.12, 0.004, cz + 0.16);
    }
    blocks.push({ b, mesh, top, shadow, w, d, cx, cz, x0: cx - w / 2, z0: Z(b.y), lift: 0 });
  }
  updaters.push((F) => {
    for (const o of blocks) {
      const ahead = F.zf - o.cz;
      o.lift = 1 - smooth(5, 13, ahead);
      const l = Math.max(0.02, o.lift);
      o.mesh.scale.y = LIFT * l;
      o.mesh.position.y = o.b.depth * LIFT * l;
      o.top.opacity = smooth(0.02, 0.35, o.lift);
      if (o.shadow) o.shadow.material.opacity = 0.5 * o.lift;
    }
  });

  // ---------- Hero: extruded title lying on the runway ----------
  const heroCandidates = [CFG.title, L.hero?.text, L.siteName, (L.siteName || '').split(' ')[0], L.host];
  const heroText = CFG.title || heroCandidates.find((t) => t && t.length <= 14) || (L.host || 'Website').slice(0, 14);
  const vh = L.viewportHeight || 900;
  const s0 = 3.4 / k;
  {
    const c = document.createElement('canvas');
    const g = c.getContext('2d');
    const font = '700 220px "Helvetica Neue", Helvetica, Arial, sans-serif';
    g.font = font;
    const tw = Math.ceil(g.measureText(heroText).width) + 30;
    c.width = Math.min(4096, tw); c.height = 260;
    g.font = font; g.fillStyle = '#fff'; g.textBaseline = 'middle';
    g.fillText(heroText, 15, 136);
    const tex = new THREE.CanvasTexture(c); tex.anisotropy = maxAniso;
    let hgt = 1.9, len = hgt * (c.width / c.height);
    if (len > 8.5) { hgt *= 8.5 / len; len = 8.5; }
    const N = 120, depth = 0.7;
    const zStart = Z(s0) - 1.0;
    const group = new THREE.Group();
    for (let i = 0; i < N; i++) {
      const shade = i === N - 1 ? 1 : 0.55 + 0.25 * (i / N);
      const m = bendify(new THREE.MeshBasicMaterial({ map: tex, alphaTest: 0.5, color: new THREE.Color(shade, shade, shade) }), 'hero');
      const pg = new THREE.PlaneGeometry(len, hgt, Math.ceil(len / 0.2), 1);
      pg.rotateX(-Math.PI / 2); pg.rotateY(Math.PI / 2);
      const mesh = new THREE.Mesh(pg, m);
      mesh.position.set(0, 0.02 + (i / (N - 1)) * depth, 0);
      group.add(mesh);
    }
    group.position.set(-RW / 2 + hgt / 2 + 1.5, 0, zStart - len / 2);
    add(group);
  }

  // ---------- Sitemap constellation in the hero ----------
  const conSecs = secs.length > 1 ? secs.slice(1, 10) : secs;
  const thumbsFor = (si, n) => L.blocks.filter((b) => b.sec === si && b.w > 120).sort((a, b) => b.w * b.h - a.w * a.h).slice(0, n);
  const ringMat = lineMat(0.35), spokeMat = lineMat(0.55, 0xbfd0ff);
  const thumbEdge = lineMat(0.9);
  const thumbs = [];
  function makeThumb(b, pos, size) {
    const side = Math.min(b.w, b.h);
    const tex = cropTex(b.x + (b.w - side) / 2, b.y + (b.h - side) / 2, side, side, 160);
    const g = new THREE.PlaneGeometry(size, size); g.rotateX(-0.9);
    const m = add(new THREE.Mesh(g, bendify(new THREE.MeshBasicMaterial({ map: tex }), 'thumb')));
    m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), thumbEdge));
    m.position.copy(pos);
    thumbs.push({ m, base: pos.y, ph: R() * 6.28 });
    return m;
  }
  const dotTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 32;
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.beginPath(); g.arc(16, 16, 14, 0, Math.PI * 2); g.fill();
    return new THREE.CanvasTexture(c);
  })();
  function burst(center, n, spread, color = 0xffffff) {
    const pts = [];
    for (let i = 0; i < n; i++) pts.push(center.x + (R() - 0.5) * spread, center.y + R() * spread * 0.4, center.z + (R() - 0.5) * spread);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    add(new THREE.Points(g, bendify(new THREE.PointsMaterial({ color, map: dotTex, alphaTest: 0.4, size: 3 * CFG.S * CFG.pr, sizeAttenuation: false, transparent: true, opacity: 0.85 }), 'pts')));
  }
  function star(center, items, radius, yMin, yMax, size) {
    const spokes = [];
    for (const b of items) {
      const a = R() * Math.PI * 2, r = radius * (0.45 + R() * 0.55);
      const p = new THREE.Vector3(center.x + Math.cos(a) * r, yMin + R() * (yMax - yMin), center.z + Math.sin(a) * r * 0.8);
      makeThumb(b, p, size);
      spokes.push(center.x, center.y, center.z, p.x, p.y, p.z);
    }
    for (let i = 0; i < 10; i++) {
      const a = R() * Math.PI * 2, r = radius * (0.3 + R() * 0.9);
      spokes.push(center.x, center.y, center.z, center.x + Math.cos(a) * r, center.y + R() * 0.6, center.z + Math.sin(a) * r * 0.8);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(spokes, 3));
    add(new THREE.LineSegments(g, spokeMat));
  }
  const zf0 = Z(s0);
  const placed = [];
  conSecs.forEach((s, i) => {
    let p, tries = 0;
    do {
      p = new THREE.Vector3(-0.2 + R() * 4.6, 0.02, zf0 + 2.2 - R() * 9.5);
      tries++;
    } while (tries < 40 && placed.some((q) => q.distanceTo(p) < 1.7));
    placed.push(p);
    const ring = new THREE.EllipseCurve(0, 0, 0.75, 0.75).getPoints(48).map((v) => new THREE.Vector3(p.x + v.x, 0.015, p.z + v.y));
    add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ring), ringMat));
    const si = secs.indexOf(s);
    star(new THREE.Vector3(p.x, 0.05, p.z), thumbsFor(si, 4), 1.1, 0.45, 1.3, 0.26);
    anchors.add('tag', `${String(si + 1).padStart(2, '0')} ${s.label}`, [p.x - 0.3, 0.02, p.z + 0.85]);
  });

  // ---------- Section boundary nodes ----------
  secs.forEach((s, i) => {
    if (i === 0) return;
    const z = Z(s.y0);
    const c = new THREE.Vector3((R() - 0.5) * 2, 0.9, z + 0.4);
    star(c, thumbsFor(i, 3).concat(thumbsFor(i - 1, 2)), 1.6, 1.1, 2.1, 0.32);
    burst(c, 34, 4, 0xff6aa8);
    anchors.add('chip', s.label, [c.x, c.y, c.z], { bg: s.color });
    anchors.add('ghost', s.label, [-RW / 2 - 1.6, 0, Z(s.titleY)]);
    anchors.add('ghost', s.label, [RW / 2 + 1.6, 0, Z(s.titleY)]);
  });

  // ---------- Ground guide lines that sweep up with the bend ----------
  for (const side of [-1, 1]) {
    for (let i = 0; i < 9; i++) {
      const x = side * (RW / 2 + 0.9 + i * 1.5 + i * i * 0.35);
      const pts = [];
      for (let z = -90; z < pageLen + 40; z += 1) pts.push(new THREE.Vector3(x + Math.sin(z * 0.02 + i) * 0.4 * i * 0.2, -0.02, z));
      add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(0.55 - i * 0.045)));
    }
  }

  // ---------- Wireframe props floating beside the runway ----------
  const propGeos = [
    () => new THREE.BoxGeometry(0.8, 0.8, 0.8),
    () => new THREE.IcosahedronGeometry(0.55, 0),
    () => new THREE.OctahedronGeometry(0.55, 0),
    () => new THREE.TorusGeometry(0.45, 0.14, 6, 14),
    () => new THREE.CylinderGeometry(0.35, 0.35, 1.2, 8, 3),
    () => new THREE.BoxGeometry(0.6, 1.8, 0.6, 1, 4, 1),
    () => new THREE.DodecahedronGeometry(0.5, 0),
  ];
  const props = [];
  const propMat = lineMat(0.55);
  for (let z = -8; z < pageLen + 20; z += 3.2 + R() * 3) {
    const side = R() < 0.5 ? -1 : 1;
    const gi = Math.floor(R() * propGeos.length);
    const g = propGeos[gi]();
    const m = add(new THREE.LineSegments(gi === 3 ? new THREE.WireframeGeometry(g) : new THREE.EdgesGeometry(g), propMat));
    m.position.set(side * (RW / 2 + 1.4 + R() * 5.5), 0.4 + R() * 2.2, z);
    m.scale.setScalar(0.6 + R() * 0.9);
    props.push({ m, rx: (R() - 0.5) * 0.6, ry: (R() - 0.5) * 0.8 });
  }
  updaters.push((F) => {
    for (const p of props) { p.m.rotation.x = F.t * p.rx; p.m.rotation.y = F.t * p.ry; }
    for (const th of thumbs) th.m.position.y = th.base + Math.sin(F.t * 1.3 + th.ph) * 0.06;
  });

  // ---------- Annotations: page-y ticks, formulas, dimension labels ----------
  for (let y = 0; y <= L.height; y += 500) {
    anchors.add('tag', String(y), [-RW / 2 - 0.45, 0, Z(y)]);
    anchors.add('tag', String(y), [RW / 2 + 0.45, 0, Z(y)]);
  }
  const formulas = ['y = e^(−x) cos(ωx + φ)', 'σ(x) = 1 / (1 + e^−x)', 'x(t) = vt + ½at²', 'r = a(1 − cos θ)', 'eˣ = 54.6', 'θ = 2π / n', 'f′(x) = lim Δy/Δx', 'z(t)'];
  for (let z = 4; z < pageLen; z += 7 + R() * 6) {
    const side = R() < 0.5 ? -1 : 1;
    anchors.add('tag', formulas[Math.floor(R() * formulas.length)], [side * (RW / 2 + 2 + R() * 3), 1.6 + R() * 1.2, z], { dim: true });
  }
  for (const o of blocks) {
    if (o.b.depth !== 0 || o.b.w < 300) continue;
    anchors.add('tag', 'x(t)', [o.x0 + o.w + 0.2, 0.05, o.cz + o.d / 2 + 0.15], { dim: true });
    anchors.add('tag', 'z(t)', [o.x0 + o.w + 0.25, LIFT, o.z0 + 0.1], { dim: true });
    if (R() < 0.5) anchors.add('tag', `${(o.b.w / 420).toFixed(1)} m`, [o.x0 + o.w + 0.45, 0.05, o.cz], { dim: true });
  }

  return { blocks, pageLen, s0, heroText, update: (F) => updaters.forEach((u) => u(F)), X, Z };
}
