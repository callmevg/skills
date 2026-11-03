// HTML/SVG overlay projected from 3D: labels, nav rail + curves, callouts, end HUD.
import * as THREE from 'three';
import { CFG, LIFT, bendJS, smooth, clamp, el } from './core.js';

const { W, H, S } = CFG;
const ui = document.getElementById('ui');
const svg = document.getElementById('svg');
svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

const _v = new THREE.Vector3();
export function makeProjector(camera) {
  return (x, y, z) => {
    const b = bendJS(x, y, z);
    _v.set(b[0], b[1], b[2]).applyMatrix4(camera.matrixWorldInverse);
    const depth = -_v.z;
    _v.applyMatrix4(camera.projectionMatrix);
    return { x: (_v.x * 0.5 + 0.5) * W, y: (-_v.y * 0.5 + 0.5) * H, depth, ok: depth > 0.2 };
  };
}

export function createAnchors() {
  const list = [];
  return {
    list,
    add(kind, text, p, opt = {}) {
      const e = el('div', kind, ui, text);
      if (opt.bg) e.style.background = opt.bg;
      if (opt.dim) e.style.opacity = 0.7;
      list.push({ e, kind, p, opt, shown: true });
    },
  };
}


export function buildOverlay(P, world, anchors) {
  const { secs, L } = P;

  const nav = el('div', 'nav', ui);
  const navItems = secs.map((s) => el('div', '', nav, s.label));

  const back = el('div', 'back', ui);
  back.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/></svg><span>Back</span>';

  const dim = el('div', 'dim', ui);
  const hud = el('div', 'hud', ui);
  hud.innerHTML = `<div class="start">start ↑</div>
    <div class="bar">
      <div><b>Stop</b>space</div><div><b>Steer</b>← → A D</div><div><b>Toggle</b>↑ scroll up</div>
      <div><b>Stroke</b>↓ scroll down</div><div><b>Speed</b>± 350 px/s</div><div><b>Scroll length</b>${L.height.toLocaleString('en-US')} px</div>
    </div>
    <div class="w">page&nbsp;&nbsp;W = ${L.width} px</div>`;

  // Callouts for labeled blocks (biggest first)
  const callouts = world.blocks
    .filter((o) => o.b.label && o.b.label.length > 3 && o.b.w >= 200)
    .sort((a, b) => b.b.w * b.b.h - a.b.w * a.b.h)
    .slice(0, 60)
    .map((o) => {
      const left = o.b.x + o.b.w / 2 < L.width / 2;
      const e = el('div', 'co ' + (left ? 'l' : 'r'), ui, o.b.label);
      e.style.opacity = 0;
      return { o, e, left, a: 0, w: 0, h: 0 };
    });

  // Nav curve targets: blocks + secondary headings
  const navTargets = [
    ...world.blocks.map((o) => ({ sec: o.b.sec, x: o.x0, z: o.z0 + Math.min(o.d * 0.15, 0.4), y: () => (o.b.depth + 1) * LIFT * o.lift, a: 0 })),
    ...L.headings.filter((h) => h.fontSize < 40).map((h) => ({ sec: h.sec, x: world.X(h.x), z: world.Z(h.y + h.h / 2), y: () => 0, a: 0 })),
  ];

  let measured = false;
  function measure() {
    for (const c of callouts) { c.e.style.display = 'block'; c.w = c.e.offsetWidth; c.h = c.e.offsetHeight; }
    navItems.forEach((n) => { n._x = nav.offsetLeft + n.offsetLeft + n.offsetWidth - 2 * S; n._y = nav.offsetTop + n.offsetTop + n.offsetHeight / 2; });
    measured = true;
  }

  return function update(F, project) {
    if (!measured) measure();
    const k = Math.min(1, F.dt * 7);
    const o = smooth(F.dur - 2.6, F.dur - 1.6, F.t); // outro
    const fade = 1 - o;
    let paths = '';

    // anchored labels
    for (const a of anchors.list) {
      const p = project(a.p[0], a.p[1], a.p[2]);
      const vis = p.ok && p.x > -60 && p.x < W + 60 && p.y > 4 && p.y < H - 4;
      if (!vis) { if (a.shown) { a.e.style.display = 'none'; a.shown = false; } continue; }
      if (!a.shown) { a.e.style.display = 'block'; a.shown = true; }
      a.e.style.left = p.x.toFixed(1) + 'px'; a.e.style.top = p.y.toFixed(1) + 'px';
      if (a.kind === 'chip' || a.kind === 'ghost') {
        const sc = clamp(9 / p.depth, 0.55, 1.5);
        a.e.style.transform = `translate(-50%,-50%) scale(${sc.toFixed(3)})`;
      }
    }

    // nav rail
    navItems.forEach((n, i) => n.classList.toggle('on', i === F.active));
    const nx = navItems[F.active]._x, ny = navItems[F.active]._y;
    for (const t of navTargets) {
      let target = 0, p = null;
      if (t.sec === F.active) {
        p = project(t.x, t.y(), t.z);
        if (p.ok && p.y > H * 0.22 && p.y < H * 0.97 && p.x > nx + 60 * S && p.x < W * 0.8) target = 1;
      }
      t.a += (target - t.a) * k;
      if (t.a < 0.02 || !p) continue;
      const mx = nx + (p.x - nx) * 0.45;
      paths += `<path d="M${nx},${ny} C${mx},${ny} ${mx},${p.y} ${p.x},${p.y}" style="opacity:${(t.a * 0.8 * fade).toFixed(3)}"/>`;
    }

    // callouts
    const used = [];
    for (const c of callouts) {
      const o = c.o;
      const top = (o.b.depth + 1) * LIFT * o.lift;
      const cx = c.left ? o.x0 : o.x0 + o.w;
      const p = project(cx, top, o.z0);
      let target = 0;
      if (p.ok && o.lift > 0.6 && p.y > H * 0.16 && p.y < H * 0.8) {
        const ty = p.y - 26 * S;
        if (!used.some((u) => u.left === c.left && Math.abs(u.y - ty) < c.h + 24 * S)) { target = 1; used.push({ left: c.left, y: ty }); }
      }
      c.a += (target - c.a) * k;
      if (c.a < 0.02) { if (c.e.style.opacity !== '0') c.e.style.opacity = 0; continue; }
      const gap = 34 * S;
      let lx = c.left ? p.x - gap - c.w : p.x + gap;
      lx = clamp(lx, 140 * S, W - c.w - 8 * S);
      const ly = p.y - 30 * S - c.h;
      c.e.style.left = lx.toFixed(1) + 'px'; c.e.style.top = ly.toFixed(1) + 'px';
      c.e.style.opacity = (c.a * fade).toFixed(3);
      const by = ly + c.h + 6 * S;
      const x0 = c.left ? lx : lx + c.w, x1 = c.left ? lx + c.w + 6 * S : lx - 6 * S;
      paths += `<path d="M${x0},${by} H${x1} L${p.x},${p.y}" style="opacity:${(c.a * 0.85 * fade).toFixed(3)}"/>`;
    }
    svg.innerHTML = paths;


    dim.style.opacity = (o * 0.45).toFixed(3);
    hud.style.opacity = o.toFixed(3);
    nav.style.opacity = (1 - o * 0.6).toFixed(3);
  };
}

