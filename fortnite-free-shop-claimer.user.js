// ==UserScript==
// @name         Fortnite Free Shop Claimer
// @namespace    https://github.com/shdwgod
// @version      2.0.0
// @description  Claims free bundles and items in the Fortnite Item Shop for you. Starts paused and works from a background tab.
// @author       shdw
// @homepageURL  https://github.com/shdwgod/Fortnite-Free-Shop-Claimer
// @supportURL   https://github.com/shdwgod/Fortnite-Free-Shop-Claimer/issues
// @updateURL    https://github.com/shdwgod/Fortnite-Free-Shop-Claimer/raw/refs/heads/main/fortnite-free-shop-claimer.user.js
// @downloadURL  https://github.com/shdwgod/Fortnite-Free-Shop-Claimer/raw/refs/heads/main/fortnite-free-shop-claimer.user.js
// @match        https://www.fortnite.com/item-shop*
// @icon         data:image/png;base64,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
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @noframes
// @license      MIT
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

    maxLogLines: 5,
    jitter: [0.3, 0.5],

    backgroundMode: true,

    dialogMaxClicks: 4,
    dialogRetryMs: 2000,

    human: false,
    betweenOffersMs: [2500, 7000],
    thinkChance: 0.06,
    thinkMs: [1500, 4500],
    breakEvery: [3, 6],
    breakMs: [20000, 60000],
    shuffleQueue: true,
  };

  const SS = {
    enabled: 'fn_claimer_enabled_tab',
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
  const urlSlug = (url) => cleanUrl(url).split('/').pop() || '';
  const defaultCatalogUrl = () => location.origin + '/item-shop' + (location.search || '');

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

  // Multi-language fallback regexes covering all 14 Fortnite Item Shop locales:
  // ar, de, en-US, es-ES, es-MX, fr, it, ja, ko, pl, pt-BR, ru, tr, zh-Hans
  const RX = {
    buy: /^(?:purchase|kup|kaufen|acheter|comprar|acquista|купить|satın\s*al|購入(?:する)?|구매(?:하기)?|购买|شراء)/i,
    cont: /^(?:continue|kontynuuj|dalej|weiter|fortfahren|continuer|continuar|continua|продолжить|devam(?:\s*et)?|続行|続ける|계속|继续|متابعة)(?!\s+(?:shopping|zakupy|einkauf|achats|comprando))/i,
    confirm: /^(?:confirm(?:\s+purchase)?|potwierd[zź](?:\s+zakup)?|kauf\s+bestätigen|bestätigen|confirmer(?:\s+l['’]achat)?|confirmar(?:\s+(?:la\s+)?compra)?|conferma(?:\s+acquisto)?|подтвердить(?:\s+покупку)?|satın\s*almayı\s+onayla|onayla|購入を確定|確定|구매\s*확인|확인|确认购买|确认|تأكيد\s+الشراء|تأكيد)$/i,
    cancel: /cancel\s+purchase|anuluj\s+zakup|kauf\s+abbrechen|annuler\s+l['’]achat|cancelar\s+compra|annulla\s+acquisto|отменить\s+покупку|satın\s*almayı\s+iptal|購入をキャンセル|구매\s*취소|取消购买|إلغاء\s+الشراء/i,
    dismiss: /^(?:cancel|close|back|anuluj|zamknij|wstecz|abbrechen|schließen|zurück|annuler|fermer|retour|cancelar|cerrar|volver|annulla|chiudi|indietro|отмена|закрыть|назад|iptal|kapat|geri|キャンセル|閉じる|戻る|취소|닫기|뒤로|取消|关闭|返回|إلغاء|إغلاق|رجوع)$/i,
    ownedWord: /^(?:owned|posiadane|im\s+besitz|besessen|possédé|en\s+propiedad|adquirido|possuído|posseduto|приобретено|в\s+наличии|sahip\s+olunan|所有済み|보유\s*중|已拥有|مملوك)$/i,
    freeWord: /^(?:free|darmowe|bezpłatne|kostenlos|gratis|gratuit|gratuito|бесплатно|ücretsiz|無料|무료|免费|مجاني|مجانًا|0)$/i,
    bundle: /bundle|pakiet|zestaw|paket|lot|paquete|pacote|pacchetto|набор|バンドル|번들|捆绑包|حزمة/i,
  };

  /* ---------------------------------------- Language-independent router data */

  function getLoaderData() {
    try {
      return pageWin.__reactRouterDataRouter?.state?.loaderData || null;
    } catch (e) {
      return null;
    }
  }

  function getCatalogMap() {
    const ld = getLoaderData();
    const cat = ld && ld['routes/item-shop._index']?.catalog;
    if (!cat || !Array.isArray(cat.categories)) return null;

    const map = new Map();
    for (const c of cat.categories) {
      for (const sec of c.sections || []) {
        for (const og of sec.offerGroups || []) {
          for (const it of og.items || []) {
            if (it && it.urlName && !map.has(it.urlName)) map.set(it.urlName, it);
          }
        }
      }
    }
    return map;
  }

  function getDetailOffer() {
    const ld = getLoaderData();
    if (!ld) return null;
    const key = Object.keys(ld).find((k) => k !== 'root' && k !== 'routes/item-shop._index');
    if (!key) return null;
    const rd = ld[key];
    if (!rd || typeof rd !== 'object') return null;

    const obj = rd.item || rd.offer || rd.bundle || rd.jamTrack || rd.data || rd;
    const pricing = obj?.forSale?.pricing || obj?.pricing || rd.pricing || null;
    const ownershipStatus = obj?.ownershipStatus || rd.ownershipStatus || null;
    if (!pricing && !ownershipStatus) return null;
    return { ownershipStatus, pricing, assetType: obj?.assetType || null };
  }

  /* --------------------------------------------------- DOM & visibility helpers */

  const mainRoot = () => document.querySelector('main') || document.body;
  const mainText = () => (mainRoot() && mainRoot().innerText) || '';
  const allButtons = () => Array.from(document.querySelectorAll('button, [role="button"]'));
  const btnText = (b) => (b.innerText || b.textContent || '').trim();
  const isIgnoredEl = (el) => !!el.closest('#onetrust-consent-sdk, .onetrust-pc-dark-filter, #fn-claimer-host');

  function isVisible(el) {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    const st = getComputedStyle(el);
    return st.display !== 'none' && st.visibility !== 'hidden' && st.opacity !== '0';
  }

  function isActionableBtn(b) {
    return (
      b &&
      !b.disabled &&
      b.getAttribute('aria-disabled') !== 'true' &&
      !isIgnoredEl(b) &&
      isVisible(b)
    );
  }

  function findButton(rx) {
    return allButtons().find((b) => rx.test(btnText(b)) && isActionableBtn(b));
  }

  function findPurchaseButton() {
    const byTestId = document.querySelector('[data-testid="purchase-button"]');
    if (byTestId && isActionableBtn(byTestId)) return byTestId;
    return findButton(RX.buy);
  }

  function findDialogPrimaryButton() {
    const dialogs = Array.from(document.querySelectorAll('[role="dialog"], [aria-modal="true"]')).filter(
      (d) => !isIgnoredEl(d) && isVisible(d)
    );
    for (const dlg of dialogs) {
      const btns = Array.from(dlg.querySelectorAll('button, [role="button"]')).filter(isActionableBtn);
      // Prefer explicit submit or non-dismiss button with visible text
      const candidates = btns.filter((b) => {
        const t = btnText(b);
        const aria = (b.getAttribute('aria-label') || '').trim();
        if (!t) return false;
        if (RX.cancel.test(t) || RX.dismiss.test(t) || RX.dismiss.test(aria)) return false;
        return true;
      });
      if (candidates.length === 1) return candidates[0];
      const submit = candidates.find((b) => b.getAttribute('type') === 'submit');
      if (submit) return submit;
      if (candidates.length > 1) return candidates[candidates.length - 1];
    }
    return null;
  }

  const hasCancelButton = () =>
    allButtons().some((b) => RX.cancel.test(btnText(b)) && !b.closest('#fn-claimer-host'));

  function hasDomOwnedTag(scope = mainRoot()) {
    if (!scope) return false;
    const tags = scope.querySelectorAll('[data-testid="owned-tag"]');
    for (const tag of tags) {
      const t = (tag.innerText || tag.textContent || '').trim();
      if (t) return true;
    }
    return false;
  }

  function hasDomFreePrice(scope = mainRoot()) {
    if (!scope) return false;
    if (scope.querySelector('[data-testid="real-price"]')) return false;
    const cur = scope.querySelector('[data-testid="current-vbuck-price"]');
    if (!cur) return false;
    const t = (cur.innerText || cur.textContent || '').trim();
    const hasIcon = !!cur.querySelector('[data-testid="VBucksIcon"]');
    if (!hasIcon && t && !/\d/.test(t)) return true; // localized "Free" label
    const num = t.replace(/[^\d]/g, '');
    return num === '0' || RX.freeWord.test(t);
  }

  function hasDomPaidPrice(scope = mainRoot()) {
    if (!scope) return false;
    if (scope.querySelector('[data-testid="real-price"]')) return true;
    const cur = scope.querySelector('[data-testid="current-vbuck-price"]');
    if (!cur) return false;
    return !!cur.querySelector('[data-testid="VBucksIcon"]') && /[1-9]/.test(cur.innerText || cur.textContent || '');
  }

  function ownedNow() {
    const detail = getDetailOffer();
    if (detail && detail.ownershipStatus === 'owned') return true;
    if (hasCancelButton()) return true;
    if (hasDomOwnedTag() && !findPurchaseButton()) return true;
    const lines = mainText().split('\n').map((s) => s.trim()).filter(Boolean);
    return lines.some((l) => RX.ownedWord.test(l)) && !findPurchaseButton();
  }

  function readVerdict() {
    if (ownedNow()) return 'owned';

    const detail = getDetailOffer();
    const buy = findPurchaseButton();

    if (detail && detail.pricing) {
      const { finalPrice, currencyType } = detail.pricing;
      if (currencyType === 'MtxCurrency' && finalPrice === 0) return buy ? 'free' : null;
      if (currencyType === 'RealMoney' || (typeof finalPrice === 'number' && finalPrice > 0)) return 'paid';
    }

    if (hasDomFreePrice()) return buy ? 'free' : null;
    if (buy && hasDomPaidPrice()) return 'paid';
    return null;
  }

  function isDetailPage() {
    const path = location.pathname;
    const cur = ss.get(SS.current, null);
    return (
      !!(cur && cleanUrl(cur.href) === cleanUrl(location.href)) ||
      /\/item-shop\/.+\/[a-z0-9-]{8,}/i.test(path) ||
      /\/item-shop\/(offers|bundles|jam-tracks|outfits|emotes|pickaxes|wraps|kicks|wheels|sidekicks|car-bodies|lego-kits|decor-bundles|decor-packs|builds|packs)\/[^/]+/i.test(path)
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

  function tileTitle(a, text) {
    const el = a && a.querySelector('[data-testid="item-title"]');
    const direct = el && (el.innerText || el.textContent || '').trim();
    if (direct) return direct;

    const line = text
      .split('\n')
      .map((s) => s.trim())
      .find((s) => s && !RX.freeWord.test(s) && !RX.ownedWord.test(s));
    return line || 'Item';
  }

  function isTileBundle(a, catItem) {
    if (catItem) {
      if (catItem.assetType === 'dynamicbundle' || catItem.offerMainType === 'Bundle') return true;
    }
    if (a.querySelector('[data-testid="dynamicbundle-tile"]')) return true;
    if (/\/item-shop\/(?:offers|bundles)\//i.test(a.href)) return true;
    return RX.bundle.test(a.innerText || '');
  }

  function findCandidates() {
    const processed = getProcessed();
    const seen = new Set();
    const out = [];
    const catalogMap = getCatalogMap();

    for (const a of shopLinks()) {
      const href = cleanUrl(a.href);
      if (seen.has(href) || processed.includes(href)) continue;

      const slug = urlSlug(href);
      const catItem = catalogMap ? catalogMap.get(slug) : null;

      let isOwned = false;
      let isFree = false;

      if (catItem) {
        isOwned = catItem.ownershipStatus === 'owned';
        isFree =
          !isOwned &&
          catItem.pricing?.currencyType === 'MtxCurrency' &&
          catItem.pricing?.finalPrice === 0;
      } else {
        isOwned = hasDomOwnedTag(a) || (a.innerText || '').split('\n').some((l) => RX.ownedWord.test(l.trim()));
        isFree = !isOwned && hasDomFreePrice(a);
      }

      if (!isFree || isOwned) continue;

      seen.add(href);
      out.push({
        url: a.href,
        href,
        title: (catItem && catItem.title) || tileTitle(a, (a.innerText || '').trim()),
        bundle: isTileBundle(a, catItem),
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
    if (typeof PointerEvent === 'function' && Ctor === PointerEvent) {
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

  function pressClick(el) {
    try {
      if (!el || !el.isConnected) return;
      try { el.focus({ preventScroll: true }); } catch (e) {}
      const r = el.getBoundingClientRect();
      const x = Math.round(r.left + r.width / 2);
      const y = Math.round(r.top + r.height / 2);
      const hit = hitTarget(x, y);
      const t = hit && (hit === el || el.contains(hit)) ? hit : el;

      fire(t, 'pointerover', x, y);
      fire(t, 'mouseover', x, y);
      fire(t, 'pointermove', x, y);
      fire(t, 'mousemove', x, y);
      fire(t, 'pointerdown', x, y, { buttons: 1 });
      fire(t, 'mousedown', x, y, { buttons: 1 });
      fire(t, 'pointerup', x, y);
      fire(t, 'mouseup', x, y);
      fire(t, 'click', x, y, { detail: 1 });
      touch();
    } catch (err) {
      console.warn('[FN Claimer] pressClick fallback', err);
      try { el.click(); } catch (e) {}
    }
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
    if (!CFG.human) { pressClick(el); return; }
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
      : Promise.resolve(pressClick(el))
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

  /* ------------------------------------------------------------------ UI */

  const CSS = `
    :host { all: initial; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; }

    .panel {
      --bg: #15171c;
      --surface: #1d2027;
      --surface-hi: #262a33;
      --line: #2a2e38;
      --text: #e8eaf0;
      --muted: #8d93a3;
      --accent: #2f6fe4;
      --accent-hi: #3d7df2;
      --ok: #3ecf8e;
      --err: #f06a6a;
      --state: var(--muted);
      position: fixed; right: 16px; bottom: 16px; width: 296px; z-index: 2147483647;
      font: 13px/1.4 "Segoe UI Variable Text", "Segoe UI", system-ui, -apple-system, Roboto, sans-serif;
      color: var(--text); background: var(--bg);
      border: 1px solid var(--line); border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, .45);
      overflow: hidden; user-select: none; -webkit-font-smoothing: antialiased;
    }
    .panel[data-kind="work"] { --state: #5b9bff; }
    .panel[data-kind="done"] { --state: var(--ok); }
    .panel[data-kind="error"] { --state: var(--err); }

    .head { display: flex; align-items: center; gap: 10px; padding: 12px 10px 12px 12px; cursor: grab; }
    .head:active { cursor: grabbing; }
    .logo { flex: none; width: 30px; height: 30px; display: block; }
    .titles { flex: 1; min-width: 0; }
    .title { font-size: 13.5px; font-weight: 600; }
    .status { display: flex; align-items: center; gap: 7px; min-width: 0; margin-top: 1px; font-size: 12px; color: var(--muted); }
    .dot { flex: none; width: 7px; height: 7px; border-radius: 50%; background: var(--state); }
    .status-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    .icon-btn {
      all: unset; box-sizing: border-box; flex: none; cursor: pointer; width: 28px; height: 28px; border-radius: 7px;
      display: grid; place-items: center; color: var(--muted);
    }
    .icon-btn:hover { background: var(--surface-hi); color: var(--text); }
    .icon-btn svg { transition: transform .15s ease; }
    .collapsed .icon-btn svg { transform: rotate(180deg); }
    .collapsed .body { display: none; }

    .body { border-top: 1px solid var(--line); }

    .progress { display: flex; align-items: center; gap: 10px; padding: 12px 14px; }
    .bar { flex: 1; height: 4px; border-radius: 2px; background: var(--surface-hi); overflow: hidden; }
    .bar i { display: block; width: 0; height: 100%; border-radius: inherit; background: var(--accent); transition: width .2s ease; }
    .panel[data-kind="done"] .bar i { background: var(--ok); }
    .panel[data-kind="error"] .bar i { background: var(--err); }
    .progress-label { min-width: 40px; text-align: right; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }

    .stats { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line); }
    .stat { padding: 10px 14px; }
    .stat + .stat { border-left: 1px solid var(--line); }
    .stat b { display: block; font-size: 18px; font-weight: 600; line-height: 1.25; font-variant-numeric: tabular-nums; }
    .stat span { font-size: 11.5px; color: var(--muted); }

    .feed { list-style: none; display: grid; align-content: start; gap: 5px; min-height: 118px; padding: 10px 14px; border-top: 1px solid var(--line); }
    .feed li { display: flex; align-items: baseline; gap: 10px; font-size: 12px; color: var(--muted); }
    .feed time { flex: none; width: 52px; font-size: 11.5px; font-variant-numeric: tabular-nums; opacity: .7; }
    .feed .msg { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .feed li.ok .msg { color: #7ddfb4; }
    .feed li.err .msg { color: #f59a9a; }
    .feed li.empty { display: block; }

    .actions { display: flex; gap: 8px; padding: 10px 14px 14px; border-top: 1px solid var(--line); }
    .btn {
      all: unset; box-sizing: border-box; cursor: pointer; text-align: center;
      padding: 8px 12px; border-radius: 8px; font-size: 12.5px; font-weight: 600;
      background: var(--surface); border: 1px solid var(--line); color: var(--text);
    }
    .btn:hover { background: var(--surface-hi); }
    .btn.primary { flex: 1; background: var(--accent); border-color: transparent; color: #fff; }
    .btn.primary:hover { background: var(--accent-hi); }
    .btn.primary.running { background: var(--surface); border-color: var(--line); color: var(--text); }
    .btn.primary.running:hover { background: var(--surface-hi); }
    .btn[disabled] { opacity: .4; cursor: default; pointer-events: none; }

    .icon-btn:focus-visible, .btn:focus-visible { outline: 2px solid var(--accent-hi); outline-offset: 2px; }

    @media (prefers-reduced-motion: reduce) {
      * { transition: none !important; }
    }
  `;

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs = {}) => {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
    return node;
  };

  function logoIcon() {
    const bow = { fill: 'none', stroke: '#fff', 'stroke-width': 3.4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
    const svg = svgEl('svg', { class: 'logo', viewBox: '0 0 64 64', 'aria-hidden': 'true' });
    svg.append(
      svgEl('rect', { width: 64, height: 64, rx: 14, fill: '#2f6fe4' }),
      svgEl('rect', { x: 17, y: 31, width: 30, height: 22, rx: 2, fill: '#d6e3ff' }),
      svgEl('rect', { x: 13, y: 24, width: 38, height: 9, rx: 2.5, fill: '#fff' }),
      svgEl('rect', { x: 29.2, y: 24, width: 5.6, height: 29, fill: '#2f6fe4' }),
      svgEl('path', Object.assign({ d: 'M32 24C27 11.5 15.5 12.5 19 20C20.5 23.2 27 24 32 24Z' }, bow)),
      svgEl('path', Object.assign({ d: 'M32 24C37 11.5 48.5 12.5 45 20C43.5 23.2 37 24 32 24Z' }, bow))
    );
    return svg;
  }

  function chevronIcon() {
    const svg = svgEl('svg', {
      viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none', stroke: 'currentColor',
      'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    });
    svg.append(svgEl('path', { d: 'M6 9l6 6 6-6' }));
    return svg;
  }

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

    function placeAt(left, top) {
      const w = el.panel.offsetWidth || 296;
      el.panel.style.left = Math.min(Math.max(0, left), Math.max(0, window.innerWidth - w)) + 'px';
      el.panel.style.top = Math.min(Math.max(0, top), Math.max(0, window.innerHeight - 48)) + 'px';
      el.panel.style.right = 'auto';
      el.panel.style.bottom = 'auto';
    }

    function applyPos() {
      const pos = store.get(GM_KEYS.pos, null);
      if (!pos || !el.panel || typeof pos.x !== 'number' || typeof pos.y !== 'number') return;
      placeAt(pos.x, pos.y);
    }

    function enableDrag(handle) {
      handle.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || e.target.closest('button')) return;
        const rect = el.panel.getBoundingClientRect();
        const dx = e.clientX - rect.left;
        const dy = e.clientY - rect.top;
        handle.setPointerCapture(e.pointerId);
        const move = (ev) => placeAt(ev.clientX - dx, ev.clientY - dy);
        const up = () => {
          handle.removeEventListener('pointermove', move);
          handle.removeEventListener('pointerup', up);
          handle.removeEventListener('pointercancel', up);
          const r = el.panel.getBoundingClientRect();
          store.set(GM_KEYS.pos, { x: r.left, y: r.top });
        };
        handle.addEventListener('pointermove', move);
        handle.addEventListener('pointerup', up);
        handle.addEventListener('pointercancel', up);
      });
    }

    function mount() {
      const parent = document.documentElement;
      if (!parent) return;
      if (host) {
        if (!host.isConnected) parent.appendChild(host);
        return;
      }

      host = h('div', { id: 'fn-claimer-host' });
      const root = host.attachShadow({ mode: 'open' });
      const style = document.createElement('style');
      style.textContent = CSS;

      el.min = h('button', { class: 'icon-btn', title: 'Collapse', 'aria-label': 'Collapse panel' }, chevronIcon());
      el.dot = h('span', { class: 'dot' });
      el.statusText = h('span', { class: 'status-text' }, 'Starting…');
      el.status = h('div', { class: 'status', role: 'status' }, el.dot, el.statusText);
      el.head = h('div', { class: 'head' },
        logoIcon(),
        h('div', { class: 'titles' }, h('div', { class: 'title' }, 'Free Shop Claimer'), el.status),
        el.min
      );

      el.barFill = h('i');
      el.progressLabel = h('span', { class: 'progress-label' }, '–');
      const progress = h('div', { class: 'progress' }, h('div', { class: 'bar' }, el.barFill), el.progressLabel);

      el.total = h('b', {}, '0');
      el.session = h('b', {}, '0');
      el.skipped = h('b', {}, '0');
      const stats = h('div', { class: 'stats' },
        h('div', { class: 'stat' }, el.total, h('span', {}, 'All time')),
        h('div', { class: 'stat' }, el.session, h('span', {}, 'Session')),
        h('div', { class: 'stat' }, el.skipped, h('span', {}, 'Skipped'))
      );

      el.feed = h('ul', { class: 'feed' });

      el.toggle = h('button', { class: 'btn primary' }, 'Start');
      el.scan = h('button', { class: 'btn', title: 'Scan the shop again from the top' }, 'Rescan');
      el.reset = h('button', { class: 'btn', title: 'Forget processed offers, the queue and the session counters' }, 'Reset');
      const actions = h('div', { class: 'actions' }, el.toggle, el.scan, el.reset);

      el.body = h('div', { class: 'body' }, progress, stats, el.feed, actions);
      el.panel = h('div', { class: 'panel' }, el.head, el.body);
      el.panel.dataset.kind = 'idle';

      el.min.addEventListener('click', () => {
        const collapsed = el.panel.classList.toggle('collapsed');
        el.min.title = collapsed ? 'Expand' : 'Collapse';
        el.min.setAttribute('aria-label', collapsed ? 'Expand panel' : 'Collapse panel');
        store.set(GM_KEYS.collapsed, collapsed);
      });
      if (store.get(GM_KEYS.collapsed, false)) {
        el.panel.classList.add('collapsed');
        el.min.title = 'Expand';
        el.min.setAttribute('aria-label', 'Expand panel');
      }

      root.append(style, el.panel);
      parent.appendChild(host);
      enableDrag(el.head);
      applyPos();
      window.addEventListener('resize', applyPos);
      renderFeed();
    }

    function renderFeed() {
      if (!el.feed) return;
      if (!logs.length) {
        el.feed.replaceChildren(h('li', { class: 'empty' }, 'No activity yet'));
        return;
      }
      el.feed.replaceChildren(
        ...logs.map((l) => h('li', { class: l.kind }, h('time', {}, l.t), h('span', { class: 'msg', title: l.text }, l.text)))
      );
    }

    function setStatus(text, kind = 'idle') {
      touch();
      if (!el.panel) return;
      if (el.statusText.textContent !== text) {
        el.statusText.textContent = text;
        el.statusText.title = text;
      }
      if (el.panel.dataset.kind !== kind) el.panel.dataset.kind = kind;
    }

    function setEnabled(enabled) {
      if (!el.panel) return;
      el.toggle.textContent = enabled ? 'Pause' : 'Start';
      el.toggle.classList.toggle('running', enabled);
      el.toggle.setAttribute('aria-pressed', String(enabled));
      el.scan.disabled = !enabled;
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
      el.barFill.style.width = f * 100 + '%';
      el.progressLabel.textContent = label != null ? label : Math.round(f * 100) + '%';
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

  /* --------------------------------------------------------------- logic */

  const savedStats = ss.get(SS.stats, {});
  const state = {
    enabled: ss.get(SS.enabled, false) === true,
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
    const url = ss.get(SS.catalog, defaultCatalogUrl());
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

    if (!(await goNext())) await navigate(ss.get(SS.catalog, defaultCatalogUrl()));
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

    const buyBtn = findPurchaseButton() || (await waitFor(findPurchaseButton, 4000));
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
    await humanClick(findPurchaseButton() || buyBtn);
    if (!alive()) return;

    const clicked = new WeakMap();
    let dialogSeen = false;
    let buyRetries = 0;
    let lastBuyClick = Date.now();

    await waitFor(() => {
      if (!alive()) return true;

      let dlgBtn = findButton(RX.cont) || findButton(RX.confirm);
      let isConfirm = dlgBtn ? RX.confirm.test(btnText(dlgBtn)) : false;

      if (!dlgBtn) {
        dlgBtn = findDialogPrimaryButton();
        isConfirm = true;
      }

      if (dlgBtn) {
        const c = clicked.get(dlgBtn) || { n: 0, t: 0 };
        if (c.n < CFG.dialogMaxClicks && Date.now() - c.t >= CFG.dialogRetryMs) {
          clicked.set(dlgBtn, { n: c.n + 1, t: Date.now() });
          dialogSeen = true;
          ui.setStatus(
            (isConfirm ? 'Confirming purchase…' : 'Accepting warning…') + (c.n ? ` (try ${c.n + 1})` : ''),
            'work'
          );
          reactClick(dlgBtn);
        }
      }
      if (ownedNow()) return true;

      if (!dialogSeen && buyRetries < 2 && Date.now() - lastBuyClick > 4000) {
        const again = findPurchaseButton();
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
    if (!state.enabled) return;
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
    ss.set(SS.enabled, value);
    navToken++;
    ui.setEnabled(value);
    if (value) {
      finished = false;
      failStreak = 0;
      ui.setStatus('Starting…', 'work');
      ui.log('Started');
      kick(200);
    } else {
      ui.setStatus('Paused', 'idle');
      ui.log('Paused');
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
    if (state.enabled) ui.setStatus('Resuming…', 'work');
    else ui.setStatus('Paused. Press Start to begin.', 'idle');

    ui.el.toggle.addEventListener('click', () => setEnabled(!state.enabled));

    ui.el.scan.addEventListener('click', () => {
      if (!state.enabled) return;
      ss.del(SS.plan);
      ss.del(SS.current);
      ss.del(SS.attempts);
      finished = false;
      failStreak = 0;
      navToken++;
      ui.log('Rescanning the shop');
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
