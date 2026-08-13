/* ============================================================
   History — application logic
   ============================================================ */
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ------------------------------------------------------------------
   Year formatting
   ------------------------------------------------------------------ */
function fmtYear(y) {
  y = Math.round(y);
  const abs = Math.abs(y);
  /* Years never take a thousands separator below 10 000 — "1815", not "1,815". */
  const n = abs >= 10000 ? abs.toLocaleString('en-US') : String(abs);
  if (y < 0) return n + ' BC';
  if (y === 0) return '1 BC';
  return n + (y < 1000 ? ' AD' : '');
}
function fmtSpan(a, b) { return fmtYear(a) + ' – ' + (b >= 2026 ? 'today' : fmtYear(b)); }
function fmtPop(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(n < 1e10 ? 1 : 0) + ' bn';
  if (n >= 1e6) return (n / 1e6).toFixed(n < 1e7 ? 1 : 0) + ' m';
  return Math.round(n / 1e3) + ' k';
}

/* ------------------------------------------------------------------
   LOGO — an hourglass inside a dashed timeline ring, with a "now" dot.
   Time running, history circling, and the present marked on the rim.
   ------------------------------------------------------------------ */
const LOGO_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="History">
  <defs>
    <linearGradient id="lgGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f5d78e"/><stop offset="1" stop-color="#c9992e"/>
    </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="28" fill="none" stroke="url(#lgGold)" stroke-width="2.4"
          stroke-dasharray="3 7" stroke-linecap="round" opacity=".6"/>
  <circle cx="32" cy="32" r="21" fill="none" stroke="url(#lgGold)" stroke-width="2.4"/>
  <g class="lg-sand">
    <path d="M23 19h18l-9 13z" fill="url(#lgGold)"/>
    <path d="M23 45h18l-9-13z" fill="url(#lgGold)" opacity=".5"/>
    <path d="M22 19h20M22 45h20" stroke="url(#lgGold)" stroke-width="3.4" stroke-linecap="round"/>
  </g>
  <circle class="lg-now" cx="60" cy="32" r="3.6" fill="#4cc9f0"/>
</svg>`;

const logoMount = $('#logoMount');
if (logoMount) logoMount.innerHTML = LOGO_SVG;

/* ------------------------------------------------------------------
   Starfield — slow drifting particles behind everything
   ------------------------------------------------------------------ */
(function starfield() {
  const cv = $('#stars');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let w, h, stars = [];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function size() {
    w = cv.width = innerWidth * devicePixelRatio;
    h = cv.height = innerHeight * devicePixelRatio;
    cv.style.width = innerWidth + 'px';
    cv.style.height = innerHeight + 'px';
    const n = Math.round((innerWidth * innerHeight) / 9000);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.3 + .2) * devicePixelRatio,
      a: Math.random() * .6 + .15,
      s: (Math.random() * .16 + .02) * devicePixelRatio,
      tw: Math.random() * Math.PI * 2
    }));
  }
  size();
  addEventListener('resize', size);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const st of stars) {
      st.tw += .014;
      const alpha = st.a * (.55 + .45 * Math.sin(st.tw));
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, 6.284);
      ctx.fillStyle = `rgba(220,232,255,${alpha})`;
      ctx.fill();
      st.y -= st.s;
      if (st.y < -4) { st.y = h + 4; st.x = Math.random() * w; }
    }
    requestAnimationFrame(draw);
  }
  if (reduce) {
    for (const st of stars) { ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 6.284); ctx.fillStyle = `rgba(220,232,255,${st.a})`; ctx.fill(); }
  } else draw();
})();

/* ------------------------------------------------------------------
   Scroll progress + nav
   ------------------------------------------------------------------ */
addEventListener('scroll', () => {
  const max = document.body.scrollHeight - innerHeight;
  $('#progress').style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
  $('#nav').classList.toggle('scrolled', scrollY > 30);
}, { passive: true });

/* ------------------------------------------------------------------
   Reveal-on-scroll
   ------------------------------------------------------------------ */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), Math.min(i * 70, 350));
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: .12, rootMargin: '0px 0px -60px' });

function watchReveals() { $$('.reveal:not(.in)').forEach(el => revealIO.observe(el)); }

/* ------------------------------------------------------------------
   FLAG BUILDER — stylised SVG banners
   ------------------------------------------------------------------ */
function flagSVG(spec, w = 300, h = 200) {
  const uid = 'f' + Math.random().toString(36).slice(2, 8);
  const parts = [];
  const bands = spec.bands || ['#333'];

  const shade = `
    <linearGradient id="g${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".22"/>
      <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".72" stop-color="#000" stop-opacity=".18"/>
      <stop offset="1" stop-color="#000" stop-opacity=".05"/>
    </linearGradient>`;

  if (spec.dir === 'union') {
    /* British Empire — Union Flag */
    parts.push(`<rect width="${w}" height="${h}" fill="#012169"/>`);
    parts.push(`<path d="M0,0 L${w},${h} M${w},0 L0,${h}" stroke="#fff" stroke-width="${h * .22}"/>`);
    parts.push(`<path d="M0,0 L${w},${h} M${w},0 L0,${h}" stroke="#C8102E" stroke-width="${h * .11}"/>`);
    parts.push(`<path d="M${w / 2},0 V${h} M0,${h / 2} H${w}" stroke="#fff" stroke-width="${h * .3}"/>`);
    parts.push(`<path d="M${w / 2},0 V${h} M0,${h / 2} H${w}" stroke="#C8102E" stroke-width="${h * .18}"/>`);
  } else if (spec.dir === 'stars') {
    /* United States */
    for (let i = 0; i < 13; i++)
      parts.push(`<rect y="${i * h / 13}" width="${w}" height="${h / 13}" fill="${i % 2 ? '#fff' : '#B22234'}"/>`);
    parts.push(`<rect width="${w * .42}" height="${h * 7 / 13}" fill="#3C3B6E"/>`);
    let st = '';
    for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++)
      st += `<circle cx="${w * .42 * (c + .5) / 6}" cy="${(h * 7 / 13) * (r + .5) / 5}" r="${h * .017}" fill="#fff"/>`;
    parts.push(st);
  } else if (spec.dir === 'split') {
    /* Cold War — two halves */
    parts.push(`<rect width="${w / 2}" height="${h}" fill="#B22234"/>`);
    for (let i = 0; i < 7; i++) if (i % 2) parts.push(`<rect y="${i * h / 13}" width="${w / 2}" height="${h / 13}" fill="#fff"/>`);
    parts.push(`<rect x="${w / 2}" width="${w / 2}" height="${h}" fill="#CC0000"/>`);
    parts.push(`<text x="${w * .75}" y="${h * .62}" font-size="${h * .42}" text-anchor="middle" fill="#FFD700">☭</text>`);
    parts.push(`<rect x="${w / 2 - 1.5}" width="3" height="${h}" fill="#0a0a0a" opacity=".55"/>`);
  } else {
    const dir = spec.dir === 'v' ? 'v' : 'h';
    bands.forEach((c, i) => {
      const n = bands.length;
      parts.push(dir === 'h'
        ? `<rect y="${i * h / n}" width="${w}" height="${h / n + .6}" fill="${c}"/>`
        : `<rect x="${i * w / n}" width="${w / n + .6}" height="${h}" fill="${c}"/>`);
    });
  }

  if (spec.tamga) {
    /* Mongol soyombo-style mark */
    parts.push(`<g stroke="${spec.ink}" stroke-width="${h * .045}" fill="none" opacity=".95">
      <circle cx="${w / 2}" cy="${h * .38}" r="${h * .11}"/>
      <path d="M${w / 2 - h * .16},${h * .60} H${w / 2 + h * .16}"/>
      <path d="M${w / 2 - h * .11},${h * .72} H${w / 2 + h * .11}"/>
      <path d="M${w / 2},${h * .49} V${h * .60}"/></g>`);
  } else if (spec.glyph) {
    parts.push(`<text x="${w / 2}" y="${h * .5}" font-size="${h * .40}" text-anchor="middle"
       dominant-baseline="central" fill="${spec.ink || '#fff'}" opacity=".95">${spec.glyph}</text>`);
  }

  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img">
    <defs>${shade}</defs>${parts.join('')}
    <rect width="${w}" height="${h}" fill="url(#g${uid})"/>
  </svg>`;
}

