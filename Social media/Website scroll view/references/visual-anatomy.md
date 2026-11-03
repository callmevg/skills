# Visual anatomy of the reference

Reference: Kazden (@kazdenc), *"all the work that goes into editions is a huge labor of love"*, Shopify Editions "expo mode", 1080×1080, 27 s.
Source: https://posts.design/kazden-all-the-work-that-goes-into-editions-2026-10-28

Below are the reference's elements in the order a viewer notices them. Each one maps to its implementation.

| # | Element in the reference | What makes it work | Implementation |
|---|---|---|---|
| 1 | **Black void** with thin white curved guide lines sweeping up on both sides | Gives depth and speed with no texture noise | Ground polylines outside the runway that share the bend shader (`world.js` → "Ground guide lines") |
| 2 | **Page as a runway**: the full page lies flat, fills the bottom of the frame, and curls up into a vertical wall in the distance | Reads as "the whole site" while keeping focus near the camera. Already-read content climbs the wall. | One plane per screenshot tile. A vertex `bendPos()` curls everything beyond `uFocusZ - uBendStart` around radius `uBendR` (`core.js`). |
| 3 | **One vivid color per section** (blue → purple → magenta → orange-red → green → black), with hard color steps at section boundaries | Gives each chapter a rhythm. The color step is the cut. | Duotone fragment shader maps per-pixel luminance (inverted on light rows via a per-row bg-luminance texture) to section color → white (`world.js` tile material, `page.js` row texture) |
| 4 | **White section titles** ("Marketing", "Online") on the runway, slightly offset by perspective | Big type is the chapter card | The page's own headings come out white through the duotone, so no extra geometry is needed |
| 5 | **Cards rise as 3D slabs** that keep their original UI pixels, with thin light edges and soft drop shadows | The "product" stays real and colorful on the tinted runway | `BoxGeometry` per detected card/media block. Top face = page crop. Height animates with distance (`lift`). Edges and shadow planes (`world.js` → "Raised blocks"). |
| 6 | **Extruded hero word** ("Exponential") lying on the runway and reading away from the viewer | Instant 3D signal in frame one | 120 stacked alpha-tested text planes, gray → white (`world.js` → "Hero") |
| 7 | **Constellation / node graph**: small thumbnail squares floating above rings, with spokes to centers labeled `06 Payments` | Shows the "everything in this release" scale | Rings plus spokes plus floating thumbnail quads from each section's biggest media. Mono `.tag` labels (`world.js` → "Sitemap constellation") |
| 8 | **Section chip** (outlined mono label on section color) with a particle burst and floating thumbs at each boundary | Marks the transition between chapters | `star()` + `burst()` + `.chip` anchor (`world.js` → "Section boundary nodes") |
| 9 | **Left nav rail**: mono list of sections. The active one turns white, and thin curves run from its dot to items on the runway. | Orientation, and an "interface" feel | `.nav` + SVG cubic curves to visible blocks/headings of the active section (`overlay.js`) |
| 10 | **Callouts**: large white sans labels beside the runway with an underline leader to a card corner | Tells the story without voice-over | `.co` elements, side picked by card position, smoothed fade, collision-avoided (`overlay.js`) |
| 11 | **Technical annotations**: page-y ticks (500, 1000, …), formulas (`y = e^(−x) cos(ωx+φ)`), dimension marks (`1.4 m`, `x(t)`, `z(t)`), ghost section names in gray | A "blueprint / engineering" texture that rewards pausing | `.tag` / `.ghost` anchors projected through the same bend (`world.js` → "Annotations") |
| 12 | **Wireframe props**: cubes, polyhedra, towers drifting beside the runway | Parallax and playfulness | `EdgesGeometry` line meshes slowly rotating (`world.js` → "Wireframe props") |
| 13 | **Pacing**: glide, then a beat on each section title, then glide again. About 1,600 px of page per second. | Readable yet energetic | Monotone cubic timeline with dwell keys at every section title (`scene.js`) |
| 14 | **Outro HUD**: screen dims, then a `start ↑` button, a key-hint bar (space / ← → A D / ↑ ↓ / speed / scroll length) and a `page W = … px` ruler | Reveals the "it's interactive" twist | `.dim` + `.hud` fade over the last 2.6 s (`overlay.js`, `index.html`) |
| 15 | **"Back" chip** bottom-left | UI chrome that sells "this is a real site mode" | `.back` (`overlay.js`) |

## Style constants worth keeping

- Typography: mono (SF Mono / JetBrains Mono) for every technical label; a neutral grotesk (Inter / Helvetica Neue) for callouts. Labels are white or 55% gray only.
- Lines: 1 px white at 40–80% opacity. Never thicker.
- Colors: fully saturated mid-luminance section colors (L ≈ 40–50%). Light text becomes about 93% white. Avoid pastels, because white text must pop.
- Motion: no camera cuts. Sway at most about 0.3 units. Ease everything.
- Density: at most about 3 callouts on screen. Nav curves only to the active section.

## Adapting to a new site

Change these for a new site: the palette (brand or editions), the hero word, and the duration. Keep everything else in the table, because together those elements are the look.
