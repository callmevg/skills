#!/usr/bin/env node
// Stage 2: capture dir -> MP4 (or stills / live preview) by stepping the Three.js scene frame by frame.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseArgs, isMain } from './lib/args.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png' };

export function serve(captureDir, port = 0) {
  const routes = [
    ['/three/', path.join(ROOT, 'node_modules/three')],
    ['/capture/', captureDir],
    ['/', path.join(ROOT, 'scripts/scene')],
  ];
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const [prefix, dir] = routes.find(([p]) => url.startsWith(p));
    let file = path.join(dir, url.slice(prefix.length) || 'index.html');
    if (!file.startsWith(dir)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404).end('not found'); return; }
      res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(buf);
    });
  });
  return new Promise((r) => server.listen(port, '127.0.0.1', () => r({ server, port: server.address().port })));
}

function launchArgs(gpu) {
  if (gpu === 'swiftshader') return ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'];
  if (os.platform() === 'darwin') return ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'];
  return ['--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'];
}

export async function render(opts) {
  const {
    dir, width = 1080, height = 1080, fps = 30, duration, style = 'duotone', palette = 'editions', title = '',
    stills = 0, output, gpu = 'auto', crf = 18, log = console.log,
  } = opts;
  const captureDir = path.resolve(dir, 'capture');
  if (!fs.existsSync(path.join(captureDir, 'layout.json'))) throw new Error(`no capture found at ${captureDir} — run capture first`);
  const { server, port } = await serve(captureDir);
  const q = new URLSearchParams({ render: '1', w: width, h: height, fps, style, palette, pr: gpu === 'swiftshader' ? 1 : 2 });
  if (duration) q.set('duration', duration);
  if (title) q.set('title', title);
  const url = `http://127.0.0.1:${port}/index.html?${q}`;

  const browser = await chromium.launch({ args: launchArgs(gpu) });
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);
  try {
    await page.waitForFunction(() => window.__ready || window.__sceneError, null, { timeout: 120000 });
  } catch (e) {
    throw new Error(`scene failed to load: ${errors.join(' | ') || e.message}`);
  }
  const info = await page.evaluate(() => (window.__sceneError ? { error: window.__sceneError } : { duration: window.__scene.duration, title: window.__scene.title, sections: window.__scene.sections }));
  if (info.error) throw new Error(`scene error: ${info.error}`);
  log(`[render] "${info.title}" · ${info.sections.length} sections · ${info.duration.toFixed(1)}s @ ${fps}fps · ${width}x${height}`);

  const shot = () => page.screenshot({ type: 'jpeg', quality: 95, clip: { x: 0, y: 0, width, height } });
  const outDir = path.resolve(dir);
  const result = { files: [] };

  if (stills > 0) {
    const sd = path.join(outDir, 'stills');
    await fsp.rm(sd, { recursive: true, force: true });
    await fsp.mkdir(sd, { recursive: true });
    // Step through the timeline sequentially so smoothed overlay state is valid.
    const step = 1 / fps, marks = Array.from({ length: stills }, (_, i) => (info.duration * (i + 0.5)) / stills);
    let mi = 0;
    for (let t = 0; t <= info.duration && mi < marks.length; t += step) {
      await page.evaluate(([tt, dt]) => window.__scene.frame(tt, dt), [t, step]);
      if (t + step > marks[mi]) {
        const f = path.join(sd, `still_${String(mi).padStart(2, '0')}_${t.toFixed(1)}s.jpg`);
        await fsp.writeFile(f, await shot());
        result.files.push(f); mi++;
      }
    }
    const cols = Math.ceil(Math.sqrt(stills));
    const sheet = path.join(outDir, 'contact-sheet.jpg');
    const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-pattern_type', 'glob', '-i', path.join(sd, 'still_*.jpg'), '-vf', `scale=480:-1,tile=${cols}x${Math.ceil(stills / cols)}`, '-frames:v', '1', sheet]);
    if (r.status === 0) { result.sheet = sheet; log(`[render] contact sheet -> ${sheet}`); }
    log(`[render] ${result.files.length} stills -> ${sd}`);
  } else {
    const out = path.resolve(output || path.join(outDir, 'scroll.mp4'));
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', String(crf), '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exited ' + c)))));
    const total = Math.round(info.duration * fps);
    const t0 = Date.now();
    for (let i = 0; i <= total; i++) {
      await page.evaluate(([tt, dt]) => window.__scene.frame(tt, dt), [i / fps, 1 / fps]);
      const buf = await shot();
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
      if (i % fps === 0) process.stdout.write(`\r[render] frame ${i}/${total} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
    ff.stdin.end();
    await done;
    process.stdout.write('\n');
    result.video = out;
    log(`[render] video -> ${out}`);
  }
  if (errors.length) log(`[render] page warnings: ${[...new Set(errors)].slice(0, 5).join(' | ')}`);
  await browser.close();
  server.close();
  return result;
}

if (isMain(import.meta.url)) {
  const a = parseArgs(process.argv.slice(2));
  const dir = a._[0];
  if (!dir) {
    console.error('usage: node scripts/render.mjs <out/slug> [--size 1080 | --width W --height H] [--fps 30] [--duration s] [--style duotone|original] [--palette editions|brand|mono|night|#hex,#hex] [--title "Text"] [--stills 9] [--serve] [--gpu auto|swiftshader]');
    process.exit(1);
  }
  if (a.serve) {
    const { port } = await serve(path.resolve(dir, 'capture'), +(a.port || 5173));
    console.log(`[preview] http://127.0.0.1:${port}/index.html  (space = pause, wheel/arrows = scrub, Ctrl+C to stop)`);
  } else {
    const size = a.size ? +a.size : null;
    await render({
      dir,
      width: +(a.width || size || 1080),
      height: +(a.height || size || 1080),
      fps: +(a.fps || 30),
      duration: a.duration ? +a.duration : undefined,
      style: a.style, palette: a.palette, title: a.title,
      stills: a.stills === true ? 9 : +(a.stills || 0),
      output: a.output, gpu: a.gpu || 'auto', crf: +(a.crf || 18),
    });
  }
}