/* ------------------------------------------------------------------
   HERO — animated counters
   ------------------------------------------------------------------ */
(function hero() {
  const yEl = $('#heroYear'), lEl = $('#heroLabel');
  const stops = [-10000, -3300, -1200, -550, 117, 800, 1206, 1492, 1789, 1945, 2026];
  const labels = ['first farmers', 'writing invented', 'iron & collapse', 'Persia rises',
    'Rome at its peak', 'Baghdad & Charlemagne', 'the Mongols ride', 'two worlds meet',
    'revolutions', 'the atomic age', 'you are here'];
  let i = 0;
  const tick = () => {
    yEl.textContent = fmtYear(stops[i]);
    lEl.textContent = labels[i];
    i = (i + 1) % stops.length;
  };
  tick();
  setInterval(tick, 1800);

  const nums = [
    ['#s1', 12026, v => v.toLocaleString('en-US')],
    ['#s2', HISTORY.powers.length, v => v],
    ['#s3', HISTORY.figures.length, v => v],
    ['#s4', HISTORY.events.length, v => v]
  ];
  nums.forEach(([sel, target, fm]) => {
    const el = $(sel); const t0 = performance.now(); const dur = 1800;
    const step = (t) => {
      const p = clamp((t - t0) / dur, 0, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fm(Math.round(target * e));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
})();

/* ------------------------------------------------------------------
   TIME MACHINE
   ------------------------------------------------------------------ */
const TM = (function timeMachine() {
  /* Non-linear scale: recent centuries deserve more of the track. */
  const anchors = [
    [0, -10000], [.20, -3000], [.35, -500], [.50, 500],
    [.65, 1200], [.78, 1500], [.88, 1800], [.95, 1900], [1, 2026]
  ];
  function tToYear(t) {
    t = clamp(t, 0, 1);
    for (let i = 1; i < anchors.length; i++) {
      const [t1, y1] = anchors[i]; const [t0, y0] = anchors[i - 1];
      if (t <= t1) return y0 + (y1 - y0) * ((t - t0) / (t1 - t0));
    }
    return 2026;
  }
  function yearToT(y) {
    for (let i = 1; i < anchors.length; i++) {
      const [t1, y1] = anchors[i]; const [t0, y0] = anchors[i - 1];
      if (y <= y1) return t0 + (t1 - t0) * ((y - y0) / (y1 - y0));
    }
    return 1;
  }

  function popAt(y) {
    const P = HISTORY.population;
    if (y <= P[0][0]) return P[0][1];
    for (let i = 1; i < P.length; i++) {
      if (y <= P[i][0]) {
        const [y0, p0] = P[i - 1], [y1, p1] = P[i];
        const f = (y - y0) / (y1 - y0);
        return Math.exp(Math.log(p0) + f * (Math.log(p1) - Math.log(p0)));
      }
    }
    return P[P.length - 1][1];
  }

  const eraAt = y => HISTORY.eras.find(e => y >= e.start && y < e.end) || HISTORY.eras[HISTORY.eras.length - 1];

  /* The single most dominant power at a given year: among all powers whose
     span covers the year, take the one with the largest land area. */
  function powerAt(y) {
    const live = HISTORY.powers.filter(p => y >= p.start && y <= p.end);
    if (!live.length) {
      return HISTORY.powers.reduce((best, p) =>
        Math.abs(((p.start + p.end) / 2) - y) < Math.abs(((best.start + best.end) / 2) - y) ? p : best);
    }
    return live.reduce((best, p) => ((p.area || 0) > (best.area || 0) ? p : best));
  }

  const els = {
    year: $('#tmYear'), eraName: $('#tmEraName'), chip: $('#tmChip'),
    flag: $('#tmFlag'), flagName: $('#tmFlagName'), power: $('#tmPower'),
    seat: $('#tmSeat'), fact: $('#tmFact'), area: $('#tmArea'),
    share: $('#tmShare'), pop: $('#tmPop'), span: $('#tmSpan'), alive: $('#tmAlive')
  };
  const slider = $('#tmSlider');
  let lastPowerId = null;

  function render(year) {
    const era = eraAt(year);
    const pw = powerAt(year);

    els.year.textContent = fmtYear(year);
    els.eraName.textContent = era.name;
    els.chip.style.color = era.color;
    els.chip.querySelector('span').textContent = era.name;

    if (pw.id !== lastPowerId) {
      lastPowerId = pw.id;
      els.flag.innerHTML = flagSVG(pw.flag);
      els.flag.firstChild.style.animation = 'none';
      void els.flag.firstChild.offsetWidth;
      els.flag.firstChild.style.animation = '';
      els.flagName.textContent = pw.short;
      els.power.textContent = pw.name;
      els.seat.textContent = pw.seat + ' · ' + pw.capital;
      els.fact.textContent = pw.fact;
      els.area.textContent = pw.area ? pw.area.toFixed(1) + 'M km²' : '—';
      els.share.textContent = pw.popShare ? pw.popShare + '%' : '—';
      els.span.textContent = (pw.end - pw.start) + ' yrs';
    }

    els.pop.textContent = fmtPop(popAt(year));

    const alive = HISTORY.figures
      .filter(f => year >= f.b && year <= (f.d ?? 2026))
      .slice(0, 9);
    els.alive.innerHTML = alive.length
      ? alive.map((f, i) => `<button class="pill" data-fig="${f.wiki}" style="animation-delay:${i * 45}ms">${f.n}</button>`).join('')
      : `<span class="pill none">No one in our list was alive — writing hadn’t been invented yet</span>`;
  }

  slider.addEventListener('input', () => render(tToYear(slider.value / 1000)));
  slider.value = Math.round(yearToT(1206) * 1000);
  render(1206);

  els.alive.addEventListener('click', e => {
    const b = e.target.closest('[data-fig]');
    if (b) openFigure(HISTORY.figures.find(f => f.wiki === b.dataset.fig));
  });

  return {
    goto(year) {
      slider.value = Math.round(yearToT(year) * 1000);
      render(year);
      $('#machine').scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    powerAt
  };
})();

/* ------------------------------------------------------------------
   POWER RACE
   ------------------------------------------------------------------ */
(function race() {
  const box = $('#race');
  let metric = 'area', drawn = false;

  function draw() {
    const list = HISTORY.powers
      .filter(p => p[metric])
      .sort((a, b) => b[metric] - a[metric])
      .slice(0, 12);
    const max = list[0][metric];
    const unit = metric === 'area' ? 'M km²' : '% of humanity';

    box.innerHTML = list.map(p => `
      <div class="bar-row" data-p="${p.id}">
        <div class="bar-flag">${flagSVG(p.flag, 120, 80)}</div>
        <div class="bar-body">
          <div class="bar-label">
            <span>${p.name}<em style="font-style:normal;color:var(--ink-3);font-size:.78em"> · ${fmtSpan(p.start, p.end)}</em></span>
            <span>${metric === 'area' ? p.area.toFixed(1) : p.popShare} ${unit}</span>
          </div>
          <div class="bar-track"><div class="bar-fill"></div></div>
        </div>
      </div>`).join('');

    requestAnimationFrame(() => {
      $$('.bar-fill', box).forEach((el, i) => {
        const v = list[i][metric] / max * 100;
        setTimeout(() => { el.style.width = v + '%'; }, i * 80);
      });
    });
  }

  $$('.tbtn[data-metric]').forEach(b => b.addEventListener('click', () => {
    $$('.tbtn[data-metric]').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    metric = b.dataset.metric;
    draw();
  }));

  new IntersectionObserver((e, o) => {
    if (e[0].isIntersecting && !drawn) { drawn = true; draw(); o.disconnect(); }
  }, { threshold: .1 }).observe(box);

  box.addEventListener('click', ev => {
    const row = ev.target.closest('[data-p]');
    if (!row) return;
    const p = HISTORY.powers.find(x => x.id === row.dataset.p);
    TM.goto(Math.round((p.start + p.end) / 2));
  });
})();

/* ------------------------------------------------------------------
   SUCCESSION STRIP
   ------------------------------------------------------------------ */
(function strip() {
  $('#strip').innerHTML = HISTORY.powers.map(p => `
    <div class="reign" data-p="${p.id}">
      ${flagSVG(p.flag, 210, 140)}
      <h5>${p.short}</h5>
      <p>${fmtSpan(p.start, p.end)}</p>
      <div class="bignum">${p.area ? p.area.toFixed(1) + 'M km²' : 'pre-state'}</div>
    </div>`).join('');

  $('#strip').addEventListener('click', e => {
    const c = e.target.closest('[data-p]');
    if (!c) return;
    const p = HISTORY.powers.find(x => x.id === c.dataset.p);
    TM.goto(Math.round((p.start + p.end) / 2));
  });
})();

/* ------------------------------------------------------------------
   TIMELINE
   ------------------------------------------------------------------ */
(function timeline() {
  const root = $('#tl');
  let html = '', lastEra = null;

  HISTORY.events.forEach(ev => {
    if (ev.tag !== lastEra) {
      lastEra = ev.tag;
      const era = HISTORY.eras.find(e => e.id === ev.tag);
      html += `<div class="era-head reveal" style="border-left-color:${era.color};color:${era.color}">
          <b style="color:${era.color}">${era.name}</b>
          <i>${fmtSpan(era.start, era.end)}</i>
          <small>${era.blurb}</small>
        </div>`;
    }
    html += `<article class="ev reveal">
        <div class="ev-year">${fmtYear(ev.y)}</div>
        <h3><span class="ic">${ev.icon}</span>${ev.t}</h3>
        <p>${ev.d}</p>
      </article>`;
  });
  root.insertAdjacentHTML('beforeend', html);

  /* dot activation + the glowing progress line */
  const evs = $$('.ev', root);
  const dotIO = new IntersectionObserver(e => e.forEach(x => {
    if (x.isIntersecting) x.target.classList.add('in');
  }), { threshold: .25 });
  evs.forEach(e => dotIO.observe(e));

  const line = $('#tlLine');
  addEventListener('scroll', () => {
    const r = root.getBoundingClientRect();
    const p = clamp((innerHeight * .6 - r.top) / r.height, 0, 1);
    line.style.height = (p * 100) + '%';
  }, { passive: true });
})();

/* ------------------------------------------------------------------
   WIKIPEDIA — live data fetch (real encyclopedia content)
   ------------------------------------------------------------------ */
const wikiCache = new Map();
function wikiSummary(title) {
  if (wikiCache.has(title)) return wikiCache.get(title);

  try {
    const hit = sessionStorage.getItem('wk:' + title);
    if (hit) { const p = Promise.resolve(JSON.parse(hit)); wikiCache.set(title, p); return p; }
  } catch (_) { /* private mode */ }

  const p = fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}?redirect=true`,
    { headers: { Accept: 'application/json' } })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(j => {
      const data = {
        title: j.title,
        extract: j.extract || '',
        thumb: j.thumbnail ? j.thumbnail.source : null,
        img: j.originalimage ? j.originalimage.source : (j.thumbnail ? j.thumbnail.source : null),
        url: j.content_urls ? j.content_urls.desktop.page : `https://en.wikipedia.org/wiki/${title}`,
        desc: j.description || ''
      };
      try { sessionStorage.setItem('wk:' + title, JSON.stringify(data)); } catch (_) {}
      return data;
    })
    .catch(() => null);   // offline / blocked → cards fall back to local copy

  wikiCache.set(title, p);
  return p;
}

/* ------------------------------------------------------------------
   FIGURES GRID
   ------------------------------------------------------------------ */
const PAGE = 24;
let figFilter = 'all', figShown = PAGE;

/* "Ramesses II" → R, "Cyrus the Great" → CG — skip regnal numerals and articles. */
const initials = n => n.split(/\s+/)
  .filter(w => /^[A-ZÀ-Þ]/.test(w) && !/^[IVXLC]+\.?$/.test(w))
  .slice(0, 2).map(w => w[0]).join('');

function figuresFiltered() {
  return figFilter === 'all' ? HISTORY.figures : HISTORY.figures.filter(f => f.era === figFilter);
}

/* A drawn portrait for every figure, so a card is never blank: era-tinted glow,
   concentric rings, a bust silhouette and the monogram. If Wikipedia answers,
   the real photograph fades in on top of this; if it doesn't, this is the card. */
function hashOf(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }

function portraitSVG(f, era) {
  const h = hashOf(f.n), uid = 'p' + (h % 99991), c = era.color, rot = (h % 40) - 20;
  return `<svg viewBox="0 0 200 224" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="bg${uid}" x1="0" y1="0" x2=".45" y2="1">
        <stop offset="0" stop-color="${c}" stop-opacity=".20"/>
        <stop offset="1" stop-color="#070910" stop-opacity="1"/>
      </linearGradient>
      <radialGradient id="gl${uid}" cx=".5" cy=".33" r=".62">
        <stop offset="0" stop-color="${c}" stop-opacity=".28"/>
        <stop offset="1" stop-color="${c}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="200" height="224" fill="#0b0f16"/>
    <rect width="200" height="224" fill="url(#bg${uid})"/>
    <circle cx="100" cy="74" r="70" fill="url(#gl${uid})"/>
    <g opacity=".2" stroke="${c}" fill="none" stroke-width="1" transform="rotate(${rot} 100 88)">
      <circle cx="100" cy="88" r="44"/><circle cx="100" cy="88" r="59"/><circle cx="100" cy="88" r="76"/>
    </g>
    <g fill="#080c13" opacity=".5">
      <circle cx="100" cy="82" r="31"/>
      <path d="M50 170c0-29 22-48 50-48s50 19 50 48z"/>
    </g>
    <text x="100" y="84" text-anchor="middle" dominant-baseline="central"
      font-family="Playfair Display, Georgia, serif" font-size="50" font-weight="700"
      fill="${c}" opacity=".92">${initials(f.n)}</text>
  </svg>`;
}

const imgIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    imgIO.unobserve(e.target);
    const holder = e.target;
    wikiSummary(holder.dataset.wiki).then(d => {
      holder.classList.remove('loading');
      if (!d || !d.thumb) return;            // keep the drawn portrait
      const img = new Image();
      img.alt = holder.dataset.name;
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.src = d.thumb;
      img.onload = () => { holder.appendChild(img); requestAnimationFrame(() => img.classList.add('loaded')); };
    });
  });
}, { rootMargin: '500px' });

