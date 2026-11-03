#!/usr/bin/env node
// Stage 1: URL -> full-page screenshot tiles + layout.json (sections, blocks, headings, hero, brand color)
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs, slugFromUrl, isMain } from './lib/args.mjs';

export async function capture(opts) {
  const {
    url,
    out,
    width = 1200,
    height = 900,
    maxHeight = 32000,
    scale = 1,
    waitMs = 1500,
    log = console.log,
  } = opts;
  const capDir = path.join(out, 'capture');
  await fs.rm(capDir, { recursive: true, force: true });
  await fs.mkdir(capDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: scale,
    reducedMotion: 'no-preference',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();
  log(`[capture] loading ${url}`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  } catch {
    log('[capture] networkidle timed out, continuing after load');
    await page.waitForLoadState('load').catch(() => {});
  }
  await page.waitForTimeout(waitMs);

  await page.addStyleTag({
    content: `*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important;scroll-behavior:auto!important;caret-color:transparent!important}`,
  }).catch(() => {});

  await dismissBanners(page);
  await unlockInnerScroller(page);

  log('[capture] scrolling to trigger lazy content');
  await page.evaluate(async (maxH) => {
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'));
    const step = Math.max(300, innerHeight * 0.7);
    for (let y = 0; y < Math.min(document.documentElement.scrollHeight, maxH); y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, 0);
    await Promise.all(
      [...document.images]
        .filter((i) => !i.complete)
        .map((i) => new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 4000); })),
    );
  }, maxHeight);
  await page.waitForTimeout(600);
  await neutralizeFixed(page);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(400);

  const layout = await page.evaluate(extractLayout, { maxHeight });
  layout.url = url;
  layout.capturedAt = new Date().toISOString();
  layout.scale = scale;
  log(`[capture] page ${layout.width}x${layout.height}px, ${layout.sections.length} sections, ${layout.blocks.length} blocks`);

  // Scroll-and-shoot: in-view reveal animations only render while on screen,
  // so each tile is a viewport screenshot taken after scrolling to it.
  log('[capture] shooting tiles');
  const tiles = [];
  for (let y = 0, i = 0; y < layout.height; y += height, i++) {
    const h = Math.min(height, layout.height - y);
    const actual = await page.evaluate((ty) => { scrollTo(0, ty); return scrollY; }, y);
    await page.waitForTimeout(450);
    await page.evaluate(() => Promise.all(
      [...document.images]
        .filter((i) => { const r = i.getBoundingClientRect(); return !i.complete && r.bottom > 0 && r.top < innerHeight; })
        .map((i) => new Promise((r) => { i.addEventListener('load', r); i.addEventListener('error', r); setTimeout(r, 2500); })),
    )).catch(() => {});
    const off = y - (await page.evaluate(() => scrollY));
    const file = `tile_${String(i).padStart(3, '0')}.jpg`;
    await page.screenshot({
      path: path.join(capDir, file),
      type: 'jpeg',
      quality: 90,
      clip: { x: 0, y: Math.max(0, Math.min(off, height - h)), width: layout.width, height: h },
    });
    tiles.push({ file, y, h });
    if (actual !== y && off + h > height) break;
  }
  layout.tiles = tiles;
  await fs.writeFile(path.join(capDir, 'layout.json'), JSON.stringify(layout, null, 2));
  await browser.close();
  log(`[capture] wrote ${tiles.length} tiles + layout.json to ${capDir}`);
  return { capDir, layout };
}

async function dismissBanners(page) {
  await page.evaluate(() => {
    const re = /^(accept( all)?( cookies)?|allow all|agree|i agree|got it|ok(ay)?|continue|close|no thanks|dismiss|reject all)$/i;
    const btns = [...document.querySelectorAll('button,[role=button],a')].filter((b) => re.test((b.innerText || '').trim()));
    for (const b of btns.slice(0, 3)) {
      const fixedAncestor = (() => {
        for (let n = b; n && n !== document.body; n = n.parentElement) {
          const p = getComputedStyle(n).position;
          if (p === 'fixed' || p === 'sticky' || n.getAttribute('role') === 'dialog') return true;
        }
        return false;
      })();
      if (fixedAncestor) try { b.click(); } catch {}
    }
  }).catch(() => {});
  await page.waitForTimeout(400);
}

