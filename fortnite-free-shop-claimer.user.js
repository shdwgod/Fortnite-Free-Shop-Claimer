// ==UserScript==
// @name         Fortnite Free Shop Claimer
// @namespace    https://github.com/shdwgod
// @version      1.0
// @description  Automatically claims free bundles and items in the Fortnite Item Shop.
// @author       shdw
// @match        https://www.fortnite.com/item-shop*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const CFG = {
    actionDelayMs: 700,
    scrollStepPx: 1800,
    scrollDelayMs: 450,
    maxScrollSteps: 60,
    detailTimeoutMs: 8000,
    purchaseTimeoutMs: 15000,
    maxLogLines: 4,
    jitter: [0.7, 1.5],
  };

  const SESSION_KEYS = {
    processed: 'fn_claimer_processed',
    lastCatalog: 'fn_claimer_last_catalog',
    scroll: 'fn_claimer_scroll',
  };
  const GM_KEYS = {
    enabled: 'fn_claimer_enabled',
    total: 'fn_claimer_total',
    pos: 'fn_claimer_pos',
    collapsed: 'fn_claimer_collapsed',
  };

  const store = {
    get(key, fallback) {
      try { return GM_getValue(key, fallback); } catch (e) { return fallback; }
    },
    set(key, value) {
      try { GM_setValue(key, value); } catch (e) {}
    },
  };

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const pause = (ms) => {
    const [lo, hi] = CFG.jitter;
    return sleep(Math.round(ms * (lo + Math.random() * (hi - lo))));
  };

  async function waitFor(fn, timeoutMs, intervalMs = 300) {
    const end = Date.now() + timeoutMs;
    while (Date.now() < end) {
      const result = fn();
      if (result) return result;
      await sleep(intervalMs);
    }
    return null;
  }

  const cleanUrl = (url) => url.split('?')[0].split('#')[0].replace(/\/+$/, '');

  function getProcessed() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEYS.processed) || '[]'); }
    catch (e) { return []; }
  }

  function markProcessed(url) {
    const list = getProcessed();
    const clean = cleanUrl(url);
    if (!list.includes(clean)) {
      list.push(clean);
      sessionStorage.setItem(SESSION_KEYS.processed, JSON.stringify(list));
    }
  }

  function readScroll() {
    try {
      const data = JSON.parse(sessionStorage.getItem(SESSION_KEYS.scroll) || 'null');
      return data && data.url === cleanUrl(location.href) ? data.y : 0;
    } catch (e) {
      return 0;
    }
  }

  function writeScroll(y) {
    try {
      sessionStorage.setItem(
        SESSION_KEYS.scroll,
        JSON.stringify({ url: cleanUrl(location.href), y: Math.round(y) })
      );
    } catch (e) {}
  }

  const RX = {
    buy: /^(purchase|kup)/i,
    cont: /^(continue|kontynuuj|dalej)(?!\s+(shopping|zakupy))/i,
    confirm: /^(confirm|potwierd[zź])/i,
    cancel: /cancel purchase|anuluj zakup/i,
    ownedLine: /^(owned|posiadane)/im,
    bundle: /bundle|pakiet|zestaw/i,
    priceFree: /(?:V-Bucks Price|Discounted V-Bucks Price|Cena w V-dolcach)\s*[\n:]*\s*(?:FREE|DARMOWE|BEZPŁATNE|0)(?![\d.,])/i,
    freeLine: /(?:^|\n)\s*(?:FREE|DARMOWE|BEZPŁATNE)\s*(?:\n|$)/i,
  };

  const mainText = () => (document.querySelector('main') || document.body).innerText || '';
  const allButtons = () => Array.from(document.querySelectorAll('button, [role="button"]'));
  const btnText = (b) => (b.innerText || '').trim();

  function findButton(rx) {
    return allButtons().find(
      (b) => rx.test(btnText(b)) && !b.disabled && b.getAttribute('aria-disabled') !== 'true'
    );
  }

  function isOwned() {
    const hasCancel = allButtons().some((b) => RX.cancel.test(btnText(b)));
    return hasCancel || RX.ownedLine.test(mainText());
  }

  function isDetailPage() {
    const path = location.pathname;
    return (
      /\/item-shop\/.+\/[a-z0-9-]{8,}/i.test(path) ||
      /\/item-shop\/(offers|bundles|jam-tracks|outfits|emotes|pickaxes|wraps|kicks|wheels|sidekicks)\/[^/]+/i.test(path)
    );
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
    const logs = [];

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
      el.ringText = h('div', { class: 'ring-text' }, '0%');
      const ring = h('div', { class: 'ring', title: 'Shop scroll position' }, ringSvg, el.ringText);

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
      el.reset = h('button', { class: 'btn', title: 'Forget processed offers and scroll position' }, icon('clear', 15), 'Clear history');

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
        ...logs.map((l) => h('li', { class: l.kind }, h('span', { class: 'msg' }, l.text), h('time', {}, l.t)))
      );
    }

    function setStatus(text, kind = 'idle') {
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

    function setProgress(fraction) {
      if (!el.panel) return;
      const f = Math.min(1, Math.max(0, fraction));
      el.ringFill.style.strokeDashoffset = String(RING_C * (1 - f));
      el.ringText.textContent = Math.round(f * 100) + '%';
    }

    function log(text, kind = '') {
      if (!el.panel) return;
      logs.unshift({ t: clock(), text, kind });
      logs.length = Math.min(logs.length, CFG.maxLogLines);
      renderFeed();
    }

    return { mount, setStatus, setEnabled, setStats, setProgress, log, get el() { return el; } };
  })();

  const state = {
    enabled: store.get(GM_KEYS.enabled, true),
    total: store.get(GM_KEYS.total, store.get('fn_bot_v22_count', 0)),
    session: 0,
    skipped: 0,
  };

  let navToken = 0;
  let busy = false;
  let kickTimer = null;
  let trackScroll = false;
  let scrollTimer = null;

  const refreshStats = () => ui.setStats(state.total, state.session, state.skipped);

  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    ui.setProgress(max > 0 ? window.scrollY / max : 0);
  }

  function skip(message) {
    state.skipped++;
    refreshStats();
    ui.setStatus(message, 'idle');
    ui.log(message);
  }

  function goBack() {
    const last = sessionStorage.getItem(SESSION_KEYS.lastCatalog);
    if (last && cleanUrl(last) !== cleanUrl(location.href)) {
      location.href = last;
    } else {
      history.back();
    }
  }

  async function handleDetail(alive) {
    markProcessed(location.href);

    ui.setStatus('Checking offer…', 'work');
    await waitFor(
      () => findButton(RX.buy) || isOwned() || /price|cena/i.test(mainText()),
      CFG.detailTimeoutMs
    );
    if (!alive()) return;
    await pause(CFG.actionDelayMs);
    if (!alive()) return;

    if (isOwned()) {
      skip('Already owned');
      await pause(600);
      return alive() && goBack();
    }

    if (!RX.priceFree.test(mainText())) {
      skip('Not free, skipped');
      await pause(600);
      return alive() && goBack();
    }

    const buyBtn = findButton(RX.buy);
    if (!buyBtn) {
      skip('No purchase button');
      await pause(600);
      return alive() && goBack();
    }

    ui.setStatus('Claiming offer…', 'work');
    buyBtn.click();

    const clicked = new WeakSet();
    await waitFor(() => {
      if (!alive()) return true;
      for (const rx of [RX.cont, RX.confirm]) {
        const b = findButton(rx);
        if (b && !clicked.has(b)) {
          clicked.add(b);
          ui.setStatus(rx === RX.cont ? 'Accepting warning…' : 'Confirming purchase…', 'work');
          b.click();
        }
      }
      return isOwned();
    }, CFG.purchaseTimeoutMs, 400);
    if (!alive()) return;

    if (isOwned()) {
      state.total++;
      state.session++;
      store.set(GM_KEYS.total, state.total);
      refreshStats();
      ui.setStatus('Claimed!', 'done');
      ui.log('Offer claimed', 'ok');
    } else {
      skip('Purchase not confirmed');
      ui.log('Purchase not confirmed', 'err');
    }

    await pause(900);
    if (alive()) goBack();
  }

  function findCandidates() {
    const processed = getProcessed();
    const seen = new Set();
    const out = [];

    for (const a of document.querySelectorAll('a[href*="/item-shop/"]')) {
      const href = cleanUrl(a.href);
      if (href.endsWith('/item-shop') || href.endsWith('/v-bucks')) continue;
      if (seen.has(href) || processed.includes(href)) continue;

      const text = (a.innerText || '').trim();
      const free = RX.priceFree.test(text) || RX.freeLine.test(text);
      if (!free || /owned|posiadan/i.test(text)) continue;

      seen.add(href);
      out.push({
        el: a,
        href,
        title: text.split('\n')[0] || 'Item',
        isBundle: RX.bundle.test(text) || /bundle/i.test(href),
      });
    }

    out.sort((a, b) => Number(b.isBundle) - Number(a.isBundle));
    return out;
  }

  async function openCandidate(target, alive) {
    ui.setStatus(`Opening ${target.isBundle ? 'bundle' : 'item'}: ${target.title}`, 'work');
    ui.log(`${target.isBundle ? 'Bundle' : 'Item'}: ${target.title}`);
    writeScroll(window.scrollY);
    await pause(500);
    if (alive()) target.el.click();
  }

  async function restoreScroll(alive) {
    const saved = readScroll();
    if (saved < 200) return;
    ui.setStatus('Restoring scroll position…', 'work');
    for (let i = 0; i < 15 && alive(); i++) {
      window.scrollTo(0, saved);
      if (window.scrollY >= saved - 50) break;
      await sleep(250);
    }
    updateProgress();
  }

  async function handleCatalog(alive) {
    sessionStorage.setItem(SESSION_KEYS.lastCatalog, location.href);
    ui.setStatus('Scanning shop…', 'work');
    await pause(CFG.actionDelayMs);
    if (!alive()) return;

    await restoreScroll(alive);
    if (!alive()) return;
    trackScroll = true;

    let bottomHits = 0;
    for (let step = 0; step < CFG.maxScrollSteps && alive(); step++) {
      const candidates = findCandidates();
      if (candidates.length) return openCandidate(candidates[0], alive);

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300;

      if (atBottom) {
        if (++bottomHits >= 2) break;
      } else {
        bottomHits = 0;
        ui.setStatus('Scrolling through shop…', 'work');
        window.scrollBy({ top: CFG.scrollStepPx, behavior: 'auto' });
      }
      await pause(CFG.scrollDelayMs);
    }

    if (alive()) {
      trackScroll = false;
      writeScroll(0);
      ui.setStatus('Done, no more free offers', 'done');
      ui.log('Scan finished', 'ok');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async function run() {
    busy = true;
    trackScroll = false;
    const myToken = navToken;
    const alive = () => myToken === navToken && state.enabled;
    try {
      ui.mount();
      if (isDetailPage()) await handleDetail(alive);
      else await handleCatalog(alive);
    } catch (err) {
      console.error('[FN Claimer]', err);
      ui.setStatus('Error: ' + (err && err.message ? err.message : err), 'error');
      ui.log('Script error, see console', 'err');
    } finally {
      busy = false;
    }
  }

  function kick(delay = 600) {
    clearTimeout(kickTimer);
    kickTimer = setTimeout(() => {
      if (!state.enabled) return;
      if (busy) return kick(400);
      run();
    }, delay);
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
      trackScroll = false;
      ui.setStatus('Paused', 'idle');
      ui.log('Auto-claim paused');
    }
  }

  function init() {
    ui.mount();
    ui.setEnabled(state.enabled);
    refreshStats();
    ui.setStatus(state.enabled ? 'Starting…' : 'Paused', 'idle');
    updateProgress();

    ui.el.switchBtn.addEventListener('click', () => setEnabled(!state.enabled));
    ui.el.scan.addEventListener('click', () => {
      if (!state.enabled) return ui.log('Turn on auto-claim first');
      writeScroll(0);
      navToken++;
      kick(100);
    });
    ui.el.reset.addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_KEYS.processed);
      writeScroll(0);
      state.skipped = 0;
      refreshStats();
      ui.log('History cleared');
    });

    window.addEventListener('scroll', () => {
      updateProgress();
      if (!trackScroll || isDetailPage()) return;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => writeScroll(window.scrollY), 150);
    }, { passive: true });

    let lastUrl = location.href;
    setInterval(() => {
      ui.mount();
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        navToken++;
        kick(700);
      }
    }, 500);

    if (state.enabled) kick(1000);
  }

  init();
})();