function renderFigures() {
  const list = figuresFiltered().slice(0, figShown);
  const grid = $('#figGrid');

  grid.innerHTML = list.map(f => {
    const era = HISTORY.eras.find(e => e.id === f.era);
    return `<article class="fig reveal" data-wiki="${f.wiki}">
      <div class="fig-img loading" data-wiki="${f.wiki}" data-name="${f.n}">
        <div class="fig-fallback">${portraitSVG(f, era)}</div>
        <span class="fig-era" style="color:${era.color}">${era.name}</span>
      </div>
      <div class="fig-meta">
        <h4>${f.n}</h4>
        <div class="dates">${fmtYear(f.b)} – ${f.d === null ? 'present' : fmtYear(f.d)}</div>
        <div class="role">${f.role} · ${f.pl}</div>
      </div>
    </article>`;
  }).join('');

  $$('.fig-img', grid).forEach(el => imgIO.observe(el));
  $('#loadMore').style.display = figShown >= figuresFiltered().length ? 'none' : 'block';
  watchReveals();
}

(function figuresInit() {
  const eras = [...new Set(HISTORY.figures.map(f => f.era))];
  $('#figFilters').innerHTML =
    `<button class="tbtn on" data-f="all">Everyone (${HISTORY.figures.length})</button>` +
    eras.map(id => {
      const e = HISTORY.eras.find(x => x.id === id);
      const n = HISTORY.figures.filter(f => f.era === id).length;
      return `<button class="tbtn" data-f="${id}">${e.name} (${n})</button>`;
    }).join('');

  $('#figFilters').addEventListener('click', e => {
    const b = e.target.closest('[data-f]');
    if (!b) return;
    $$('#figFilters .tbtn').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    figFilter = b.dataset.f;
    figShown = PAGE;
    renderFigures();
  });

  $('#loadMore').addEventListener('click', () => { figShown += PAGE; renderFigures(); });

  $('#figGrid').addEventListener('click', e => {
    const card = e.target.closest('.fig');
    if (card) openFigure(HISTORY.figures.find(f => f.wiki === card.dataset.wiki));
  });

  renderFigures();
})();