// Some sites scroll inside a full-height container instead of the document.
async function unlockInnerScroller(page) {
  await page.evaluate(() => {
    const doc = document.documentElement;
    if (doc.scrollHeight > innerHeight * 1.2) return;
    let best = null, bestH = 0;
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (!/(auto|scroll)/.test(cs.overflowY)) continue;
      if (el.scrollHeight > bestH && el.clientHeight > innerHeight * 0.5) { best = el; bestH = el.scrollHeight; }
    }
    if (!best || bestH < innerHeight * 1.2) return;
    for (let n = best; n; n = n.parentElement) {
      n.style.setProperty('overflow', 'visible', 'important');
      n.style.setProperty('height', 'auto', 'important');
      n.style.setProperty('max-height', 'none', 'important');
    }
  }).catch(() => {});
}

// Keep a top header in the flow, hide floating chrome (cookie bars, chat bubbles, modals).
async function neutralizeFixed(page) {
  await page.evaluate(() => {
    const W = document.documentElement.clientWidth;
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.position === 'sticky') { el.style.setProperty('position', 'relative', 'important'); el.style.setProperty('top', 'auto', 'important'); continue; }
      if (cs.position !== 'fixed') continue;
      const r = el.getBoundingClientRect();
      const isHeader = r.top <= 10 && r.height < 180 && r.width > W * 0.6;
      if (isHeader) {
        el.style.setProperty('position', 'absolute', 'important');
        el.style.setProperty('top', '0px', 'important');
      } else {
        el.style.setProperty('display', 'none', 'important');
      }
    }
    document.documentElement.style.setProperty('overflow', 'visible', 'important');
    document.body.style.setProperty('overflow', 'visible', 'important');
  }).catch(() => {});
}

