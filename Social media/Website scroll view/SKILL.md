---
name: website-scroll-view
description: Turn any website URL into an "expo mode" 3D scroll video — the page laid out as a long tinted runway that bends up into a wall, cards raised as 3D slabs, extruded hero title, node-graph section markers, callouts, nav rail and wireframe props (Shopify Editions style, see posts.design/kazden-all-the-work-that-goes-into-editions-2026-10-28). Use when the user asks for a website scroll visual, 3D site flythrough, expo-mode / runway video, social post or reel of a website, or "make a video like the Editions one" for a URL.
---

# Website scroll view

Generates a social-ready MP4 (default 1080×1080, 30 fps) from a URL, in the style of the Shopify Editions "expo mode" clip by @kazdenc:
a black void, the web page as a long runway in perspective, one vivid color per section, UI cards popping up as 3D slabs with their original pixels, white callouts with leader lines, a mono nav rail on the left, and an end HUD.

Read [references/visual-anatomy.md](references/visual-anatomy.md) to see what each element of the reference is and where it lives in the code before you change the look.

## Pipeline

```
URL ──capture.mjs──▶ out/<slug>/capture/{tile_###.jpg, layout.json}
                      (Playwright: dismiss banners, unlock lazy content, scroll-and-shoot tiles,
                       detect sections / cards / media / headings / brand color)
    ──render.mjs───▶ out/<slug>/scroll.mp4   (or stills/ + contact-sheet.jpg)
                      (static server + headless Chromium runs scene/ (three.js),
                       steps it frame-by-frame, pipes JPEGs into ffmpeg/libx264)
```

`scripts/make.mjs` runs both stages.

## Setup (once)

Requires Node 18+ and `ffmpeg` on PATH.

```bash
cd "<this skill folder>"
npm install
npx playwright install chromium
```

## Workflow

Do these steps in order. Don't skip the stills preview: it is quick (~5 s) and catches nearly every problem.

1. **Clarify the brief** if needed: the URL, the format (`1:1` 1080×1080 default · `9:16` 1080×1920 for Reels/Shorts/TikTok · `16:9` 1920×1080), the duration (auto unless asked), and the palette (the reference uses `editions`; offer `brand` if they want their colors).
2. **Capture + preview stills**
   ```bash
   node scripts/make.mjs https://example.com --stills 9
   ```
   This writes `out/<slug>/contact-sheet.jpg`. **Open the image and check it** against the QA checklist below.
3. **Fix what the checklist shows** using the controls below. Use `--skip-capture` when only render settings change. Re-run stills.
4. **Render the video**
   ```bash
   node scripts/make.mjs https://example.com --skip-capture [--size 1080 | --width 1080 --height 1920] [--palette …] [--title …]
   ```
5. **Verify the output.** Pull a few frames (`ffmpeg -ss 5 -i out/<slug>/scroll.mp4 -frames:v 1 f.jpg`) and look at them. Report the MP4 path, duration, size, and the section names that were detected.

To preview live in a browser, run `node scripts/render.mjs out/<slug> --serve` and open the printed URL. Space pauses; the mouse wheel or arrow keys scrub.

## Controls

| Flag | Default | Effect |
|---|---|---|
| `--size N` / `--width W --height H` | 1080² | Output frame. The camera keeps about 50° across the narrow side, so 9:16 and 16:9 frame correctly. |
| `--fps` | 30 | Frame rate |
| `--duration s` | auto | Auto = `5 + 1.6×sections + pageHeight/1800`, clamped to 12–40 s |
| `--palette` | `editions` | `editions` (blue → purple → magenta → orange → green, last section dark), `brand` (hue steps from the site's CTA color), `night`, `mono`, or a custom `"#1f1bd1,#cc128a,…"` |
| `--style` | `duotone` | `duotone` tints the runway with the section color (light text becomes white). `original` keeps the real page colors. |
| `--title "Text"` | auto | Extruded hero word. Auto picks the hero heading or the site name, up to 14 chars. One short word looks best, like "Exponential" in the reference. |
| `--max-height px` | 32000 | Capture cap for very long pages. Lower it for shorter, punchier videos. |
| `--capture-width px` | 1200 | Desktop layout width used for the capture |
| `--scale` | 1 | Capture device scale factor. Use 2 for crisper cards (slower, more memory). |
| `--wait ms` | 1500 | Extra settle time after load, for heavy SPAs |
| `--gpu swiftshader` | auto | Force software GL, for CI or Linux without a GPU |
| `--out dir` / `--output file.mp4` | `out/<slug>` | Output locations |

## QA checklist (check the contact sheet)

- [ ] **Sections**: 4–12 colored bands, with nav rail labels that are real section names, not `Section 03`. If you see too few or wrong ones, see Troubleshooting.
- [ ] **Runway is legible**: section titles read as white text on the color. No large washed-out or blank tiles.
- [ ] **Cards rise**: raised slabs show real UI or photos, not empty white or black boxes.
- [ ] **Hero**: the extruded title is fully on-screen in frames 1–2 and spelled right.
- [ ] **Callouts**: white labels are short, real titles, not alt-text sentences or nav junk.
- [ ] **No overlays**: no cookie or consent banners, chat bubbles, or "sign up" modals in the tiles.
- [ ] **Ending**: the last ~2.5 s dims with the `start ↑` HUD and the `page W = … px` ruler.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Tiles blank or black in parts | The content reveals on scroll. Raise `--wait 3000`. Capture already waits for in-view images per tile. |
| Cookie or consent banner visible | Capture clicks common accept/close buttons. For stubborn ones, add the button text to the regex in `dismissBanners()` (`scripts/capture.mjs`). |
| Only 1–2 sections, or names like `Section 02` | The site has no clear heading tier. Pass `--palette` and `--duration` to compensate, or edit `layout.json` (`sections[].label/y0/y1/titleY`) and re-render with `--skip-capture`. |
| Page height ≈ viewport, so the video is very short | The site scrolls an inner container. `unlockInnerScroller()` handles common cases. Otherwise capture a specific long sub-page. |
| Bot wall, login, or 403 | Use a public URL. Don't bypass auth or bot protection. |
| Slow or GPU errors on Linux/CI | `--gpu swiftshader`. Software rendering is about 5–10× slower but works headless. |
| Video too fast or slow | `--duration`. Dwell per section and glide time scale automatically. |

Editing `out/<slug>/capture/layout.json` by hand is supported: rename sections, delete noisy blocks, or shorten labels, then re-render with `--skip-capture`.

## Tuning the look (code map)

- Camera height, distance, and look-ahead: `CAM` in `scripts/scene/scene.js`. Timeline dwell and glide: `keys` in the same file.
- Bend (where the runway curls into a wall, and its radius): `U.uBendStart` / `U.uBendR` in `scripts/scene/core.js`.
- Palettes: `PALETTES` in `scripts/scene/core.js`.
- Duotone formula, slab height `LIFT`, rise distance, hero extrusion, constellation, props, and ticks: `scripts/scene/world.js`.
- Callouts, nav curves, chips, tags, and the end HUD: `scripts/scene/overlay.js`. CSS lives in `scripts/scene/index.html`.

After any change, re-run `--stills 9` and look at the sheet before rendering the video.

## Etiquette

Only capture public pages the user is entitled to use. Logos, product shots, and copy remain the site owner's property. When sharing, credit the site and the original Editions design inspiration (@kazdenc / Shopify).