/* ------------------------------------------------------------------
   MODAL
   ------------------------------------------------------------------ */
const modal = $('#modal');
function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }
$('#modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function openFigure(f) {
  if (!f) return;
  const era = HISTORY.eras.find(e => e.id === f.era);
  const mid = Math.round((f.b + (f.d ?? 2026)) / 2);
  const pw = TM.powerAt(mid);

  $('#modalHead').innerHTML = `
    <div id="mImg" style="width:118px;height:142px;border-radius:12px;overflow:hidden;
         border:1px solid var(--line);line-height:0">${portraitSVG(f, era)}</div>
    <div style="flex:1;min-width:230px">
      <h3>${f.n}</h3>
      <div class="dates">${fmtYear(f.b)} – ${f.d === null ? 'present' : fmtYear(f.d)}</div>
      <div class="role">${f.role} · ${f.pl} · <span style="color:${era.color}">${era.name}</span></div>
    </div>`;

  $('#modalBody').innerHTML = `
    <div class="why">${f.why}</div>
    <div id="mText">
      <div class="skeleton" style="width:100%"></div>
      <div class="skeleton" style="width:94%"></div>
      <div class="skeleton" style="width:88%"></div>
      <div class="skeleton" style="width:62%"></div>
    </div>
    <div class="context-line">
      Dominant power during their lifetime: <b style="color:var(--gold-2)">${pw.name}</b>
      &nbsp;·&nbsp; roughly ${fmtPop(interpPop(mid))} people alive on Earth.
    </div>`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  wikiSummary(f.wiki).then(d => {
    const t = $('#mText');
    if (!t) return;
    if (!d) {
      t.innerHTML = `<p>${f.why}</p><p style="color:var(--ink-3);font-size:.85rem;margin-top:12px">
        (Live biography could not be loaded — you may be offline.)</p>`;
      return;
    }
    t.innerHTML = `<p>${d.extract}</p>
      <a class="src" href="${d.url}" target="_blank" rel="noopener">Read the full article on Wikipedia ↗</a>`;
    if (d.img) {
      const holder = $('#mImg');
      const im = new Image();
      im.src = d.img;
      im.alt = f.n;
      im.style.cssText = 'width:118px;height:142px;object-fit:cover;border-radius:12px;border:1px solid var(--line)';
      im.onload = () => holder.replaceWith(im);
    }
  });
}

