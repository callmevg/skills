#!/usr/bin/env node
// One-shot: URL -> capture -> render (video, or stills with --stills).
import path from 'node:path';
import { capture } from './capture.mjs';
import { render } from './render.mjs';
import { parseArgs, slugFromUrl } from './lib/args.mjs';

const a = parseArgs(process.argv.slice(2));
const url = a._[0];
if (!url || !/^https?:\/\//.test(url)) {
  console.error(`usage: node scripts/make.mjs <https://url> [options]

capture:  --capture-width 1200  --max-height 32000  --scale 1  --wait 1500  --skip-capture
render:   --size 1080 | --width 1080 --height 1920   --fps 30   --duration <sec>
style:    --style duotone|original   --palette editions|brand|night|mono|"#hex,#hex,..."   --title "Hero"
output:   --out out/<slug>   --output file.mp4   --stills 9 (contact sheet instead of video)`);
  process.exit(1);
}
const out = a.out || path.join('out', slugFromUrl(url));
const t0 = Date.now();
if (!a['skip-capture']) {
  await capture({
    url, out,
    width: +(a['capture-width'] || 1200),
    maxHeight: +(a['max-height'] || 32000),
    scale: +(a.scale || 1),
    waitMs: +(a.wait || 1500),
  });
}
const size = a.size ? +a.size : null;
const res = await render({
  dir: out,
  width: +(a.width || size || 1080),
  height: +(a.height || size || 1080),
  fps: +(a.fps || 30),
  duration: a.duration ? +a.duration : undefined,
  style: a.style, palette: a.palette, title: a.title,
  stills: a.stills === true ? 9 : +(a.stills || 0),
  output: a.output, gpu: a.gpu || 'auto', crf: +(a.crf || 18),
});
console.log(`[make] done in ${((Date.now() - t0) / 1000).toFixed(0)}s → ${res.video || res.sheet}`);