// Runs in the page. Returns a page-coordinate description of the layout.
function extractLayout({ maxHeight }) {
  const W = document.documentElement.clientWidth;
  const H = Math.min(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), maxHeight);
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const txt = (el) => {
    const it = clean(el.innerText);
    if (it) return it;
    const parts = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) parts.push(w.currentNode.textContent);
    return clean(parts.join(' '));
  };
  const short = (s, n) => { const w = clean(s).split(' '); let o = ''; for (const x of w) { if ((o + ' ' + x).trim().length > n) break; o = (o + ' ' + x).trim(); } return (o || clean(s).slice(0, n)).replace(/[\s,.;:–—-]+$/, ''); };
  const clip = (s, n) => { s = clean(s); if (s.length <= n) return s; const c = s.slice(0, n); return c.slice(0, Math.max(c.lastIndexOf(' '), n * 0.6)).replace(/[,.;:–-]$/, '') + '…'; };
  const rect = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; };
  const visible = (el) => {
    const cs = getComputedStyle(el);
    // visibility is ignored too: GSAP-style autoAlpha hides content until it scrolls into view
    if (cs.display === 'none') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const color = (c) => {
    if (!c || c === 'transparent') return null;
    cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = cx.getImageData(0, 0, 1, 1).data;
    return a < 128 ? null : [r, g, b];
  };
  const effBg = (el) => {
    for (let n = el; n; n = n.parentElement) { const c = color(getComputedStyle(n).backgroundColor); if (c) return c; }
    return [255, 255, 255];
  };
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const inPage = (r) => r.y < H && r.y + r.h > 0 && r.w > 0;

  // Headings (tight text boxes) + any large display text (many sites style divs/spans as headings)
  const headings = [];
  const seenH = new Set();
  const pushHeading = (el, text) => {
    const range = document.createRange(); range.selectNodeContents(el);
    const rr = range.getBoundingClientRect();
    const r = { x: rr.left + scrollX, y: rr.top + scrollY, w: rr.width, h: rr.height };
    if (!inPage(r) || r.w < 20) return;
    const cs = getComputedStyle(el);
    seenH.add(el);
    headings.push({ ...r, text, tag: el.tagName.toLowerCase(), fontSize: parseFloat(cs.fontSize), fontWeight: +cs.fontWeight || 400 });
  };
  for (const el of document.querySelectorAll('h1,h2,h3,[role=heading]')) {
    if (!visible(el)) continue;
    const text = txt(el);
    if (!text || text.length > 140) continue;
    pushHeading(el, text);
  }
  for (const el of document.querySelectorAll('body div,body span,body p,body a,body strong,body h4,body h5,body h6')) {
    if (seenH.has(el) || el.closest('h1,h2,h3,[role=heading]')) continue;
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 34 || !visible(el)) continue;
    const text = txt(el);
    if (!text || text.length > 80) continue;
    pushHeading(el, text);
  }

  // Short text runs used to label cards/media (titles, captions)
  const texts = [];
  for (const el of document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,strong,b,figcaption,li,[class*=title],[class*=heading],[class*=caption]')) {
    if (texts.length > 1500) break;
    const text = txt(el);
    if (!text || text.length < 4 || text.length > 160 || !visible(el)) continue;
    const r = rect(el);
    if (!inPage(r)) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    texts.push({ ...r, text, fs, strong: /^h[1-6]$/.test(el.tagName.toLowerCase()) || +getComputedStyle(el).fontWeight >= 600 });
  }

  // Sections: recursively split full-width wrappers into vertical bands
  const kids = (el) => [...el.children].filter((c) => visible(c) && c.getBoundingClientRect().width >= W * 0.75 && c.getBoundingClientRect().height >= 80);
  const expand = (n, d) => {
    const k = kids(n);
    if (d > 14) return [n];
    if (k.length === 1) return expand(k[0], d + 1);
    if (k.length >= 2 && n.getBoundingClientRect().height > H * 0.4) return k.flatMap((c) => expand(c, d + 1));
    return [n];
  };
  // Prefer the top tier of heading sizes (visual section titles); fall back to DOM bands.
  const below = headings.filter((h) => h.y > innerHeight * 0.5 && h.text.length <= 60);
  const wordy = (h) => /[a-z\u00C0-\uFFFF]{3,}/i.test(h.text);
  const tierMax = Math.max(0, ...below.filter(wordy).map((h) => h.fontSize));
  const want = Math.min(5, Math.floor(H / (innerHeight * 1.5)));
  let major = [];
  for (const f of [0.8, 0.65, 0.5]) {
    major = below.filter((h) => wordy(h) && h.fontSize >= Math.max(24, tierMax * f));
    if (major.length + 1 >= want) break;
  }
  let tops = major.length >= 2
    ? major.map((h) => Math.max(0, h.y - 160))
    : expand(document.body, 0).map((n) => rect(n).y);
  tops = tops.filter((y) => y >= 0 && y < H - 200).sort((a, b) => a - b);
  tops = [0, ...tops].filter((y, i, a) => i === 0 || y - a[i - 1] > 40);
  let bands = tops.map((y, i) => ({ y0: i === 0 ? 0 : y, y1: i < tops.length - 1 ? tops[i + 1] : H }));
  bands = bands.reduce((acc, b) => { // merge tiny bands into the previous one
    if (acc.length && b.y1 - b.y0 < 320) acc[acc.length - 1].y1 = b.y1; else acc.push(b);
    return acc;
  }, []);
  if (bands.length > 1 && bands[0].y1 - bands[0].y0 < 320) { bands[1].y0 = 0; bands.shift(); }
  // Split very long bands at their largest inner heading so color/dwell rhythm stays even
  for (let pass = 0; pass < 4; pass++) {
    const next = [];
    for (const b of bands) {
      if (b.y1 - b.y0 < innerHeight * 3.5) { next.push(b); continue; }
      const cand = headings
        .filter((h) => wordy(h) && h.fontSize >= 22 && h.y - 160 > b.y0 + innerHeight && h.y < b.y1 - innerHeight)
        .sort((x, y) => y.fontSize - x.fontSize || Math.abs((x.y - (b.y0 + b.y1) / 2)) - Math.abs((y.y - (b.y0 + b.y1) / 2)))[0];
      if (!cand) { next.push(b); continue; }
      const cut = Math.round(cand.y - 160);
      next.push({ y0: b.y0, y1: cut }, { y0: cut, y1: b.y1 });
      major.push(cand);
    }
    bands = next;
  }
  while (bands.length > 12) { // merge smallest adjacent pair
    let mi = 0, ms = Infinity;
    for (let i = 0; i < bands.length - 1; i++) { const s = bands[i + 1].y1 - bands[i].y0; if (s < ms) { ms = s; mi = i; } }
    bands[mi].y1 = bands[mi + 1].y1; bands.splice(mi + 1, 1);
  }
  const sections = bands.map((b, i) => {
    const pool = major.length >= 2 ? major : headings;
    const inBand = (h) => h.y >= b.y0 - 10 && h.y < b.y1 - 40;
    const hs = pool.some(inBand) ? pool.filter(inBand) : headings.filter(inBand);
    const best = hs.slice().sort((a, c) => c.fontSize - a.fontSize || a.y - c.y)[0];
    return { index: i, y0: Math.round(b.y0), y1: Math.round(b.y1), label: best ? short(best.text, 22) : i === 0 ? short(document.title.split(/\s[|–—-]\s|:\s/)[0], 22) || 'Home' : `Section ${String(i + 1).padStart(2, '0')}`, titleY: best ? Math.round(best.y) : Math.round(b.y0 + 80) };
  });

  // Blocks: media + cards
  const blocks = [];
  for (const el of document.querySelectorAll('img,video,canvas,svg,iframe,picture,[role=img]')) {
    if (el.tagName.toLowerCase() !== 'svg' && el.closest('svg')) continue;
    if (!visible(el)) continue;
    const r = rect(el);
    if (!inPage(r) || r.w < 110 || r.h < 70) continue;
    if (r.w > W * 0.96 && r.h > 520) continue; // full-bleed backdrop, keep on runway
    blocks.push({ kind: 'media', ...r, label: '', alt: clip(el.getAttribute('alt') || el.getAttribute('aria-label') || el.getAttribute('title') || '', 46) });
  }
  const all = document.querySelectorAll('body *');
  for (let i = 0; i < all.length && i < 12000; i++) {
    const el = all[i];
    const tag = el.tagName.toLowerCase();
    if (/^(img|svg|path|video|canvas|iframe|picture|source|script|style|br|span|a|b|i|strong|em|p|li|h[1-6])$/.test(tag)) continue;
    const r0 = el.getBoundingClientRect();
    if (r0.width < 160 || r0.height < 90 || r0.width > W * 0.94 || r0.height > 1400) continue;
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    const bg = color(cs.backgroundColor);
    const pbg = effBg(el.parentElement);
    const bgDiff = bg && dist(bg, pbg) > 18;
    const shadow = cs.boxShadow && cs.boxShadow !== 'none';
    const border = parseFloat(cs.borderTopWidth) > 0 && !!color(cs.borderTopColor);
    const radius = parseFloat(cs.borderTopLeftRadius) || 0;
    const bgImg = cs.backgroundImage && cs.backgroundImage !== 'none';
    const score = (bgDiff ? 2 : 0) + (shadow ? 2 : 0) + (border ? 1 : 0) + (radius >= 4 ? 1 : 0) + (bgImg ? 1 : 0);
    if (score < 2 || !(bgDiff || shadow || border || bgImg)) continue;
    const r = rect(el);
    if (!inPage(r)) continue;
    const t = el.querySelector('h1,h2,h3,h4,h5,h6,strong,b,[class*=title],[class*=heading]');
    blocks.push({ kind: 'card', ...r, label: clip(t ? txt(t) : '', 46) });
  }
  // dedupe near-identical rects (keep outer / first)
  const iou = (a, b) => {
    const ix = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
    const iy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
    const I = ix * iy; return I / (a.w * a.h + b.w * b.h - I);
  };
  const kept = [];
  for (const b of blocks.sort((a, c) => c.w * c.h - a.w * a.h)) {
    if (kept.some((k) => iou(k, b) > 0.82)) continue;
    kept.push(b);
  }
  const contains = (a, b) => b.x >= a.x - 2 && b.y >= a.y - 2 && b.x + b.w <= a.x + a.w + 2 && b.y + b.h <= a.y + a.h + 2;
  const media = kept.filter((b) => b.kind === 'media').slice(0, 90);
  const cards = kept.filter((b) => b.kind === 'card').slice(0, 90);
  const finalBlocks = [...cards, ...media].map((b) => ({ ...b, x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.w), h: Math.round(b.h) }));
  for (const b of finalBlocks) b.depth = Math.min(3, finalBlocks.filter((o) => o !== b && o.w * o.h > b.w * b.h && contains(o, b)).length);
  // Fill missing labels: strongest text inside the block, else a caption just below it
  for (const b of finalBlocks) {
    if (b.label) continue;
    const inside = texts.filter((t) => contains(b, t)).sort((a, c) => (c.strong - a.strong) || (c.fs - a.fs) || (a.y - c.y))[0];
    const below = texts
      .filter((t) => t.y >= b.y + b.h - 8 && t.y <= b.y + b.h + 140 && t.x < b.x + b.w && t.x + t.w > b.x)
      .sort((a, c) => a.y - c.y || (c.strong - a.strong))[0];
    const pick = inside || below;
    b.label = pick ? clip(pick.text, 46) : b.alt || '';
    delete b.alt;
  }
  for (const b of finalBlocks) delete b.alt;

  // Hero = biggest heading within the first ~1.6 screens
  const heroCand = headings.filter((h) => h.y < innerHeight * 1.6 && h.fontSize >= 28).sort((a, b) => b.fontSize - a.fontSize)[0] || null;

  // Brand accent: most common saturated button/link background
  const tally = new Map();
  for (const el of document.querySelectorAll('a,button,[class*=btn],[class*=button],[class*=badge],[class*=tag]')) {
    const c = color(getComputedStyle(el).backgroundColor) || null;
    if (!c) continue;
    const mx = Math.max(...c), mn = Math.min(...c);
    if (mx - mn < 60) continue;
    const r = el.getBoundingClientRect();
    const key = c.join(',');
    tally.set(key, (tally.get(key) || 0) + Math.max(1, r.width * r.height));
  }
  const brand = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]?.split(',').map(Number) || null;

  const title = clean(document.title);
  return {
    title,
    siteName: clip(title.split(/\s[|–—-]\s|:\s/)[0], 24),
    host: location.host.replace(/^www\./, ''),
    width: W,
    height: Math.round(H),
    viewportHeight: innerHeight,
    pageBg: effBg(document.body),
    brand,
    sections,
    headings: headings.map((h) => ({ ...h, x: Math.round(h.x), y: Math.round(h.y), w: Math.round(h.w), h: Math.round(h.h) })),
    hero: heroCand ? { text: heroCand.text, x: Math.round(heroCand.x), y: Math.round(heroCand.y), w: Math.round(heroCand.w), h: Math.round(heroCand.h), fontSize: heroCand.fontSize } : null,
    blocks: finalBlocks,
  };
}

if (isMain(import.meta.url)) {
  const a = parseArgs(process.argv.slice(2));
  if (!a._[0]) {
    console.error('usage: node scripts/capture.mjs <url> [--out out/<slug>] [--width 1200] [--max-height 32000] [--scale 1]');
    process.exit(1);
  }
  const url = a._[0];
  await capture({
    url,
    out: a.out || path.join('out', slugFromUrl(url)),
    width: +(a.width || 1200),
    maxHeight: +(a['max-height'] || 32000),
    scale: +(a.scale || 1),
    waitMs: +(a.wait || 1500),
  });
}