function interpPop(y) {
  const P = HISTORY.population;
  if (y <= P[0][0]) return P[0][1];
  for (let i = 1; i < P.length; i++) {
    if (y <= P[i][0]) {
      const [y0, p0] = P[i - 1], [y1, p1] = P[i];
      const f = (y - y0) / (y1 - y0);
      return Math.exp(Math.log(p0) + f * (Math.log(p1) - Math.log(p0)));
    }
  }
  return P[P.length - 1][1];
}

/* ------------------------------------------------------------------
   CERTIFICATE — drawn on a canvas so it downloads as a real image
   ------------------------------------------------------------------ */
const CERT_PASS = 7;
const gradeFor = (s, t) => (s === t ? 'Perfect score' : s >= 9 ? 'Distinction' : 'Pass');

const certModal = $('#certModal');
const certCanvas = $('#certCanvas');
const certNameInput = $('#certName');
let certState = { score: 0, total: 10, id: '' };

/* Canvas has no letter-spacing in every browser we care about — space it by hand. */
function drawTracked(ctx, text, cx, y, spacing) {
  const chars = [...text];
  const w = chars.reduce((a, ch) => a + ctx.measureText(ch).width + spacing, -spacing);
  let x = cx - w / 2;
  for (const ch of chars) { ctx.fillText(ch, x, y); x += ctx.measureText(ch).width + spacing; }
}

