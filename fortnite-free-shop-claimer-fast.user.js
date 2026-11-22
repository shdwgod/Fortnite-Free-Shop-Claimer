// ==UserScript==
// @name         Fortnite Free Shop Claimer (Fast)
// @namespace    https://github.com/shdwgod
// @version      1.4-fast
// @description  Automatically claims free bundles and items in the Fortnite Item Shop (bundles first, fast mode, works from a background tab).
// @author       shdw
// @match        https://www.fortnite.com/item-shop*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @license MIT
// ==/UserScript==
(function () {
  'use strict';

  const CFG = {
    actionDelayMs: 300,
    scrollStepRatio: 0.9,
    scrollDelayMs: 400,
    maxScrollSteps: 150,

    catalogTimeoutMs: 15000,
    detailTimeoutMs: 12000,
    purchaseTimeoutMs: 20000,
    growTimeoutMs: 1500,

    maxReloads: 2,
    stuckMs: 60000,
    idleKickMs: 20000,
    planTtlMs: 30 * 60 * 1000,

    maxLogLines: 4,
    jitter: [0.3, 0.5],

    backgroundMode: true,

    human: false,
    betweenOffersMs: [2500, 7000],
    thinkChance: 0.06,
    thinkMs: [1500, 4500],
    breakEvery: [3, 6],
    breakMs: [20000, 60000],
    shuffleQueue: true,
  };

  const SS = {
    processed: 'fn_claimer_processed2',
    plan: 'fn_claimer_plan',
    current: 'fn_claimer_current',
    catalog: 'fn_claimer_catalog',
    attempts: 'fn_claimer_attempts2',
    stats: 'fn_claimer_stats',
    logs: 'fn_claimer_logs',
    bgWarned: 'fn_claimer_bgwarn',
    pace: 'fn_claimer_pace',
  };
  const GM_KEYS = {
    enabled: 'fn_claimer_enabled',
    total: 'fn_claimer_total',
    pos: 'fn_claimer_pos',
    collapsed: 'fn_claimer_collapsed',
  };

  const pageWin = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  const store = {
    get(key, fallback) {
      try { return GM_getValue(key, fallback); } catch (e) { return fallback; }
    },
    set(key, value) {
      try { GM_setValue(key, value); } catch (e) {}
    },
  };

  const ss = {
    get(key, fallback) {
      try {
        const raw = sessionStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
    },
    del(key) {
      try { sessionStorage.removeItem(key); } catch (e) {}
    },
  };

  const realVisibility = (() => {
    try {
      const d = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
      return () => d.get.call(document);
    } catch (e) {
      return () => document.visibilityState;
    }
  })();
  const isReallyHidden = () => realVisibility() === 'hidden';

  function keepPageAwake() {
    if (!CFG.backgroundMode) return;
    try {
      const doc = pageWin.document;
      const fake = (prop, value) =>
        Object.defineProperty(doc, prop, { configurable: true, get: () => value });
      fake('hidden', false);
      fake('visibilityState', 'visible');
      fake('webkitHidden', false);
      fake('webkitVisibilityState', 'visible');
      doc.hasFocus = () => true;

      const swallow = (e) => {
        const t = e.target;
        if (!t || !t.nodeType || t.nodeType === 9) e.stopImmediatePropagation();
      };
      for (const type of ['visibilitychange', 'webkitvisibilitychange', 'blur']) {
        pageWin.addEventListener(type, swallow, true);
      }
    } catch (e) {
      console.warn('[FN Claimer] visibility spoof unavailable', e);
    }
  }

  function holdLock() {
    if (!CFG.backgroundMode) return;
    try {
      if (!navigator.locks) return;
      navigator.locks
        .request('fn-claimer-keepalive', { mode: 'shared' }, () => new Promise(() => {}))
        .catch(() => {});
    } catch (e) {}
  }

  const Ticker = (() => {
    let worker = null;
    let seq = 0;
    const waiting = new Map();

    try {
      const src = 'self.onmessage=function(e){var d=e.data;setTimeout(function(){self.postMessage(d.id)},d.ms)}';
      const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
      worker = new Worker(url);
      worker.onmessage = (e) => {
        const finish = waiting.get(e.data);
        if (finish) finish();
      };
      worker.onerror = () => { worker = null; };
    } catch (e) {
      worker = null;
    }

    function sleep(ms) {
      return new Promise((resolve) => {
        const id = ++seq;
        let timer = 0;
        const finish = () => {
          if (!waiting.has(id)) return;
          waiting.delete(id);
          clearTimeout(timer);
          resolve();
        };
        waiting.set(id, finish);
        timer = setTimeout(finish, ms);
        if (worker) {
          try { worker.postMessage({ id, ms }); } catch (e) {}
        }
      });
    }

    return { sleep, get active() { return !!worker; } };
  })();

  const sleep = Ticker.sleep;

  keepPageAwake();
  holdLock();

  const rand = (lo, hi) => lo + Math.random() * (hi - lo);
  const randInt = (lo, hi) => Math.floor(rand(lo, hi + 1));
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const gauss = () => {
    let u = 0;
    let v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const pause = (ms) => {
    const [lo, hi] = CFG.jitter;
    let t = ms * rand(lo, hi);
    if (CFG.human && Math.random() < CFG.thinkChance) t += rand(CFG.thinkMs[0], CFG.thinkMs[1]);
    return sleep(Math.round(t));
  };

  async function waitFor(fn, timeoutMs, intervalMs = 300) {
    const end = Date.now() + timeoutMs;
    while (Date.now() < end) {
      let result = null;
      try { result = fn(); } catch (e) {}
      if (result) return result;
      await sleep(intervalMs);
    }
    return null;
  }

  const cleanUrl = (url) => url.split('?')[0].split('#')[0].replace(/\/+$/, '');

  const getProcessed = () => ss.get(SS.processed, []);

  function markProcessed(url) {
    const list = getProcessed();
    const clean = cleanUrl(url);
    if (!list.includes(clean)) {
      list.push(clean);
      ss.set(SS.processed, list);
    }
  }

  function bumpAttempts(key) {
    const map = ss.get(SS.attempts, {});
    map[key] = (map[key] || 0) + 1;
    ss.set(SS.attempts, map);
    return map[key];
  }

  function clearAttempts(key) {
    const map = ss.get(SS.attempts, {});
    if (!(key in map)) return;
    delete map[key];
    ss.set(SS.attempts, map);
  }

  const RX = {
    buy: /^(purchase|kup)/i,
    cont: /^(continue|kontynuuj|dalej)(?!\s+(shopping|zakupy))/i,
    confirm: /^(confirm|potwierd[zź])/i,
    cancel: /cancel purchase|anuluj zakup/i,
    ownedLine: /^(owned|posiadane)/im,
    ownedTile: /(?:^|\n)\s*(?:owned|posiadane)\s*(?:\n|$)/i,
    bundle: /bundle|pakiet|zestaw/i,
    priceFree: /(?:V-Bucks Price|Discounted V-Bucks Price|Cena w V-dolcach)\s*[\n:]*\s*(?:FREE|DARMOWE|BEZPŁATNE|0)(?![\d.,])/i,
    priceAny: /(?:V-Bucks Price|Discounted V-Bucks Price|Cena w V-dolcach)\s*[\n:]*\s*(?:FREE|DARMOWE|BEZPŁATNE|[\d.,]+)/i,
    freeLine: /(?:^|\n)\s*(?:FREE|DARMOWE|BEZPŁATNE)\s*(?:\n|$)/i,
    freeWord: /^(?:free|darmowe|bezpłatne)$/i,
  };

  const mainText = () => (document.querySelector('main') || document.body).innerText || '';
  const allButtons = () => Array.from(document.querySelectorAll('button, [role="button"]'));
  const btnText = (b) => (b.innerText || '').trim();

  function findButton(rx) {
    return allButtons().find(
      (b) => rx.test(btnText(b)) && !b.disabled && b.getAttribute('aria-disabled') !== 'true'
    );
  }

  const hasCancelButton = () => allButtons().some((b) => RX.cancel.test(btnText(b)));

  const ownedNow = () => hasCancelButton() || (RX.ownedLine.test(mainText()) && !findButton(RX.buy));

  function readVerdict() {
    if (hasCancelButton()) return 'owned';
    const text = mainText();
    const buy = findButton(RX.buy);
    if (RX.priceFree.test(text)) return buy ? 'free' : null;
    if (buy) return RX.priceAny.test(text) ? 'paid' : null;
    return RX.ownedLine.test(text) && !RX.priceAny.test(text) ? 'owned' : null;
  }

  function isDetailPage() {
    const path = location.pathname;
    const cur = ss.get(SS.current, null);
    return (
      !!(cur && cleanUrl(cur.href) === cleanUrl(location.href)) ||
      /\/item-shop\/.+\/[a-z0-9-]{8,}/i.test(path) ||
      /\/item-shop\/(offers|bundles|jam-tracks|outfits|emotes|pickaxes|wraps|kicks|wheels|sidekicks)\/[^/]+/i.test(path)
    );
  }

  const pageTitle = () =>
    (((document.querySelector('h1') || {}).innerText || document.title || 'Offer').trim().split('\n')[0]);

  function shopLinks() {
    return Array.from(document.querySelectorAll('a[href*="/item-shop/"]')).filter((a) => {
      const href = cleanUrl(a.href);
      return !href.endsWith('/item-shop') && !href.endsWith('/v-bucks');
    });
  }

  function tileSignals(a, text) {
    const alts = Array.from(a.querySelectorAll('img[alt]')).map((i) => i.alt);
    return [text, a.getAttribute('aria-label'), a.getAttribute('title'), ...alts, a.href]
      .filter(Boolean)
      .join(' ');
  }

  function tileTitle(text) {
    const line = text.split('\n').map((s) => s.trim()).find((s) => s && !RX.freeWord.test(s));
    return line || 'Item';
  }

  function findCandidates() {
    const processed = getProcessed();
    const seen = new Set();
    const out = [];

    for (const a of shopLinks()) {
      const href = cleanUrl(a.href);
      if (seen.has(href) || processed.includes(href)) continue;

      const text = (a.innerText || '').trim();
      const free = RX.priceFree.test(text) || RX.freeLine.test(text);
      if (!free || RX.ownedTile.test(text)) continue;

      seen.add(href);
      out.push({
        url: a.href,
        href,
        title: tileTitle(text),
        bundle: RX.bundle.test(tileSignals(a, text)),
      });
    }
    return out;
  }

  const atBottom = () =>
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300;

  function nudgeScroll() {
    if (!CFG.backgroundMode || !isReallyHidden()) return;
    try { pageWin.dispatchEvent(new Event('scroll')); } catch (e) {}
  }

  function setSnapOff(off) {
    let st = document.getElementById('fn-claimer-nosnap');
    if (off && !st) {
      st = document.createElement('style');
      st.id = 'fn-claimer-nosnap';
      st.textContent = '*{scroll-snap-type:none!important;scroll-behavior:auto!important}';
      (document.head || document.documentElement).appendChild(st);
    } else if (!off && st) {
      st.remove();
    }
  }

  let lastActivity = Date.now();
  const touch = () => { lastActivity = Date.now(); };

  const cursor = {
    x: Math.round(rand(160, Math.max(200, window.innerWidth - 160))),
    y: Math.round(rand(120, Math.max(160, window.innerHeight - 120))),
    el: null,
  };

  const hitTarget = (x, y) => document.elementFromPoint(x, y);

  function fire(target, type, x, y, extra) {
    let Ctor = MouseEvent;
    if (type === 'wheel') Ctor = WheelEvent;
    else if ((type.startsWith('pointer') || type === 'click') && typeof PointerEvent === 'function') Ctor = PointerEvent;

    const opts = Object.assign(
      {
        bubbles: true,
        cancelable: true,
        composed: true,
        clientX: x,
        clientY: y,
        screenX: x + (window.screenX || 0),
        screenY: y + (window.screenY || 0) + Math.max(0, window.outerHeight - window.innerHeight),
        button: 0,
        buttons: 0,
      },
      extra
    );
    if (Ctor === PointerEvent) {
      Object.assign(opts, {
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        width: 1,
        height: 1,
        pressure: opts.buttons ? 0.5 : 0,
      });
    }

    let ev;
    try { ev = new Ctor(type, Object.assign({ view: pageWin }, opts)); }
    catch (e) { ev = new Ctor(type, opts); }
    target.dispatchEvent(ev);
  }

  async function moveCursor(tx, ty) {
    const sx = cursor.x;
    const sy = cursor.y;
    const dist = Math.hypot(tx - sx, ty - sy);
    const steps = clamp(Math.round(dist / 35) + randInt(0, 4), 6, 28);
    const cx = (sx + tx) / 2 + rand(-0.2, 0.2) * dist;
    const cy = (sy + ty) / 2 + rand(-0.2, 0.2) * dist;

    for (let i = 1; i <= steps; i++) {
      const p = i / steps;
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const x = Math.round(clamp((1 - e) * (1 - e) * sx + 2 * (1 - e) * e * cx + e * e * tx, 1, window.innerWidth - 2));
      const y = Math.round(clamp((1 - e) * (1 - e) * sy + 2 * (1 - e) * e * cy + e * e * ty, 1, window.innerHeight - 2));
      const t = hitTarget(x, y) || document.body;

      if (cursor.el !== t) {
        if (cursor.el && cursor.el.isConnected) {
          fire(cursor.el, 'pointerout', x, y);
          fire(cursor.el, 'mouseout', x, y);
        }
        fire(t, 'pointerover', x, y);
        fire(t, 'mouseover', x, y);
        cursor.el = t;
      }
      fire(t, 'pointermove', x, y);
      fire(t, 'mousemove', x, y);
      cursor.x = x;
      cursor.y = y;
      await sleep(rand(9, 24));
    }
  }

  async function humanScrollBy(px) {
    if (!CFG.human) {
      window.scrollBy({ top: px, behavior: 'auto' });
      return;
    }
    const n = randInt(5, 9);
    let done = 0;
    for (let i = 1; i <= n; i++) {
      const to = Math.round(px * (1 - Math.pow(1 - i / n, 2)));
      const chunk = to - done;
      if (chunk) {
        const t = hitTarget(cursor.x, cursor.y) || document.body;
        fire(t, 'wheel', cursor.x, cursor.y, { deltaY: chunk, deltaMode: 0 });
        window.scrollBy({ top: chunk, behavior: 'auto' });
        done = to;
      }
      await sleep(rand(14, 34));
    }
  }

  async function humanClick(el) {
    if (!CFG.human) { el.click(); return; }
    try {
      if (!el.isConnected) return;
      let r = el.getBoundingClientRect();
      if (r.top < 70 || r.bottom > window.innerHeight - 70) {
        await humanScrollBy(Math.round(r.top + r.height / 2 - window.innerHeight / 2));
        await sleep(rand(200, 500));
        if (!el.isConnected) return;
        r = el.getBoundingClientRect();
      }

      const x = Math.round(r.left + r.width * clamp(0.5 + gauss() * 0.16, 0.12, 0.88));
      const y = Math.round(r.top + r.height * clamp(0.5 + gauss() * 0.16, 0.2, 0.8));
      await moveCursor(x, y);
      if (!el.isConnected) return;

      const hit = hitTarget(x, y);
      const t = hit && (hit === el || el.contains(hit)) ? hit : el;

      await sleep(rand(70, 240));
      fire(t, 'pointerdown', x, y, { buttons: 1 });
      fire(t, 'mousedown', x, y, { buttons: 1 });
      try { el.focus({ preventScroll: true }); } catch (e) {}
      await sleep(rand(45, 140));
      fire(t, 'pointerup', x, y);
      fire(t, 'mouseup', x, y);
      fire(t, 'click', x, y, { detail: 1 });
      touch();
    } catch (err) {
      console.warn('[FN Claimer] humanClick fallback', err);
      try { el.click(); } catch (e) {}
    }
  }

  const reactClick = (el) =>
    (CFG.human
      ? sleep(rand(350, 900)).then(() => humanClick(el))
      : Promise.resolve(el.click())
    ).catch(() => {});

  async function dwell() {
    if (!CFG.human) return;
    const n = randInt(1, 3);
    for (let i = 0; i < n; i++) {
      await moveCursor(
        rand(80, Math.max(120, window.innerWidth - 80)),
        rand(100, Math.max(140, window.innerHeight - 100))
      );
      await sleep(rand(250, 900));
    }
  }

  function shuffled(list) {
    if (!(CFG.human && CFG.shuffleQueue)) return list;
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const getPace = () => {
    const p = ss.get(SS.pace, null);
    return p && p.limit ? p : { streak: 0, limit: randInt(CFG.breakEvery[0], CFG.breakEvery[1]) };
  };

  async function maybeBreak(alive) {
    if (!CFG.human) return;
    const p = getPace();
    if (p.streak < p.limit) return;
    const ms = Math.round(rand(CFG.breakMs[0], CFG.breakMs[1]));
    ss.set(SS.pace, { streak: 0, limit: randInt(CFG.breakEvery[0], CFG.breakEvery[1]) });
    const end = Date.now() + ms;
    ui.log(`Break for ${Math.round(ms / 1000)}s`);
    while (Date.now() < end && alive()) {
      ui.setStatus(`Short break, ${Math.ceil((end - Date.now()) / 1000)}s`, 'idle');
      await sleep(1000);
    }
  }

  async function revealTile(url) {
    const want = cleanUrl(url);
    const find = () => shopLinks().find((a) => cleanUrl(a.href) === want);
    let link = find();
    if (link || isDetailPage()) return link || null;
    for (let i = 0; !link && i < 40 && !atBottom(); i++) {
      await humanScrollBy(Math.round(window.innerHeight * rand(0.6, 0.9)));
      await sleep(rand(250, 500));
      link = find();
    }
    return link || null;
  }

  const CSS = `
    :host { all: initial; }
    * { box-sizing: border-box; margin: 0; }

    .panel {
      --bg: #0f1120;
      --card: #171a30;
      --card-hi: #1e2240;
      --line: rgba(255, 255, 255, .07);
      --text: #f2f3ff;
      --muted: #8d92b9;
      --accent: #9a86ff;
      --amber: #ffc857;
      --mint: #5eead4;
      --rose: #ff7a90;
      --state: var(--muted);
      position: fixed; top: 16px; right: 16px; width: 308px; z-index: 2147483647;
      font: 13px/1.45 "Segoe UI Variable Text", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      color: var(--text); background: var(--bg);
      border: 1px solid var(--line); border-radius: 20px;
      box-shadow: 0 28px 64px rgba(0, 0, 0, .6), 0 0 0 1px rgba(154, 134, 255, .08);
      overflow: hidden; user-select: none;
    }
    .panel[data-kind="work"] { --state: var(--amber); }
    .panel[data-kind="done"] { --state: var(--mint); }
    .panel[data-kind="error"] { --state: var(--rose); }

    .rail { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--state); opacity: .9; }
    .panel[data-kind="work"] .rail {
      background: linear-gradient(90deg, transparent 0, var(--amber) 50%, transparent 100%);
      background-size: 60% 100%; background-repeat: no-repeat;
      animation: sweep 1.3s ease-in-out infinite;
    }
    @keyframes sweep { from { background-position: -60% 0; } to { background-position: 160% 0; } }

    .head { display: flex; align-items: center; gap: 12px; padding: 18px 14px 14px 16px; cursor: grab; }
    .head:active { cursor: grabbing; }
    .logo {
      flex: none; width: 36px; height: 36px; border-radius: 11px; display: grid; place-items: center;
      color: #14102e; background: var(--accent);
      box-shadow: 0 6px 18px rgba(154, 134, 255, .35);
    }
    .titles { flex: 1; min-width: 0; }
    .title { font-size: 14.5px; font-weight: 650; letter-spacing: .005em; }
    .subtitle { font-size: 11.5px; color: var(--muted); }
    .icon-btn {
      all: unset; flex: none; cursor: pointer; width: 28px; height: 28px; border-radius: 9px;
      display: grid; place-items: center; color: var(--muted); transition: background .15s, color .15s;
    }
    .icon-btn:hover { background: var(--card-hi); color: var(--text); }
    .icon-btn svg { transition: transform .2s ease; }
    .collapsed .icon-btn svg { transform: rotate(180deg); }
    .collapsed .body { display: none; }
    .collapsed .head { padding-bottom: 16px; }

    .body { padding: 0 14px 14px; display: grid; gap: 10px; }

    .hero {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      padding: 14px 16px; border-radius: 16px; background: var(--card); border: 1px solid var(--line);
    }
    .total { font-size: 42px; font-weight: 700; line-height: 1; font-variant-numeric: tabular-nums; letter-spacing: -.02em; }
    .total-label { margin-top: 6px; font-size: 12px; color: var(--muted); }
    .ring { position: relative; flex: none; width: 64px; height: 64px; }
    .ring svg { width: 64px; height: 64px; transform: rotate(-90deg); }
    .ring .track { fill: none; stroke: var(--card-hi); stroke-width: 5; }
    .ring .fill {
      fill: none; stroke: var(--accent); stroke-width: 5; stroke-linecap: round;
      transition: stroke-dashoffset .25s ease;
    }
    .ring-text { position: absolute; inset: 0; display: grid; place-items: center; font-size: 12.5px; font-weight: 600; font-variant-numeric: tabular-nums; }

    .chips { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .chip {
      display: flex; align-items: baseline; justify-content: space-between; gap: 8px;
      padding: 10px 14px; border-radius: 13px; background: var(--card); border: 1px solid var(--line);
    }
    .chip span { color: var(--muted); font-size: 12px; }
    .chip b { font-size: 15px; font-weight: 650; font-variant-numeric: tabular-nums; }

    .status {
      display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 13px;
      background: var(--card); border: 1px solid var(--line); min-height: 42px;
    }
    .dot { flex: none; width: 9px; height: 9px; border-radius: 50%; background: var(--state); box-shadow: 0 0 0 4px color-mix(in srgb, var(--state) 18%, transparent); }
    .panel[data-kind="work"] .dot { animation: pulse 1.1s ease-in-out infinite; }
    @keyframes pulse { 50% { transform: scale(.7); opacity: .6; } }
    .status-text { flex: 1; min-width: 0; font-weight: 550; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .feed { list-style: none; padding: 2px 4px; display: grid; gap: 7px; min-height: 20px; }
    .feed li { display: flex; align-items: center; gap: 9px; font-size: 12px; color: var(--muted); }
    .feed li::before { content: ""; flex: none; width: 5px; height: 5px; border-radius: 50%; background: var(--muted); opacity: .6; }
    .feed li.ok::before { background: var(--mint); opacity: 1; }
    .feed li.err::before { background: var(--rose); opacity: 1; }
    .feed li:first-child { color: var(--text); }
    .feed .msg { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .feed time { flex: none; font-size: 11px; font-variant-numeric: tabular-nums; opacity: .65; }
    .feed .empty::before { display: none; }

    .switch-row {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      padding: 12px 14px; border-radius: 14px; background: var(--card); border: 1px solid var(--line);
    }
    .switch-title { font-weight: 600; }
    .switch-sub { font-size: 11.5px; color: var(--muted); }
    .switch {
      all: unset; cursor: pointer; flex: none; position: relative; width: 44px; height: 25px; border-radius: 999px;
      background: var(--card-hi); border: 1px solid var(--line); transition: background .2s;
    }
    .switch::after {
      content: ""; position: absolute; top: 2px; left: 2px; width: 19px; height: 19px; border-radius: 50%;
      background: var(--muted); transition: transform .2s ease, background .2s;
    }
    .switch[aria-checked="true"] { background: var(--accent); }
    .switch[aria-checked="true"]::after { transform: translateX(19px); background: #14102e; }

    .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .btn {
      all: unset; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
      padding: 10px 12px; border-radius: 13px; font-weight: 600; font-size: 12.5px;
      background: var(--card); border: 1px solid var(--line); color: var(--text);
      transition: background .15s, border-color .15s;
    }
    .btn:hover { background: var(--card-hi); border-color: rgba(255, 255, 255, .16); }

    .icon-btn:focus-visible, .btn:focus-visible, .switch:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

    @media (prefers-reduced-motion: reduce) {
      .dot, .rail { animation: none !important; }
      * { transition: none !important; }
    }
  `;

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const ICONS = {
    gift: ['M20 12v10H4V12', 'M2 7h20v5H2z', 'M12 22V7', 'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z', 'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z'],
    chevron: ['M6 15l6-6 6 6'],
    scan: ['M21 12a9 9 0 1 1-3-6.7L21 8', 'M21 3v5h-5'],
    clear: ['M3 6h18', 'M8 6V4h8v2', 'M19 6l-1 14H6L5 6'],
  };

  function icon(name, size = 16) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    for (const d of ICONS[name]) {
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', d);
      svg.append(path);
    }
    return svg;
  }

  const RING_R = 27;
  const RING_C = 2 * Math.PI * RING_R;

  const ui = (() => {
    let host = null;
    const el = {};
    const saved = ss.get(SS.logs, []);
    const logs = Array.isArray(saved) ? saved : [];

    const h = (tag, props = {}, ...kids) => {
      const node = document.createElement(tag);
      for (const [k, v] of Object.entries(props)) {
        if (k === 'class') node.className = v;
        else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v);
      }
      kids.flat().forEach((c) => { if (c != null) node.append(c); });
      return node;
    };

    const clock = () => new Date().toLocaleTimeString('en-GB', { hour12: false });

    function applyPos() {
      const pos = store.get(GM_KEYS.pos, null);
      if (!pos || !el.panel) return;
      el.panel.style.left = Math.min(Math.max(0, pos.x), window.innerWidth - 80) + 'px';
      el.panel.style.top = Math.min(Math.max(0, pos.y), window.innerHeight - 40) + 'px';
      el.panel.style.right = 'auto';
    }

    function enableDrag(handle) {
      handle.addEventListener('pointerdown', (e) => {
        if (e.target.closest('button')) return;
        const rect = el.panel.getBoundingClientRect();
        const dx = e.clientX - rect.left;
        const dy = e.clientY - rect.top;
        handle.setPointerCapture(e.pointerId);
        const move = (ev) => {
          el.panel.style.left = Math.min(Math.max(0, ev.clientX - dx), window.innerWidth - 80) + 'px';
          el.panel.style.top = Math.min(Math.max(0, ev.clientY - dy), window.innerHeight - 40) + 'px';
          el.panel.style.right = 'auto';
        };
        const up = () => {
          handle.removeEventListener('pointermove', move);
          handle.removeEventListener('pointerup', up);
          const r = el.panel.getBoundingClientRect();
          store.set(GM_KEYS.pos, { x: r.left, y: r.top });
        };
        handle.addEventListener('pointermove', move);
        handle.addEventListener('pointerup', up);
      });
    }

    function mount() {
      if (!document.body) return;
      if (host && host.isConnected) return;
      if (host) { document.body.appendChild(host); return; }

      host = h('div', { id: 'fn-claimer-host' });
      const root = host.attachShadow({ mode: 'open' });
      const style = document.createElement('style');
      style.textContent = CSS;

      el.min = h('button', { class: 'icon-btn', title: 'Collapse', 'aria-label': 'Collapse panel' }, icon('chevron', 18));
      el.head = h('div', { class: 'head' },
        h('div', { class: 'logo' }, icon('gift', 19)),
        h('div', { class: 'titles' },
          h('div', { class: 'title' }, 'Free Shop Claimer'),
          h('div', { class: 'subtitle' }, 'Fortnite Item Shop')
        ),
        el.min
      );

      el.total = h('div', { class: 'total' }, '0');
      el.ringFill = document.createElementNS(SVG_NS, 'circle');
      el.ringFill.setAttribute('class', 'fill');
      el.ringFill.setAttribute('cx', '32');
      el.ringFill.setAttribute('cy', '32');
      el.ringFill.setAttribute('r', String(RING_R));
      el.ringFill.style.strokeDasharray = String(RING_C);
      el.ringFill.style.strokeDashoffset = String(RING_C);
      const ringTrack = document.createElementNS(SVG_NS, 'circle');
      ringTrack.setAttribute('class', 'track');
      ringTrack.setAttribute('cx', '32');
      ringTrack.setAttribute('cy', '32');
      ringTrack.setAttribute('r', String(RING_R));
      const ringSvg = document.createElementNS(SVG_NS, 'svg');
      ringSvg.setAttribute('viewBox', '0 0 64 64');
      ringSvg.append(ringTrack, el.ringFill);
      el.ringText = h('div', { class: 'ring-text' }, '–');
      const ring = h('div', { class: 'ring', title: 'Scan progress / queue position' }, ringSvg, el.ringText);

      const hero = h('div', { class: 'hero' },
        h('div', {}, el.total, h('div', { class: 'total-label' }, 'Claimed all time')),
        ring
      );

      el.session = h('b', {}, '0');
      el.skipped = h('b', {}, '0');
      const chips = h('div', { class: 'chips' },
        h('div', { class: 'chip' }, h('span', {}, 'This session'), el.session),
        h('div', { class: 'chip' }, h('span', {}, 'Skipped'), el.skipped)
      );

      el.dot = h('span', { class: 'dot' });
      el.statusText = h('span', { class: 'status-text' }, 'Starting…');
      el.status = h('div', { class: 'status', role: 'status', 'aria-live': 'polite' }, el.dot, el.statusText);

      el.feed = h('ul', { class: 'feed' });

      el.switchSub = h('div', { class: 'switch-sub' }, 'On');
      el.switchBtn = h('button', { class: 'switch', role: 'switch', 'aria-checked': 'true', 'aria-label': 'Auto-claim' });
      const switchRow = h('div', { class: 'switch-row' },
        h('div', {}, h('div', { class: 'switch-title' }, 'Auto-claim'), el.switchSub),
        el.switchBtn
      );

      el.scan = h('button', { class: 'btn' }, icon('scan', 15), 'Rescan');
      el.reset = h('button', { class: 'btn', title: 'Forget processed offers, the queue and the session counters' }, icon('clear', 15), 'Clear history');

      el.body = h('div', { class: 'body' }, hero, chips, el.status, el.feed, switchRow, h('div', { class: 'actions' }, el.scan, el.reset));
      el.panel = h('div', { class: 'panel' }, h('div', { class: 'rail' }), el.head, el.body);
      el.panel.dataset.kind = 'idle';

      el.min.addEventListener('click', () => {
        const collapsed = el.panel.classList.toggle('collapsed');
        el.min.title = collapsed ? 'Expand' : 'Collapse';
        store.set(GM_KEYS.collapsed, collapsed);
      });
      if (store.get(GM_KEYS.collapsed, false)) el.panel.classList.add('collapsed');

      root.append(style, el.panel);
      document.body.appendChild(host);
      enableDrag(el.head);
      applyPos();
      window.addEventListener('resize', applyPos);
      renderFeed();
    }

    function renderFeed() {
      if (!el.feed) return;
      if (!logs.length) {
        el.feed.replaceChildren(h('li', { class: 'empty' }, h('span', { class: 'msg' }, 'No activity yet')));
        return;
      }
      el.feed.replaceChildren(
        ...logs.map((l) => h('li', { class: l.kind }, h('span', { class: 'msg', title: l.text }, l.text), h('time', {}, l.t)))
      );
    }

    function setStatus(text, kind = 'idle') {
      touch();
      if (!el.panel) return;
      el.statusText.textContent = text;
      el.statusText.title = text;
      el.panel.dataset.kind = kind;
    }

    function setEnabled(enabled) {
      if (!el.panel) return;
      el.switchBtn.setAttribute('aria-checked', String(enabled));
      el.switchSub.textContent = enabled ? 'Running on every shop page' : 'Paused';
    }

    function setStats(total, session, skipped) {
      if (!el.panel) return;
      el.total.textContent = total;
      el.session.textContent = session;
      el.skipped.textContent = skipped;
    }

    function setProgress(fraction, label) {
      if (!el.panel) return;
      const f = Math.min(1, Math.max(0, fraction));
      el.ringFill.style.strokeDashoffset = String(RING_C * (1 - f));
      el.ringText.textContent = label != null ? label : Math.round(f * 100) + '%';
    }

    function log(text, kind = '') {
      touch();
      logs.unshift({ t: clock(), text, kind });
      logs.length = Math.min(logs.length, CFG.maxLogLines);
      ss.set(SS.logs, logs);
      renderFeed();
    }

    function clearLogs() {
      logs.length = 0;
      ss.set(SS.logs, logs);
      renderFeed();
    }

    return { mount, setStatus, setEnabled, setStats, setProgress, log, clearLogs, get el() { return el; } };
  })();

  const savedStats = ss.get(SS.stats, {});
  const state = {
    enabled: store.get(GM_KEYS.enabled, true),
    total: store.get(GM_KEYS.total, store.get('fn_bot_v22_count', 0)),
    session: savedStats.session || 0,
    skipped: savedStats.skipped || 0,
  };

  const saveStats = () => ss.set(SS.stats, { session: state.session, skipped: state.skipped });
  const refreshStats = () => ui.setStats(state.total, state.session, state.skipped);

  let navToken = 0;
  let busy = false;
  let finished = false;
  let failStreak = 0;
  let kickId = 0;

  function skip(message, kind = '') {
    state.skipped++;
    saveStats();
    refreshStats();
    ui.setStatus(message, 'idle');
    ui.log(message, kind);
  }

  function claimed(label) {
    state.total = store.get(GM_KEYS.total, state.total) + 1;
    store.set(GM_KEYS.total, state.total);
    state.session++;
    saveStats();
    refreshStats();
    const pace = getPace();
    pace.streak++;
    ss.set(SS.pace, pace);
    ui.setStatus(`Claimed: ${label}`, 'done');
    ui.log(`Claimed: ${label}`, 'ok');
  }

  function loadPlan() {
    const plan = ss.get(SS.plan, null);
    if (!plan || !Array.isArray(plan.queue)) return null;
    if (Date.now() - plan.createdAt > CFG.planTtlMs) { ss.del(SS.plan); return null; }
    const processed = getProcessed();
    plan.queue = plan.queue.filter((o) => !processed.includes(o.href));
    return plan;
  }

  function renderPlan() {
    const plan = ss.get(SS.plan, null);
    if (plan && plan.total) {
      const idx = Math.min(plan.total, plan.total - plan.queue.length);
      ui.setProgress(idx / plan.total, `${idx}/${plan.total}`);
    } else {
      ui.setProgress(0, '–');
    }
  }

  async function navigate(url) {
    touch();
    if (CFG.human) {
      const link = await revealTile(url);
      if (link) {
        await humanClick(link);
        await sleep(2500);
        if (cleanUrl(location.href) !== cleanUrl(url)) location.href = url;
        return;
      }
    }
    location.href = url;
  }

  async function goCatalog() {
    touch();
    const url = ss.get(SS.catalog, location.origin + '/item-shop');
    if (CFG.human) {
      const want = cleanUrl(url);
      const link = Array.from(document.querySelectorAll('a[href]')).find((a) => {
        if (cleanUrl(a.href) !== want) return false;
        const r = a.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
      if (link) {
        await humanClick(link);
        await sleep(2500);
        if (cleanUrl(location.href) !== want) location.href = url;
        return;
      }
    }
    location.href = url;
  }

  async function goNext() {
    const plan = loadPlan();
    if (!plan || !plan.queue.length) return false;
    const offer = plan.queue.shift();
    ss.set(SS.plan, plan);
    ss.set(SS.current, offer);
    renderPlan();
    const kind = offer.bundle ? 'bundle' : 'item';
    ui.setStatus(`Opening ${kind}: ${offer.title}`, 'work');
    ui.log(`Opening ${kind}: ${offer.title}`);
    await navigate(offer.url);
    return true;
  }

  async function finishOffer(offer, alive) {
    markProcessed(offer.href);
    ss.del(SS.current);
    await pause(700);
    if (!alive()) return;

    if (CFG.human) {
      await maybeBreak(alive);
      if (!alive()) return;
      ui.setStatus('Pausing before the next offer…', 'work');
      await sleep(rand(CFG.betweenOffersMs[0], CFG.betweenOffersMs[1]));
      if (!alive()) return;
      await goCatalog();
      return;
    }

    if (!(await goNext())) await navigate(ss.get(SS.catalog, location.origin + '/item-shop'));
  }

  async function handleDetail(alive) {
    const url = location.href;
    const stored = ss.get(SS.current, null);
    const offer = stored && cleanUrl(stored.href) === cleanUrl(url)
      ? stored
      : { url, href: cleanUrl(url), title: pageTitle(), bundle: RX.bundle.test(url) };
    const kind = offer.bundle ? 'bundle' : 'item';
    const attemptKey = 'detail:' + offer.href;

    renderPlan();
    ui.setStatus(`Checking ${kind}: ${offer.title}`, 'work');

    let verdict = await waitFor(readVerdict, CFG.detailTimeoutMs);
    if (!alive()) return;
    if (!verdict && ownedNow()) verdict = 'owned';

    if (!verdict) {
      const tries = bumpAttempts(attemptKey);
      if (tries <= CFG.maxReloads) {
        ui.setStatus(`Offer didn't load, retry ${tries}/${CFG.maxReloads}…`, 'work');
        ui.log(`Reloading offer (${tries}/${CFG.maxReloads})`);
        await pause(1500);
        if (alive()) location.reload();
        return;
      }
      clearAttempts(attemptKey);
      skip(`Did not load: ${offer.title}`, 'err');
      return finishOffer(offer, alive);
    }
    clearAttempts(attemptKey);

    await pause(CFG.actionDelayMs);
    if (!alive()) return;
    verdict = readVerdict() || verdict;

    if (verdict === 'paid') {
      await pause(1200);
      if (!alive()) return;
      verdict = readVerdict() || verdict;
    }

    if (verdict === 'owned') {
      skip(`Already owned: ${offer.title}`);
      return finishOffer(offer, alive);
    }
    if (verdict !== 'free') {
      skip(`Not free: ${offer.title}`);
      return finishOffer(offer, alive);
    }

    const buyBtn = findButton(RX.buy) || (await waitFor(() => findButton(RX.buy), 4000));
    if (!alive()) return;
    if (!buyBtn) {
      skip(`No purchase button: ${offer.title}`);
      return finishOffer(offer, alive);
    }

    if (CFG.human) {
      await dwell();
      if (!alive()) return;
    }

    ui.setStatus(`Claiming ${kind}: ${offer.title}`, 'work');
    await humanClick(findButton(RX.buy) || buyBtn);
    if (!alive()) return;

    const clicked = new WeakSet();
    let dialogSeen = false;
    let buyRetries = 0;
    let lastBuyClick = Date.now();

    await waitFor(() => {
      if (!alive()) return true;
      for (const rx of [RX.cont, RX.confirm]) {
        const b = findButton(rx);
        if (b && !clicked.has(b)) {
          clicked.add(b);
          dialogSeen = true;
          ui.setStatus(rx === RX.cont ? 'Accepting warning…' : 'Confirming purchase…', 'work');
          reactClick(b);
        }
      }
      if (ownedNow()) return true;

      if (!dialogSeen && buyRetries < 2 && Date.now() - lastBuyClick > 4000) {
        const again = findButton(RX.buy);
        if (again) {
          buyRetries++;
          lastBuyClick = Date.now();
          ui.log(`Retrying purchase click (${buyRetries}/2)`);
          humanClick(again).catch(() => {});
        }
      }
      return false;
    }, CFG.purchaseTimeoutMs, 400);
    if (!alive()) return;

    if (ownedNow()) claimed(offer.title);
    else skip(`Purchase not confirmed: ${offer.title}`, 'err');

    await pause(900);
    return finishOffer(offer, alive);
  }

  function updateScanProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    ui.setProgress(max > 0 ? window.scrollY / max : 0);
  }

  async function scanShop(alive) {
    const found = new Map();
    const collect = () => {
      for (const c of findCandidates()) if (!found.has(c.href)) found.set(c.href, c);
    };

    setSnapOff(true);
    try {
      window.scrollTo(0, 0);
      await pause(CFG.scrollDelayMs);

      let bottomHits = 0;
      let stuck = 0;
      for (let step = 0; step < CFG.maxScrollSteps && alive(); step++) {
        collect();
        updateScanProgress();

        if (atBottom()) {
          ui.setStatus(`Scanning shop… ${found.size} free so far`, 'work');
          const before = document.documentElement.scrollHeight;
          nudgeScroll();
          const grew = await waitFor(
            () => document.documentElement.scrollHeight > before + 50,
            CFG.growTimeoutMs,
            250
          );
          if (grew) { bottomHits = 0; continue; }
          if (++bottomHits >= 2) break;
        } else {
          bottomHits = 0;
          ui.setStatus(`Scanning shop… ${found.size} free so far`, 'work');
          const before = window.scrollY;
          const ratio = CFG.human ? rand(0.55, 0.95) : CFG.scrollStepRatio;
          const stepPx = Math.max(300, Math.round(window.innerHeight * ratio));
          await humanScrollBy(stepPx);
          nudgeScroll();
          await pause(CFG.scrollDelayMs);
          if (Math.abs(window.scrollY - before) < 5) {
            if (++stuck >= 3) break;
          } else {
            stuck = 0;
            if (CFG.human && Math.random() < 0.08) {
              await humanScrollBy(-Math.round(rand(80, 260)));
            }
          }
        }
      }
      collect();
    } finally {
      setSnapOff(false);
      window.scrollTo(0, 0);
    }
    return alive() ? Array.from(found.values()) : null;
  }

  async function handleCatalog(alive) {
    const attemptKey = 'catalog:' + cleanUrl(location.href);
    ss.set(SS.catalog, location.href);
    ss.del(SS.current);
    finished = false;

    if (!CFG.human && (await goNext())) return;

    ui.setStatus('Waiting for shop to load…', 'work');
    const loaded = await waitFor(() => shopLinks().length > 0, CFG.catalogTimeoutMs);
    if (!alive()) return;

    if (!loaded) {
      const tries = bumpAttempts(attemptKey);
      if (tries <= CFG.maxReloads) {
        ui.setStatus(`Shop didn't load, retry ${tries}/${CFG.maxReloads}…`, 'work');
        ui.log(`Reloading shop (${tries}/${CFG.maxReloads})`);
        await pause(1500);
        if (alive()) location.reload();
        return;
      }
      clearAttempts(attemptKey);
      finished = true;
      ui.setStatus('Shop did not load', 'error');
      ui.log('Shop did not load', 'err');
      return;
    }
    clearAttempts(attemptKey);

    await pause(CFG.actionDelayMs);
    if (!alive()) return;

    if (CFG.human) {
      await dwell();
      if (!alive()) return;
      if (await goNext()) return;
    }

    ss.del(SS.plan);
    const found = await scanShop(alive);
    if (!found) return;

    const bundles = found.filter((o) => o.bundle);
    const items = found.filter((o) => !o.bundle);
    const queue = shuffled(bundles.length ? bundles : items);
    ui.log(`Found ${bundles.length} bundle(s), ${items.length} item(s)`, queue.length ? 'ok' : '');

    if (!queue.length) {
      finished = true;
      ui.setProgress(1, '✓');
      ui.setStatus('Done, no more free offers', 'done');
      ui.log('Scan finished', 'ok');
      return;
    }

    ss.set(SS.plan, {
      queue,
      total: queue.length,
      kind: bundles.length ? 'bundle' : 'item',
      createdAt: Date.now(),
    });
    await goNext();
  }

  async function run() {
    busy = true;
    touch();
    const myToken = navToken;
    const alive = () => myToken === navToken && state.enabled;
    try {
      ui.mount();
      if (isDetailPage()) await handleDetail(alive);
      else await handleCatalog(alive);
      failStreak = 0;
    } catch (err) {
      console.error('[FN Claimer]', err);
      ui.setStatus('Error: ' + (err && err.message ? err.message : err), 'error');
      ui.log('Script error, see console', 'err');
      if (++failStreak >= 3) {
        finished = true;
        ui.setStatus('Stopped after repeated errors', 'error');
      }
    } finally {
      busy = false;
    }
  }

  function kick(delay = 600) {
    const id = ++kickId;
    sleep(delay).then(() => {
      if (id !== kickId || !state.enabled) return;
      if (busy) return kick(400);
      run();
    });
  }

  function setEnabled(value) {
    state.enabled = value;
    store.set(GM_KEYS.enabled, value);
    navToken++;
    ui.setEnabled(value);
    if (value) {
      ui.setStatus('Resuming…', 'work');
      kick(200);
    } else {
      ui.setStatus('Paused', 'idle');
      ui.log('Auto-claim paused');
    }
  }

  function resetShopState() {
    ss.del(SS.processed);
    ss.del(SS.plan);
    ss.del(SS.current);
    ss.del(SS.attempts);
    ss.del(SS.pace);
  }

  async function watch() {
    let lastUrl = location.href;

    for (;;) {
      await sleep(500);
      ui.mount();

      if (location.href !== lastUrl) {
        lastUrl = location.href;
        navToken++;
        finished = false;
        kick(700);
        continue;
      }
      if (!state.enabled) continue;

      if (finished) continue;

      const idleFor = Date.now() - lastActivity;
      if (busy && idleFor > CFG.stuckMs) {
        navToken++;
        touch();
        ui.log('Run got stuck, restarting', 'err');
        kick(300);
      } else if (!busy && idleFor > CFG.idleKickMs) {
        touch();
        kick(300);
      }
    }
  }

  function init() {
    ui.mount();
    ui.setEnabled(state.enabled);
    refreshStats();
    renderPlan();
    ui.setStatus(state.enabled ? 'Starting…' : 'Paused', 'idle');

    ui.el.switchBtn.addEventListener('click', () => setEnabled(!state.enabled));

    ui.el.scan.addEventListener('click', () => {
      if (!state.enabled) return ui.log('Turn on auto-claim first');
      ss.del(SS.plan);
      ss.del(SS.current);
      ss.del(SS.attempts);
      finished = false;
      failStreak = 0;
      navToken++;
      if (isDetailPage()) goCatalog();
      else kick(100);
    });

    ui.el.reset.addEventListener('click', () => {
      resetShopState();
      ss.del(SS.stats);
      state.session = 0;
      state.skipped = 0;
      refreshStats();
      renderPlan();
      ui.clearLogs();
      ui.log('History cleared');
    });

    watch();

    if (CFG.backgroundMode && !ss.get(SS.bgWarned, false)) {
      sleep(1500).then(() => {
        if (Ticker.active) return;
        ss.set(SS.bgWarned, true);
        ui.log('Worker timers blocked: background mode limited', 'err');
      });
    }

    if (state.enabled) kick(1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
