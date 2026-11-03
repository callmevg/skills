import * as THREE from 'three';
import { CFG, U, clamp, easeOutCubic, monotone } from './core.js';
import { loadPage } from './page.js';
import { buildWorld } from './world.js';
import { buildOverlay, createAnchors, makeProjector } from './overlay.js';

const { W, H } = CFG;
const stage = document.getElementById('stage');
stage.style.width = W + 'px';
stage.style.height = H + 'px';
stage.style.setProperty('--s', CFG.S);

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setPixelRatio(CFG.pr);
renderer.setSize(W, H);
renderer.setClearColor(0x000000, 1);
stage.prepend(renderer.domElement);

const scene = new THREE.Scene();
// Keep ~50° across the narrow side so the runway framing holds for 1:1, 9:16 and 16:9.
const aspect = W / H;
const vfov = aspect >= 1 ? 50 : (2 * Math.atan(Math.tan((25 * Math.PI) / 180) / aspect) * 180) / Math.PI;
const camera = new THREE.PerspectiveCamera(vfov, aspect, 0.1, 400);

const P = await loadPage();
const anchors = createAnchors();
const world = buildWorld(scene, renderer, P, anchors);
const overlay = buildOverlay(P, world, anchors);
const project = makeProjector(camera);
const { L, k, secs } = P;
const vh = L.viewportHeight || 900;

// ---------- Timeline: dwell on every section title, glide between them ----------
const DUR = CFG.duration || clamp(5 + secs.length * 1.6 + L.height / 1800, 12, 40);
const INTRO = 1.4, OUTRO = 2.6;
const keys = [{ s: world.s0, dwell: 0.9 }];
for (let i = 1; i < secs.length; i++) {
  const s = secs[i].titleY + 3.0 / k;
  if (s > keys[keys.length - 1].s + vh * 0.6 && s < L.height) keys.push({ s, dwell: 0.55 });
}
const sEnd = L.height + vh * 1.1;
const travelTime = Math.max(2, DUR - INTRO - OUTRO * 0.4 - keys.reduce((a, b) => a + b.dwell, 0));
const dists = keys.map((kk, i) => (i < keys.length - 1 ? keys[i + 1].s : L.height) - kk.s - 120);
const weights = dists.map((d) => Math.pow(Math.max(d, 50), 0.65));
const wsum = weights.reduce((a, b) => a + b, 0);
const ts = [0], ss = [world.s0 - vh * 0.35];
let t = INTRO;
keys.forEach((kk, i) => {
  ts.push(t); ss.push(kk.s);
  t += kk.dwell; ts.push(t); ss.push(kk.s + 120);
  t += (weights[i] / wsum) * travelTime;
});
ts.push(DUR); ss.push(sEnd);
const scrollAt = monotone(ts, ss);

const CAM = { h: 4.6, back: 4.2, look: 4.2 };
function frame(time, dt = 1 / CFG.fps) {
  const s = scrollAt(time);
  const zf = s * k;
  U.uFocusZ.value = zf;
  const intro = easeOutCubic(time / INTRO);
  const sway = Math.sin(time * 0.45) * 0.3;
  camera.position.set(sway, CAM.h + (1 - intro) * 2.4, zf + CAM.back + (1 - intro) * 1.5);
  camera.lookAt(sway * 0.4, 0, zf - CAM.look);
  camera.updateMatrixWorld();
  const active = P.sectionAt(s - 2.6 / k);
  const F = { t: time, dt, s, zf, active, dur: DUR };
  world.update(F);
  overlay(F, project);
  renderer.render(scene, camera);
}

// Warm up textures/programs so the first rendered frames don't hitch
scene.traverse((o) => {
  const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
  for (const m of mats) if (m.map) renderer.initTexture(m.map);
});
await document.fonts.ready;
frame(0, 0);
renderer.compile(scene, camera);
frame(0, 0);

window.__scene = { duration: DUR, fps: CFG.fps, frame, title: world.heroText, sections: secs.map((s) => s.label) };
window.__ready = true;

if (!CFG.render) {
  const fit = () => {
    const sc = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `translate(${(innerWidth - W * sc) / 2}px, ${(innerHeight - H * sc) / 2}px) scale(${sc})`;
    stage.style.transformOrigin = '0 0';
  };
  fit(); addEventListener('resize', fit);
  let playing = true, cur = 0, last = performance.now();
  addEventListener('keydown', (e) => {
    if (e.code === 'Space') playing = !playing;
    if (e.code === 'ArrowRight') cur += 1;
    if (e.code === 'ArrowLeft') cur = Math.max(0, cur - 1);
  });
  addEventListener('wheel', (e) => { cur = clamp(cur + e.deltaY * 0.004, 0, DUR); });
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (playing) cur += dt;
    if (cur > DUR + 1.2) cur = 0;
    frame(Math.min(cur, DUR), dt);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