function fitFont(ctx, text, maxW, startPx, family, weight) {
  let px = startPx;
  do { ctx.font = `${weight} ${px}px ${family}`; px -= 2; }
  while (ctx.measureText(text).width > maxW && px > 28);
  return ctx.font;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawLogoOn(ctx, cx, cy, r) {
  const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  g.addColorStop(0, '#f5d78e'); g.addColorStop(1, '#c9992e');
  ctx.strokeStyle = g; ctx.fillStyle = g; ctx.lineCap = 'round';

  ctx.save();
  ctx.globalAlpha = .6; ctx.lineWidth = r * .085;
  ctx.setLineDash([r * .1, r * .25]);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.284); ctx.stroke();
  ctx.restore();

  ctx.lineWidth = r * .085; ctx.setLineDash([]);
  ctx.beginPath(); ctx.arc(cx, cy, r * .75, 0, 6.284); ctx.stroke();

  const u = r / 32;                       // logo is authored on a 64-unit grid
  ctx.beginPath();
  ctx.moveTo(cx - 9 * u, cy - 13 * u); ctx.lineTo(cx + 9 * u, cy - 13 * u); ctx.lineTo(cx, cy); ctx.closePath();
  ctx.fill();
  ctx.save(); ctx.globalAlpha = .5;
  ctx.beginPath();
  ctx.moveTo(cx - 9 * u, cy + 13 * u); ctx.lineTo(cx + 9 * u, cy + 13 * u); ctx.lineTo(cx, cy); ctx.closePath();
  ctx.fill(); ctx.restore();

  ctx.lineWidth = r * .12;
  ctx.beginPath();
  ctx.moveTo(cx - 10 * u, cy - 13 * u); ctx.lineTo(cx + 10 * u, cy - 13 * u);
  ctx.moveTo(cx - 10 * u, cy + 13 * u); ctx.lineTo(cx + 10 * u, cy + 13 * u);
  ctx.stroke();

  ctx.fillStyle = '#4cc9f0';
  ctx.beginPath(); ctx.arc(cx + r, cy, r * .13, 0, 6.284); ctx.fill();
}

