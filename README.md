# History

An animated single-page site covering **10,000 BC → today**: the powers that dominated
the world in each era, the banners they flew, the turning points, and the people who
bent the story.

No build step, no dependencies, no framework. Open `index.html` and it runs.

## What's in it

| Section | What it does |
|---|---|
| **Time Machine** | Drag a slider across twelve millennia. The banner, ruling power, peak land area, share of humanity, world population and *who was alive that year* all update live. The scale is non-linear so recent centuries get the room they need. |
| **Dominant Powers** | 31 powers ranked two ways — by land area and by share of all living humans. Animated bars, plus a scrollable strip of every banner in chronological order. Click any one to jump the Time Machine there. |
| **Timeline** | 64 turning points grouped into 9 eras, with a scroll-driven glowing spine and reveal-on-scroll entries. |
| **Figures** | 82 people from Imhotep to Tim Berners-Lee, filterable by era. Every card carries a generated portrait immediately; the real Wikipedia photograph fades in on top once it loads. |
| **Quiz** | 10 questions drawn at random from a pool, with explanations. Score 7+ and you unlock a downloadable certificate. |

## Portraits

Each card draws its own portrait as inline SVG — an era-tinted gradient, concentric
rings, a bust silhouette and the figure's monogram — so a card is **never blank**, even
before the network answers or if Wikipedia is unreachable entirely. When the live fetch
succeeds, the real photograph cross-fades in over the drawn one. A shimmer marks the
in-between state.

## Certificate

Finish the quiz with **7 or more correct** and a certificate unlocks, graded
*Pass* (7–8), *Distinction* (9) or *Perfect score* (10).

You put your **own name** on it: the field is focused the moment the dialog opens, the
certificate redraws on every keystroke, and download stays disabled until you've typed
something — no one gets an unnamed certificate. Enter downloads it, and the name is
remembered for next time.

It's painted directly onto a `<canvas>` — no screenshot library, no dependencies — so the
downloaded file is a real image rather than a screenshot of the page. Long names shrink to
fit automatically, and each certificate carries an issue date and a generated ID.

## Logo

An hourglass inside a dashed timeline ring, with a cyan dot marking *now* on the rim —
time running, history circling, the present marked. It's inline SVG in the nav (the sand
flips on hover), redrawn with canvas paths on the certificate, and reduced to a
data-URI favicon.

## Real data, fetched live

Portraits and biographies are not copied into this repo. Each card and modal calls the
[Wikipedia REST API](https://www.mediawiki.org/wiki/API:REST_API):

```
https://en.wikipedia.org/api/rest_v1/page/summary/<title>
```

Results are cached in-memory and in `sessionStorage`, requests are lazy (fired by an
`IntersectionObserver` with a 260px margin), and if the network is unavailable the cards
fall back to the local one-line summary instead of breaking. Wikipedia text is CC BY-SA
and remains the property of its contributors.

The dates and statistics in `assets/js/data.js` are researched and baked in, since they
come from published scholarly compilations rather than a live API:

- **Empire land areas** — the standard Taagepera-derived tables: British Empire 35.5M km²
  (1920), Mongol Empire 24M km², Russian Empire 22.8M km², Qing 14.7M km²,
  Spanish 13.7M km², Abbasid/Umayyad 11.1M km².
- **Population share records** — Achaemenid Persia ~44% of humanity (c. 480 BC, the
  all-time record), Qing ~37% (c. 1820), Han ~29% (1 AD), British Empire ~23% (1920).
- **World population** — McEvedy & Jones / UN series, 4 million in 10,000 BC to
  8.2 billion today, interpolated logarithmically between anchor points.

Ancient dates are estimates and scholars disagree on many of them; where that's true the
dataset says so.

## Flags

Every banner is generated as inline SVG at runtime by `flagSVG()` in `app.js` — no image
files. Modern flags (Union Flag, Stars and Stripes) are drawn accurately; pre-modern
powers that had no national flag in the modern sense get a **stylised banner** built from
their historical colours and emblem, and the UI labels them as such rather than passing
them off as real vexillology.

## Running it

```bash
# any static server works
npx http-server -p 8080
# or
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

Opening `index.html` directly from the filesystem also works, though some browsers block
the Wikipedia fetch under `file://` CORS rules — use a server if portraits don't appear.

## Structure

```
index.html
assets/
  css/style.css     — theme, layout, animations
  js/data.js        — eras, powers, events, figures, population series
  js/app.js         — starfield, time machine, race bars, timeline, wiki fetch, quiz
```

## Notes

- Works down to 390px wide; no horizontal scroll at any breakpoint.
- Honours `prefers-reduced-motion` — all animation collapses for users who ask for it.
- Tested in Chromium with zero console errors.
