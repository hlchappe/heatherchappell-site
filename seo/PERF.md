# Performance / Core Web Vitals: heatherchappell.com

Targets (mobile, 75th percentile, the 2026 "good" thresholds): **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1**.

Measured 2026-11-22 with Lighthouse (npx lighthouse, mobile preset: simulated slow 4G + 4x CPU), headless Chrome, served locally.
Two servers: `python3 -m http.server` (no compression, worst case) and a gzip server (closer to a real WordPress/Apache host, which compresses HTML/JS).
Google Fonts are blocked in the test sandbox, so font timing isn't in these numbers (see "Not done" below).

## Homepage, before → after

| Run | Score | FCP | LCP | TBT | CLS | Page weight | HTML on the wire |
|---|---|---|---|---|---|---|---|
| Before, uncompressed | 73 | 4.5 s | 4.5 s | 10 ms | 0.011 | 918 KiB | 630 KB |
| Before, gzip (approx.*) | 94 | 2.4 s | 2.4 s | 0–30 ms | 0.011 | 348 KiB | 208 KB |
| **After, gzip** | **99** | **1.7 s** | **1.7 s** | **0 ms** | **0** | 212 KiB | **63 KB** |
| After, uncompressed | 95 | 2.4 s | 2.4 s | 0 ms | 0 | 356 KiB | 188 KB |

\*The gzip "before" is today's page with the four games and full deep-dive texts put back inline and .jpg images, since the original index.html was overwritten.

LCP element on mobile: the hero text (`.hero h1` / `p.sub`). There are no photos in the first screen.

**INP (lab proxy):** event-timing entries in headless Chrome, 4x CPU throttle, mobile viewport, tapping each cabinet, the reader and its arrows, the nav and the keyboard.
Worst interaction went from **408 ms to 168 ms** (opening a game cabinet). Reader "next page" went from 120 ms to 72 ms. Everything else was under 100 ms.

## Prerendered pages (after, gzip)

| Page | Score | LCP | CLS |
|---|---|---|---|
| /deep-dives/ | 99 | 1.7 s | 0 |
| /deep-dives/nvidia-sec-probe/ | 98 | 1.8 s | 0 |
| /story/ | 99 | 1.7 s | 0 |
| /side-eye/ | 99 | 1.7 s | 0.007 |
| /side-eye/vol-1/napoleon/ | 97 | 2.3 s | 0 |
| /episodes/ | 99 | 1.8 s | 0 |
| /work/ | 99 | 1.7 s | 0 |

## What changed

1. **Games load on demand** (`build.py`, `template.html` game-cabinet block). The four game modules (~227 KB of JS) are no longer inlined. Cabinets render from `window.HC_GAME_META` (title, tagline, and `src` with a content hash), which `build.py` reads from each module with node, with a hard-coded fallback. `games/<id>.js` loads when a cabinet is hovered, focused or touched, and at the latest when it's clicked. The dialog paints first and the game mounts on the next frame. Load failure shows the existing "out of order" message.
2. **Deep-dive texts load on demand.** The full texts (~225 KB) now go to `dives.js`, which `build.py` writes. The page keeps a stub per slug (`{"slug":{"_stub":1}}`), so links still know which dives exist. `dives.js` loads only when a `#dive-<slug>` hash view opens (local file preview or old links). Prerendered `/deep-dives/<slug>/` pages are server-rendered and don't need it. Both work over `file://` because they are plain `<script src>` loads, not fetch.
3. **WebP images.** `build.py` writes a `.webp` next to every jpg/png in `assets/` and `issue*/` (quality 80, only when it is missing or older than the original). The original files stay, and config.json still points at the `.jpg`. The page script asks for the `.webp` (`wp()` helper) and falls back to the original if the WebP is missing (capture-phase error listener). Size savings: cover 148→103 KB, episode thumbs about 40% smaller, headshot 66→46 KB, magazine pages 21→17 MB in total. Reader pages and their prefetches use WebP, and prefetched pages are pre-decoded with `img.decode()`.
4. **Server-rendered `<img>` tags** (last step of `build.py`, after `seo/prerender.py`). Every written page gets the `.webp` src when it exists on disk, which is the same URL the script requests, so nothing downloads twice. Every image also gets `decoding="async"`. Images get `loading="lazy"`, except the first image of each subpage's own view, which gets `fetchpriority="high"` (the cover on /side-eye/, the page image on articles, the first thumbnail on /episodes/). Subpages are full copies of the homepage with the home sections hidden, so without this the hidden cover, thumbnails and headshot downloaded on every deep-dive page. Now /deep-dives/* loads zero images.
5. **CLS fix.** The marquee strip was empty until script filled it, which pushed the whole page down 10 px (CLS 0.011). An empty `#marq` now gets a non-breaking-space line box (`.marq div:empty::before`), so it has its final height from the first paint. The fix is in its own small `<style>` before `</head>`.
6. Width and height attributes on script-rendered cover, featured-episode and headshot images. Their CSS boxes already have fixed aspect ratios, so this is belt-and-braces.

## Deploy note
Upload **`games/`** and **`dives.js`** along with index.html, assets/, issue1/ and the prerendered folders (README updated). Without `games/`, cabinets show "This cabinet is out of order."

## Not done / follow-ups (optional)
- **Fonts.** Google Fonts CSS is render-blocking. It's already preconnected with `display=swap`, which Lighthouse says could save up to about 750 ms. I left it alone: loading it async would make Archivo Black/Fraunces swap in visibly and risk CLS, and the sandbox blocks Google Fonts, so it couldn't be tested here. Trimming weights isn't worth it either: Fraunces is one variable file per style, and the story uses 700/italic 700 (rendered from the 800 instance). The best next step is to self-host WOFF2 subsets (Latin only) with `<link rel=preload>`.
- **Caching headers** (Lighthouse "cache" insight, about 150 KiB on repeat visits). In the host's .htaccess, cache `/assets/`, `/issue1/` and `/games/` for 30 days, or longer, since game/dive URLs carry `?v=<hash>`. Don't overwrite WordPress's existing .htaccess. Add a block.
- **/side-eye/ CLS 0.007.** The page script re-renders the prerendered `#issue` block with slightly different markup. To get it to 0, prerender.py's issue fragment should match `template.html`'s issue markup exactly (seo agent's file).
- The arcade backdrop's `backdrop-filter: blur(3px)` costs some paint time on open. It's barely visible behind the 86% black layer. Removing it would shave a little more off the 168 ms, but it is a design choice, so I left it.