function drawCertificate() {
  const ctx = certCanvas.getContext('2d');
  const W = certCanvas.width, H = certCanvas.height;
  const typed = (certNameInput.value || '').trim();
  const name = typed || 'Your name here';   /* shown greyed until they type */
  const { score, total, id } = certState;
  const SERIF = '"Playfair Display", Georgia, serif';
  const SANS = '"Inter", system-ui, sans-serif';

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0a0e15'; ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W / 2, H * .18, 0, W / 2, H * .18, W * .62);
  glow.addColorStop(0, 'rgba(230,180,80,.13)');
  glow.addColorStop(1, 'rgba(230,180,80,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(230,180,80,.85)'; ctx.lineWidth = 3;
  roundRect(ctx, 44, 44, W - 88, H - 88, 10); ctx.stroke();
  ctx.strokeStyle = 'rgba(230,180,80,.32)'; ctx.lineWidth = 1;
  roundRect(ctx, 62, 62, W - 124, H - 124, 6); ctx.stroke();

  ctx.strokeStyle = 'rgba(230,180,80,.75)'; ctx.lineWidth = 3;
  [[100, 100, 1, 1], [W - 100, 100, -1, 1], [100, H - 100, 1, -1], [W - 100, H - 100, -1, -1]]
    .forEach(([x, y, sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + 40 * sy); ctx.lineTo(x, y); ctx.lineTo(x + 40 * sx, y);
      ctx.stroke();
    });

  drawLogoOn(ctx, W / 2, 208, 58);

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#e6b450';
  ctx.font = `500 25px ${SANS}`;
  drawTracked(ctx, 'CERTIFICATE OF COMPLETION', W / 2, 344, 7);

  ctx.strokeStyle = 'rgba(230,180,80,.5)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W / 2 - 110, 372); ctx.lineTo(W / 2 + 110, 372); ctx.stroke();

  ctx.fillStyle = '#8b97a8'; ctx.font = `400 25px ${SANS}`; ctx.textAlign = 'center';
  ctx.fillText('This certifies that', W / 2, 442);

  ctx.fillStyle = typed ? '#ffffff' : 'rgba(230,180,80,.30)';
  ctx.font = fitFont(ctx, name, W - 420, 86, SERIF, 700);
  ctx.fillText(name, W / 2, 542);

  ctx.strokeStyle = 'rgba(230,180,80,.45)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W / 2 - 320, 578); ctx.lineTo(W / 2 + 320, 578); ctx.stroke();

  ctx.fillStyle = '#a5b0c2'; ctx.font = `400 26px ${SANS}`;
  ctx.fillText('has journeyed through twelve thousand years of human history', W / 2, 646);
  ctx.fillText(`and answered ${score} of ${total} questions correctly.`, W / 2, 690);

  const grade = gradeFor(score, total);
  ctx.font = `600 26px ${SANS}`;
  const bw = ctx.measureText(grade).width + 88;
  ctx.fillStyle = 'rgba(230,180,80,.12)';
  roundRect(ctx, W / 2 - bw / 2, 742, bw, 68, 34); ctx.fill();
  ctx.strokeStyle = '#e6b450'; ctx.lineWidth = 1.5;
  roundRect(ctx, W / 2 - bw / 2, 742, bw, 68, 34); ctx.stroke();
  ctx.fillStyle = '#f5d78e'; ctx.fillText(grade, W / 2, 786);

  /* a little timeline running along the foot */
  ctx.strokeStyle = 'rgba(230,180,80,.28)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(300, 892); ctx.lineTo(W - 300, 892); ctx.stroke();
  for (let i = 0; i <= 10; i++) {
    const x = 300 + (W - 600) * (i / 10);
    ctx.fillStyle = i === 10 ? '#4cc9f0' : 'rgba(230,180,80,.55)';
    ctx.beginPath(); ctx.arc(x, 892, i === 10 ? 6 : 3.5, 0, 6.284); ctx.fill();
  }
  ctx.fillStyle = '#6b7789'; ctx.font = `400 18px ${SANS}`;
  ctx.textAlign = 'left'; ctx.fillText('10,000 BC', 288, 934);
  ctx.textAlign = 'right'; ctx.fillText('TODAY', W - 288, 934);

  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.fillStyle = '#6b7789'; ctx.font = `400 20px ${SANS}`;
  /* keep clear of the corner ornaments, which occupy y 980–1020 */
  ctx.textAlign = 'left'; ctx.fillText(`Issued ${date}`, 152, 994);
  ctx.textAlign = 'right'; ctx.fillText(id, W - 152, 994);
  ctx.textAlign = 'center'; ctx.fillStyle = '#e6b450'; ctx.font = `600 20px ${SANS}`;
  drawTracked(ctx, 'HISTORY', W / 2, 994, 6);
  ctx.textAlign = 'left';
}

function openCertificate(score, total) {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  certState = {
    score, total,
    id: 'ID HIS-' + hashOf(score + '·' + total + '·' + new Date().toDateString())
      .toString(36).toUpperCase().padStart(4, '0').slice(0, 4) + stamp
  };
  $('#certId').textContent = certState.id;

  /* offer back whatever they used last time, ready to overwrite */
  try {
    const saved = localStorage.getItem('cert:name');
    if (saved && !certNameInput.value) certNameInput.value = saved;
  } catch (_) { /* private mode */ }

  certModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  syncCertUI();
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(drawCertificate);
  setTimeout(() => { certNameInput.focus(); certNameInput.select(); }, 120);
}

/* The name is the point of the certificate — don't let it download unnamed. */
function syncCertUI() {
  const typed = certNameInput.value.trim();
  const btn = $('#certDownload'), hint = $('#certHint');
  btn.disabled = !typed;
  btn.textContent = typed ? 'Download certificate (PNG)' : 'Enter your name to download';
  hint.textContent = typed
    ? 'The certificate updates as you type.'
    : 'Type your name above — it will appear on the certificate.';
  hint.classList.toggle('warn', !typed);
}

function closeCert() { certModal.classList.remove('open'); document.body.style.overflow = ''; }
$('#certClose').addEventListener('click', closeCert);
certModal.addEventListener('click', e => { if (e.target === certModal) closeCert(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && certModal.classList.contains('open')) closeCert(); });
certNameInput.addEventListener('input', () => {
  syncCertUI();
  drawCertificate();
  try { localStorage.setItem('cert:name', certNameInput.value.trim()); } catch (_) {}
});
certNameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && certNameInput.value.trim()) { e.preventDefault(); $('#certDownload').click(); }
});

$('#certDownload').addEventListener('click', () => {
  const typed = (certNameInput.value || '').trim();
  if (!typed) { certNameInput.focus(); return; }
  const safe = typed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
    || 'certificate';   /* names in non-Latin scripts strip to empty */
  certCanvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history-certificate-${safe}.png`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, 'image/png');
});

/* ------------------------------------------------------------------
   QUIZ
   ------------------------------------------------------------------ */
(function quiz() {
  const POOL = [
    { q: 'Which empire ruled the largest share of all humans alive at the time?',
      o: ['British Empire', 'Achaemenid Persia', 'Mongol Empire', 'Roman Empire'], a: 1,
      e: 'Around 480 BC roughly 44% of everyone alive was a subject of Persia — a record that still stands.' },
    { q: 'Largest empire in history by land area?',
      o: ['Mongol Empire', 'Russian Empire', 'British Empire', 'Spanish Empire'], a: 2,
      e: 'The British Empire peaked at about 35.5 million km² in 1920 — roughly a quarter of all land on Earth.' },
    { q: 'Largest *contiguous* land empire ever?',
      o: ['Mongol Empire', 'British Empire', 'Qing China', 'Umayyad Caliphate'], a: 0,
      e: 'The Mongols held about 24 million km² in one unbroken block from Korea to Hungary.' },
    { q: 'Göbekli Tepe, the oldest known monumental temple, was built around…',
      o: ['2500 BC', '5000 BC', '9600 BC', '1200 BC'], a: 2,
      e: 'About 9600 BC — roughly 7,000 years before the Great Pyramid, and by people who had not yet invented farming.' },
    { q: 'What was the very first thing humans wrote down?',
      o: ['A poem', 'A law', 'A prayer', 'An accounting record'], a: 3,
      e: 'The earliest cuneiform tablets from Uruk are administrative — receipts for grain and beer.' },
    { q: 'Which empire was the first in world history?',
      o: ['Egypt', 'Akkad', 'Assyria', 'Babylon'], a: 1,
      e: 'Sargon of Akkad, around 2334 BC, first ruled many peoples under one crown.' },
    { q: 'How long was the Great Pyramid the tallest structure on Earth?',
      o: ['400 years', '1,200 years', '3,800 years', '900 years'], a: 2,
      e: 'About 3,800 years — until Lincoln Cathedral’s spire in the 14th century.' },
    { q: 'The Roman Empire reached its greatest size under which emperor?',
      o: ['Augustus', 'Trajan', 'Constantine', 'Marcus Aurelius'], a: 1,
      e: 'Trajan, in 117 AD: about 5 million km² and a fifth of all humanity.' },
    { q: 'When did the Roman state actually end?',
      o: ['476 AD', '1453 AD', '410 AD', '800 AD'], a: 1,
      e: 'Its eastern half — Byzantium — survived until Ottoman cannon took Constantinople in 1453.' },
    { q: 'Who is often called the richest individual in all of history?',
      o: ['Mansa Musa', 'Julius Caesar', 'Kublai Khan', 'Akbar'], a: 0,
      e: 'Mali’s Mansa Musa gave away enough gold on his 1324 hajj to depress the Mediterranean gold price for a decade.' },
    { q: 'Chinese treasure fleets reached East Africa how long before Columbus sailed?',
      o: ['12 years', '87 years', '200 years', 'They never did'], a: 1,
      e: 'Zheng He’s voyages began in 1405 — 87 years earlier, with ships five times longer.' },
    { q: 'The Black Death killed what share of Europe?',
      o: ['5–10%', '30–50%', '70%', '15%'], a: 1,
      e: 'Roughly a third to a half in seven years — which broke serfdom and raised wages for survivors.' },
    { q: 'World population in 10,000 BC was around…',
      o: ['4 million', '80 million', '400,000', '50 million'], a: 0,
      e: 'About 4 million — fewer people than live in a single mid-sized city today.' },
    { q: 'Which two world-changing things both happened in 1991?',
      o: ['Moon landing & the PC', 'USSR dissolved & the Web opened',
           'WW2 ended & the UN formed', 'Penicillin & radar'], a: 1,
      e: 'The Soviet Union dissolved and Tim Berners-Lee released the World Wide Web to the public — same year.' }
  ];

  const shuffled = [...POOL].sort(() => Math.random() - .5).slice(0, 10);
  let idx = 0, score = 0, answered = false;

  const qT = $('#qText'), qO = $('#qOpts'), qE = $('#qExpl'), qS = $('#qScore'), qN = $('#qNext');

  function reset() {
    idx = 0; score = 0;
    shuffled.sort(() => Math.random() - .5);
    $$('.cert-unlock, .cert-locked').forEach(n => n.remove());
    qN.textContent = 'Next question →';
    show();
  }

  function show() {
    if (idx >= shuffled.length) {
      const total = shuffled.length;
      const verdict = score >= 9 ? 'Historian.' : score >= 7 ? 'Seriously well read.'
        : score >= 5 ? 'Solid.' : 'Plenty left to discover — scroll back up.';
      qT.innerHTML = `You scored <span style="color:var(--gold)">${score} / ${total}</span>. ${verdict}`;
      qO.innerHTML = ''; qE.classList.remove('show');
      qS.textContent = 'Finished';
      qN.textContent = 'Play again ↻';

      $$('.cert-unlock, .cert-locked').forEach(n => n.remove());
      const card = $('.quiz-card');
      if (score >= CERT_PASS) {
        const panel = document.createElement('div');
        panel.className = 'cert-unlock';
        panel.innerHTML = `<h4>🏆 Certificate unlocked — ${gradeFor(score, total)}</h4>
          <p>You passed with ${score} out of ${total}. Put your name on it and keep it.</p>
          <button class="tbtn on" id="certOpen">Get your certificate →</button>`;
        card.appendChild(panel);
        $('#certOpen').onclick = () => openCertificate(score, total);
      } else {
        const p = document.createElement('p');
        p.className = 'cert-locked';
        p.innerHTML = `You need <b style="color:var(--gold)">${CERT_PASS} of ${total}</b>
          to earn a certificate — ${CERT_PASS - score} more. Have another go.`;
        card.appendChild(p);
      }
      return;
    }
    const q = shuffled[idx];
    answered = false;
    qT.textContent = q.q;
    qE.classList.remove('show');
    qO.innerHTML = q.o.map((o, i) => `<button class="q-opt" data-i="${i}">${o}</button>`).join('');
    qS.textContent = `Question ${idx + 1} / ${shuffled.length} · Score ${score}`;
  }

  qO.addEventListener('click', e => {
    const b = e.target.closest('.q-opt');
    if (!b || answered) return;
    answered = true;
    const q = shuffled[idx], pick = +b.dataset.i;
    $$('.q-opt', qO).forEach((el, i) => {
      el.disabled = true;
      if (i === q.a) el.classList.add('right');
      else if (i === pick) el.classList.add('wrong');
    });
    if (pick === q.a) score++;
    qE.textContent = q.e;
    qE.classList.add('show');
    qS.textContent = `Question ${idx + 1} / ${shuffled.length} · Score ${score}`;
  });

  qN.addEventListener('click', () => {
    if (idx >= shuffled.length) reset();   /* the button is "Play again" on the end screen */
    else { idx++; show(); }
  });
  show();
})();

/* ------------------------------------------------------------------ */
watchReveals();
