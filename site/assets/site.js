/* ==========================================================================
   ASAS — site.js
   One file, no framework, no build step. Every behaviour degrades to plain HTML.
   Sections: 0 boot · 1 kits · 2 nav · 3 reveals · 4 wire drawings · 5 stacker
             6 how-it-works stage · 7 library · 8 cursor · 9 forms/copy · 10 misc
   ========================================================================== */
(() => {
  'use strict';
  const html = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');
  /* Language. One file serves both houses; the Arabic pages carry lang="ar" dir="rtl"
     and every word this script writes comes from T. */
  const AR = (document.documentElement.lang || '').toLowerCase().startsWith('ar');
  const PFX = AR ? '/ar' : '';
  const T = AR ? {
    preview: 'معاينة', open: 'افتح', stack: '+ أضف', stacked: '✓ أُضيف', copied: 'تم النسخ', selectCopy: 'حدّد وانسخ', sending: 'لحظة…', sendFail: 'لم يُحفظ بريدك. حاول مرة أخرى.',
    blocks: n => n === 1 ? 'قسم واحد' : n === 2 ? 'قسمان' : (n >= 3 && n <= 10 ? `${n} أقسام` : `${n} قسمًا`),
    showing: (a, b) => `نعرض ${a} من ${b} · المكتبة الكاملة في الاستوديو`,
    previewAria: (n, g, f) => `معاينة ${n} (${g}) — ${f}`, pageAria: (n, t) => `افتح صفحة ${t} «${n}» في الاستوديو`,
    blockAlt: (f, n) => `قسم «${n}» من فئة ${f}، مرسوم بالرمادي`, pageAlt: (t, n, b) => `صفحة ${t} جاهزة «${n}» — ${b} مرتّبة بالرمادي`,
  } : {
    preview: 'Preview', open: 'Open', stack: '+ Stack', stacked: '✓ Stacked', copied: 'Copied', selectCopy: 'Select & copy', sending: 'One moment…', sendFail: 'That didn’t save. Please try again.',
    blocks: n => `${n} block${n === 1 ? '' : 's'}`,
    showing: (a, b) => `Showing ${a} sample${a === 1 ? '' : 's'} of ${b} · the full library lives in the Studio`,
    previewAria: (n, g, f) => `Preview ${n} (${g}) — ${f}`, pageAria: (n, t) => `Open ${n} (${t}) in the Studio`,
    blockAlt: (f, n) => `${f} block “${n}” rendered in grey wireframe`, pageAlt: (t, n, b) => `Ready-made ${t} page “${n}” — ${b} stacked in grey wireframe`,
  };
  // Plain Arabic names for the categories and page types (the house word stays beside them).
  const AR_FAM = { nav: 'الترويسة والتنقّل', hero: 'أقسام الواجهة', footer: 'التذييل', testimonial: 'آراء العملاء', team: 'فريق العمل', stats: 'الأرقام والإحصاءات', logos: 'الشعارات والشركاء', video: 'الفيديو', gallery: 'المعارض والأعمال', checklist: 'القوائم والبنود', features: 'المزايا والفوائد', steps: 'الخطوات والمراحل', pricing: 'باقات الأسعار', pricelist: 'قوائم الأسعار', faq: 'الأسئلة الشائعة', cta: 'دعوات الإجراء', contact: 'التواصل', map: 'الخرائط والمواقع', newsletter: 'الاشتراك بالنشرة', booking: 'الحجز', account: 'الحساب والدخول', band: 'الأشرطة الترويجية', products: 'المنتجات', flipbox: 'البطاقات القلّابة', skills: 'المهارات والتقدّم', countdown: 'العدّاد التنازلي', social: 'روابط التواصل', decor: 'العناصر الزخرفية', text: 'النصوص والمحتوى', loop: 'عناصر الحلقة', single: 'المقالات', error404: 'صفحات 404', sale: 'العروض' };
  const AR_TYPE = { Home: 'رئيسية', About: 'تعريفية', Services: 'خدمات', Contact: 'تواصل', Work: 'أعمال', Landing: 'هبوط', Shop: 'متجر', Journal: 'مدوّنة' };
  const famName = f => (AR ? (AR_FAM[f.key] || f.ar) : f.name) || '';
  const typeName = t => AR ? (AR_TYPE[t] || t) : t;
  const FINE = window.matchMedia('(pointer: fine)');
  const ROOM_PAGE = { nav: '/library/headers/', stats: '/library/stats-sections/', logos: '/library/logo-sections/', gallery: '/library/gallery-sections/', steps: '/library/process-steps/', newsletter: '/library/newsletter-sections/', hero: '/library/hero-sections/', pricing: '/library/pricing-tables/', faq: '/library/faq-sections/', testimonial: '/library/testimonials/', footer: '/library/footers/', cta: '/library/call-to-action-sections/', team: '/library/team-sections/', contact: '/library/contact-sections/', features: '/library/feature-sections/', error404: '/library/404-pages/' };
  const track = (name, params) => { try { if (window.gtag) window.gtag('event', name, Object.assign({ site_language: document.documentElement.lang }, params || {})); } catch (e) {} };
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
  };

  /* ---------- 0. boot ----------------------------------------------------- */
  html.classList.add('js');
  const motionOK = !REDUCED.matches && 'IntersectionObserver' in window;
  if (motionOK) html.classList.add('js-motion');
  // The grid draws itself once per session. Never on repeat visits, never with reduced motion.
  if (motionOK && !session.get('asas-booted') && $('.boot')) {
    html.classList.add('booting');
    session.set('asas-booted', '1');
    setTimeout(() => html.classList.remove('booting'), 950);
  }

  /* ---------- 1. kits (site-wide accent) ---------------------------------- */
  const KITS = [ // key, name, swatch, light accent, dark accent
    ['blueprint', 'Blueprint', '#1e3fe6', '#1e3fe6', '#6e86ff'], ['clay', 'Clay', '#b3532f', '#b3532f', '#e08561'], ['olive', 'Olive', '#566326', '#566326', '#a8bd58'],
    ['plum', 'Plum', '#5d2a60', '#5d2a60', '#c98bd0'], ['teal', 'Teal', '#157a72', '#157a72', '#48c9be'], ['navy', 'Navy', '#1a2a5a', '#1a2a5a', '#8ea3e8'],
    ['orange', 'Orange', '#d4581a', '#d4581a', '#ff8c4a'], ['rose', 'Rose', '#c93a5f', '#c93a5f', '#ff7fa0'], ['mustard', 'Mustard', '#a67c05', '#a67c05', '#ecc340'],
    ['grey', 'Grey', '#5f636b', '#5f636b', '#b0b4bc'], ['white', 'White', '#f1f2ef', '#121316', '#f1f2ef'], ['black', 'Black', '#121316', '#121316', '#f1f2ef'],
  ];
  const isDark = () => html.getAttribute('data-theme') === 'dark' || (html.getAttribute('data-theme') !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const kitAccent = k => { const x = KITS.find(y => y[0] === k) || KITS[0]; return isDark() ? x[4] : x[3]; };
  const KIT_AR = { blueprint: 'مخطط', clay: 'طين', olive: 'زيتون', plum: 'برقوق', teal: 'فيروزي', navy: 'كحلي', orange: 'برتقالي', rose: 'وردي', mustard: 'خردلي', grey: 'رمادي', white: 'أبيض', black: 'أسود' };
  const kitName = k => { const x = KITS.find(y => y[0] === k) || KITS[0]; return AR ? KIT_AR[x[0]] : x[1]; };
  function setKit(k, persist = true) {
    if (!KITS.some(x => x[0] === k)) k = 'blueprint';
    html.setAttribute('data-kit', k);
    // Black and White are the two whole-page looks: Black turns the page dark, White keeps it light.
    if (k === 'black') html.setAttribute('data-theme', 'dark');
    else if (k === 'white') html.setAttribute('data-theme', 'light');
    else html.removeAttribute('data-theme');
    if (persist) store.set('asas-kit', k);
    $$('[data-kit-name]').forEach(el => { el.textContent = kitName(k); });
    $$('.kit[data-kit]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.kit === k)));
  }
  setKit(store.get('asas-kit') || html.getAttribute('data-kit') || 'blueprint', false);
  // Render any kit picker grids
  $$('[data-kit-grid]').forEach(grid => {
    grid.innerHTML = KITS.map(([k, n, c]) =>
      `<button type="button" class="kit" data-kit="${k}" aria-pressed="false" style="--c:${c}"><span class="sw"></span><span>${AR ? KIT_AR[k] : n}</span></button>`).join('');
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('.kit[data-kit]');
    if (b) { setKit(b.dataset.kit); }
  });
  setKit(html.getAttribute('data-kit'), false);
  // nav popover
  const kits = $('.kits');
  if (kits) {
    const btn = $('.kits__btn', kits);
    btn.addEventListener('click', () => {
      const open = kits.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => { if (!kits.contains(e.target)) { kits.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { kits.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); } });
  }

  /* ---------- 2. nav --------------------------------------------------------- */
  const nav = $('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    const path = location.pathname, here = path.split('/').pop() || '/';
    $$('.nav__links a, .menu a.big').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (!href.includes('#') && (href === here || href === path)) a.setAttribute('aria-current', 'page');
    });
  }
  const burger = $('.burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = html.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('.menu a').forEach((a, i) => { a.style.setProperty('--i', i); a.addEventListener('click', () => html.classList.remove('menu-open')); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') html.classList.remove('menu-open'); });
  }

  /* ---------- 3. reveals ------------------------------------------------------- */
  if (motionOK) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.rv, .ln').forEach(el => io.observe(el));
    // Anything already in view on load reveals immediately (no wait for scroll).
    requestAnimationFrame(() => $$('.rv, .ln').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
    }));
    // count-up numbers
    const cio = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return; cio.unobserve(en.target);
        const el = en.target, to = parseFloat(el.dataset.count), t0 = performance.now(), d = 900;
        const fmt = n => Math.round(n).toLocaleString('en-US');
        const tick = t => { const p = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(to * e); if (p < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    $$('[data-count]').forEach(el => cio.observe(el));
  }

  /* ---------- 4. wire drawings (the blocks every demo is built from) --------- */
  // Each drawing is a tiny SVG at 320 wide. Classes map to CSS tokens so the same
  // drawing reads as grey wireframe or, inside `.painted`, as a branded page.
  const r = (x, y, w, h, c = 'w', rx = 2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${c}"/>`;
  const circ = (cx, cy, rr, c = 'w2') => `<circle cx="${cx}" cy="${cy}" r="${rr}" class="${c}"/>`;
  const plate = (x, y, w, h) => `${r(x, y, w, h, 'im', 3)}<path d="M${x + w / 2 - 9} ${y + h / 2 + 7} l9 -14 l9 14 z" class="ac" opacity=".9"/>`;
  const svg = (h, inner) => `<svg viewBox="0 0 320 ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${r(0, 0, 320, h, 'p', 0)}${inner}</svg>`;
  const WIRE = {
    nav: () => svg(30, r(14, 11, 34, 8, 'w3') + r(150, 12, 22, 6) + r(180, 12, 22, 6) + r(210, 12, 22, 6) + r(240, 12, 22, 6) + r(272, 8, 34, 14, 'bt', 7) + `<line x1="0" y1="29.5" x2="320" y2="29.5" class="ln1"/>`),
    hero: () => svg(126, r(14, 22, 44, 5, 'ac') + r(14, 34, 128, 13, 'w3') + r(14, 51, 104, 13, 'w3') + r(14, 72, 118, 5) + r(14, 81, 96, 5) + r(14, 96, 44, 14, 'bt', 7) + r(64, 96, 44, 14, 'w2', 7) + plate(170, 18, 136, 92)),
    logos: () => svg(36, [0, 1, 2, 3, 4].map(i => r(22 + i * 58, 13, 40, 10, 'w2')).join('')),
    features: () => svg(104, r(14, 16, 90, 9, 'w3') + [0, 1, 2].map(i => r(14 + i * 100, 40, 18, 18, 'ac', 4) + r(14 + i * 100, 66, 72, 6, 'w2') + r(14 + i * 100, 77, 84, 4) + r(14 + i * 100, 85, 60, 4)).join('')),
    stats: () => svg(60, [0, 1, 2, 3].map(i => r(18 + i * 76, 16, 44, 16, 'w3') + r(18 + i * 76, 38, 54, 5)).join('')),
    testimonial: () => svg(96, [0, 1, 2].map(i => r(14 + i * 100, 14, 92, 68, 'w', 6) + circ(30 + i * 100, 32, 8, 'im') + r(46 + i * 100, 27, 40, 5, 'w2') + r(46 + i * 100, 35, 28, 4, 'w2') + r(22 + i * 100, 50, 76, 4, 'w2') + r(22 + i * 100, 58, 70, 4, 'w2') + r(22 + i * 100, 66, 50, 4, 'w2')).join('')),
    pricing: () => svg(124, [0, 1, 2].map(i => r(14 + i * 100, 12 + (i === 1 ? -4 : 4), 92, 100 - (i === 1 ? 0 : 8), i === 1 ? 'w2' : 'w', 6) + r(24 + i * 100, 24 + (i === 1 ? -4 : 4), 36, 5, 'w3') + r(24 + i * 100, 36 + (i === 1 ? -4 : 4), 50, 12, 'w3') + [0, 1, 2].map(j => r(24 + i * 100, 56 + j * 9 + (i === 1 ? -4 : 4), 60, 4, 'w2')).join('') + r(24 + i * 100, 88 + (i === 1 ? 0 : 0), 72, 13, i === 1 ? 'ac' : 'bt', 6)).join('')),
    faq: () => svg(100, r(14, 12, 84, 9, 'w3') + [0, 1, 2, 3].map(i => r(14, 32 + i * 16, 190, 5, 'w2') + r(290, 31 + i * 16, 8, 8, 'ac', 2) + `<line x1="14" y1="${44 + i * 16}" x2="306" y2="${44 + i * 16}" class="ln1"/>`).join('')),
    cta: () => svg(68, r(0, 0, 320, 68, 'ac', 0) + r(14, 18, 150, 12, 'p') + r(14, 36, 100, 5, 'p') + r(232, 22, 74, 20, 'p', 10)),
    footer: () => svg(76, r(14, 14, 34, 8, 'w3') + [0, 1, 2].map(i => r(130 + i * 62, 14, 30, 5, 'w2') + r(130 + i * 62, 25, 40, 4) + r(130 + i * 62, 33, 34, 4) + r(130 + i * 62, 41, 38, 4)).join('') + `<line x1="14" y1="58" x2="306" y2="58" class="ln1"/>` + r(14, 64, 70, 4)),
    steps: () => svg(90, r(14, 14, 100, 9, 'w3') + [0, 1, 2, 3].map(i => circ(24 + i * 76, 44, 8, 'ac') + r(38 + i * 76, 40, 40, 5, 'w2') + r(14 + i * 76, 60, 60, 4) + r(14 + i * 76, 68, 48, 4)).join('')),
    team: () => svg(92, [0, 1, 2, 3].map(i => r(14 + i * 76, 12, 62, 46, 'im', 4) + r(14 + i * 76, 66, 44, 5, 'w2') + r(14 + i * 76, 76, 30, 4)).join('')),
    contact: () => svg(110, r(14, 16, 90, 9, 'w3') + r(14, 32, 110, 5) + r(14, 41, 86, 5) + r(170, 14, 136, 14, 'w', 4) + r(170, 34, 136, 14, 'w', 4) + r(170, 54, 136, 26, 'w', 4) + r(170, 86, 50, 12, 'bt', 6)),
    gallery: () => svg(96, r(14, 12, 92, 72, 'im', 4) + r(114, 12, 92, 34, 'im', 4) + r(114, 50, 92, 34, 'im', 4) + r(214, 12, 92, 72, 'im', 4)),
  };
  window.ASAS_WIRE = WIRE;
  const blk = (kind, extra = '') => `<div class="blk" data-kind="${kind}" ${extra}>${WIRE[kind]()}</div>`;
  $$('[data-wire]').forEach(el => { const k = el.dataset.wire; if (WIRE[k]) el.innerHTML = WIRE[k](); el.classList.add('blk'); });

  /* ---------- 5. the stacker (hero) ----------------------------------------- */
  const stacker = $('.stacker');
  if (stacker) {
    const page = $('.stacker__page', stacker);
    const rail = $('.stacker__rail', stacker);
    const file = $('.stacker__file', stacker);
    const kitLbl = $('.stacker__kit b', stacker);
    const kitDot = $('.stacker__kit i', stacker);
    const RECIPE = [
      ['nav', 'Madkhal', 'Entrance'], ['hero', 'Wajha', 'Musharrat'], ['logos', 'Rumouz', 'Iqai'],
      ['features', 'Mazaya', 'Hadi'], ['stats', 'Arqam', 'Miqdari'], ['testimonial', 'Araa', 'Qubbi'],
      ['pricing', 'Baqat', 'Muraffaf'], ['faq', 'Asila', 'Munfatih'], ['cta', 'Ataba', 'Lahiq'], ['footer', 'Khatima', 'Musattar'],
    ];
    page.innerHTML = RECIPE.map(([k]) => blk(k)).join('');
    const RAIL_AR = { nav: ['مدخل', 'الترويسة'], hero: ['واجهة', 'مشرّط'], logos: ['رموز', 'إيقاعي'], features: ['مزايا', 'هادئ'], stats: ['أرقام', 'مقداري'], testimonial: ['آراء', 'قبّي'], pricing: ['باقات', 'مرفّف'], faq: ['أسئلة', 'منفتح'] };
    rail.innerHTML = RECIPE.filter((_, i) => i < 8).map(([k, f, n]) => AR && RAIL_AR[k] ? `<div class="rail__row"><i></i><b>${RAIL_AR[k][0]}</b><span>· ${RAIL_AR[k][1]}</span></div>` : `<div class="rail__row"><i></i><b>${f}</b><span>· ${n}</span></div>`).join('');
    const blocks = $$('.blk', page), rows = $$('.rail__row', rail);
    const CYCLE = ['blueprint', 'clay', 'olive', 'plum', 'teal', 'rose'];
    const frame = $('.frame', stacker);
    let running = false, timer = null, ci = 0, visible = true, complete = false;
    const wait = ms => new Promise(res => { timer = setTimeout(res, ms); });
    const currentKit = () => html.getAttribute('data-kit') || 'blueprint';
    const setDemoKit = k => { const c = kitAccent(k); kitLbl.textContent = kitName(k); kitDot.style.background = c; frame.style.setProperty('--accent', c); };
    // keep the newest block in view: the page slides up as it grows, then returns to the top to be painted
    const follow = (i) => {
      const b = blocks[i], fh = frame.clientHeight - 28, bottom = b.offsetTop + b.offsetHeight;
      page.style.transition = 'transform 420ms cubic-bezier(.16,1,.3,1)';
      page.style.transform = bottom > fh ? `translateY(${fh - bottom}px)` : 'none';
    };
    async function run() {
      if (running) return; running = true;
      while (running) {
        if (complete) { await wait(2600); if (!running) return; }
        // reset
        frame.classList.remove('painted'); stacker.classList.remove('painting'); file.classList.remove('on');
        blocks.forEach(b => b.classList.remove('on')); rows.forEach(x => x.classList.remove('on'));
        page.style.transform = 'none'; complete = false;
        const k = ci === 0 ? currentKit() : CYCLE[ci % CYCLE.length];
        setDemoKit(k);
        await wait(ci === 0 ? 120 : 420);
        for (let i = 0; i < blocks.length; i++) {
          blocks[i].classList.add('on'); if (rows[i]) rows[i].classList.add('on');
          follow(i);
          await wait(i < 2 ? 240 : 170);
          if (!running) return;
        }
        await wait(500);
        page.style.transition = 'transform 900ms cubic-bezier(.83,0,.17,1)'; page.style.transform = 'none';
        await wait(500);
        stacker.classList.add('painting'); frame.classList.add('painted');
        await wait(1300);
        file.classList.add('on'); complete = true;
        await wait(3400);
        ci++;
        if (!visible) { running = false; return; }
      }
    }
    const stop = () => { running = false; clearTimeout(timer); };
    if (!motionOK) {
      stacker.classList.add('is-static'); frame.classList.add('painted'); rows.forEach(x => x.classList.add('on')); setDemoKit(currentKit());
    } else {
      const vio = new IntersectionObserver(en => { visible = en[0].isIntersecting; if (visible) run(); else stop(); }, { threshold: 0.2 });
      vio.observe(stacker);
      document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (visible) run(); });
    }
  }

  /* ---------- 6. how-it-works stage ------------------------------------------- */
  const stage = $('.stage');
  if (stage) {
    const grid = $('.stage__grid', stage), col = $('.stacker__page', stage);
    const KINDS = ['hero', 'features', 'pricing', 'testimonial', 'faq', 'steps', 'stats', 'cta', 'gallery'];
    const NAMES = AR ? { hero: 'واجهة', features: 'مزايا', pricing: 'باقات', testimonial: 'آراء', faq: 'أسئلة', steps: 'درج', stats: 'أرقام', cta: 'عتبة', gallery: 'معرض' } : { hero: 'Wajha · hero', features: 'Mazaya · features', pricing: 'Baqat · pricing', testimonial: 'Araa · voices', faq: 'Asila · FAQ', steps: 'Daraj · steps', stats: 'Arqam · stats', cta: 'Ataba · CTA', gallery: 'Maarad · gallery' };
    grid.innerHTML = KINDS.map((k, i) => `<div class="frame ${[0, 1, 2, 4].includes(i) ? 'pick' : ''}"><div class="frame__bar"><i></i><span>${NAMES[k]}</span></div>${blk(k)}</div>`).join('');
    col.innerHTML = ['nav', 'hero', 'features', 'stats', 'testimonial', 'pricing', 'faq', 'cta', 'footer'].map(k => blk(k)).join('');
    const frameCol = $('.stage__col .frame', stage);
    const steps = $$('.step');
    const set = n => {
      stage.dataset.step = n;
      steps.forEach(s => s.classList.toggle('is-active', s.dataset.step === String(n)));
      frameCol.classList.toggle('painted', n >= 3);
    };
    set(1);
    if (motionOK) {
      const sio = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) set(Number(en.target.dataset.step)); });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      steps.forEach(s => sio.observe(s));
    } else {
      // No motion: show the finished, painted, exported state and light every step.
      set(4); steps.forEach(s => s.classList.add('is-active'));
    }
    // also let steps be clicked/tapped (mobile has the stage above the steps)
    steps.forEach(s => s.addEventListener('click', () => set(Number(s.dataset.step))));
  }

  /* ---------- 7. library ---------------------------------------------------------- */
  const D = window.ASAS_DATA;
  const LAYOUT = AR ? { static: 'ثابت', carousel: 'دوّار', accordion: 'أكورديون', tabs: 'تبويبات', split: 'مقسوم' } : { static: 'Static', carousel: 'Carousel', accordion: 'Accordion', tabs: 'Tabs', split: 'Split layout' };
  const famBy = D ? Object.fromEntries(D.families.map(f => [f.key, f])) : {};
  const struct = (slug) => {
    // a deterministic "structure overlay" per card: 2–4 outlined containers
    let h = 0; for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const n = 2 + (h % 3), out = [];
    for (let i = 0; i < n; i++) {
      const top = 8 + i * (84 / n), hh = 84 / n - 6;
      out.push(`<i style="left:6%;top:${top}%;width:${i % 2 ? 42 : 88}%;height:${hh}%"></i>`);
      if (i % 2) out.push(`<i style="left:52%;top:${top}%;width:42%;height:${hh}%"></i>`);
    }
    return out.join('');
  };
  function cardHTML(b, opts = {}) {
    const fam = famBy[b.family] || {};
    const href = opts.link || (b.slug === 'wajha-176' ? PFX + '/block/wajha-176/' : 'https://asas.build/studio/?block=' + b.slug + (AR ? '&g=ar' : ''));
    const fn = famName(fam);
    return `<article class="card" data-slug="${b.slug}" data-family="${b.family}" data-layout="${b.layout}" data-q="${(b.name + ' ' + b.gloss + ' ' + fam.latin + ' ' + fam.name + ' ' + (AR_FAM[b.family] || '') + ' ' + b.slug + ' ' + b.ar_name).toLowerCase()}">
      <div class="card__media">
      <a class="card__thumb" href="${href}" data-cursor="${T.preview}" aria-label="${T.previewAria(AR ? b.ar_name : b.name, AR ? b.name : b.gloss, fn)}">
        <img src="${AR ? `/assets/img/cards-ar/card-${b.slug}.webp` : b.img}" alt="${T.blockAlt(fn, AR ? b.ar_name : b.name)}" loading="lazy" width="640" height="440">
        <div class="card__struct" aria-hidden="true">${struct(b.slug)}</div>
        <span class="card__tag">${LAYOUT[b.layout] || b.layout}</span>
      </a>
      <div class="card__act">
        <button type="button" class="btn btn--sm btn--stack" data-stack="${b.slug}" aria-pressed="false">${T.stack}</button>
      </div>
      </div>
      <div class="card__meta">
        ${AR ? `<div class="card__name">${b.ar_name}<span class="lat">${b.name}</span><small>${fam.ar || ''} ${b.slug.split('-')[1] || ''}</small></div>`
             : `<div class="card__name">${b.name}<span class="ar">${b.ar_name}</span><small>${b.gloss} · ${fam.latin || ''} ${b.slug.split('-')[1] || ''}</small></div>`}
        <div class="card__room">${fn}</div>
      </div>
    </article>`;
  }
  function pageHTML(p) {
    return `<article class="card card--page" data-slug="${p.slug}" data-type="${p.type}" data-q="${(p.name + ' ' + p.gloss + ' ' + p.type + ' ' + p.ar_name).toLowerCase()}">
      <a class="card__thumb" href="https://asas.build/studio/?stack=${p.recipe.join(',')}${AR ? '&g=ar' : ''}" data-cursor="${T.open}" aria-label="${T.pageAria(AR ? p.ar_name : p.name, typeName(p.type))}">
        <picture>${/\/img\/pages\//.test(p.img) ? `<source media="(min-width: 701px)" srcset="${p.img.replace('.webp', AR ? '-ar-d.webp' : '-d.webp')}">` : ''}<img src="${/\/img\/pages\//.test(p.img) && AR ? p.img.replace('.webp', '-ar.webp') : p.img}" alt="${T.pageAlt(typeName(p.type), AR ? p.ar_name : p.name, T.blocks(p.blocks))}" loading="lazy" width="780" height="1170"></picture>
      </a>
      <div class="card__meta">
        ${AR ? `<div class="card__name">${p.ar_name}<span class="lat">${p.name}</span><small>صفحة ${typeName(p.type)}</small></div>`
             : `<div class="card__name">${p.name}<span class="ar">${p.ar_name}</span><small>${p.gloss}</small></div>`}
        <div class="card__room">${T.blocks(p.blocks)}</div>
      </div>
    </article>`;
  }
  window.ASAS_CARD = cardHTML; window.ASAS_PAGECARD = pageHTML;
  // static grids anywhere: <div data-cards="hero,features" data-limit="8">
  $$('[data-cards]').forEach(el => {
    if (!D) return;
    const fams = el.dataset.cards ? el.dataset.cards.split(',') : null;
    const not = (el.dataset.not || '').split(',').filter(Boolean);
    let list = D.blocks.filter(b => (!fams || fams.includes(b.family)) && !not.includes(b.slug));
    if (el.dataset.limit) list = list.slice(0, Number(el.dataset.limit));
    el.innerHTML = list.map(b => cardHTML(b)).join('');
  });
  $$('[data-pages]').forEach(el => {
    if (!D) return;
    let list = D.pages.slice(0, Number(el.dataset.limit || 12));
    el.innerHTML = list.map(pageHTML).join('');
  });

  // Stack tray (a lightweight "saved collection" — the conversion path into the Studio)
  const tray = $('.tray');
  const stack = new Set((store.get('asas-stack') || '').split(',').filter(Boolean));
  function syncStack() {
    $$('.card').forEach(c => { const on = stack.has(c.dataset.slug); c.classList.toggle('in-stack', on); const b = $('[data-stack]', c); if (b) { b.setAttribute('aria-pressed', String(on)); b.textContent = on ? T.stacked : T.stack; } });
    if (tray) {
      tray.classList.toggle('is-on', stack.size > 0);
      $('.n', tray).textContent = T.blocks(stack.size);
      $('.tray__stack', tray).innerHTML = Array.from(stack).slice(0, 8).map(() => '<i></i>').join('');
      const open = $('.tray a.btn', tray);
      if (open) open.href = 'https://asas.build/studio/?stack=' + encodeURIComponent(Array.from(stack).join(',')) + (AR ? '&g=ar' : '');
    }
    store.set('asas-stack', Array.from(stack).join(','));
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-stack]');
    if (!b) return;
    const s = b.dataset.stack; const adding = !stack.has(s); adding ? stack.add(s) : stack.delete(s); syncStack();
    if (adding) track('add_to_stack', { block: s });
  });
  if (tray) $('.x', tray).addEventListener('click', () => { stack.clear(); syncStack(); });
  syncStack();

  // Library filters
  const lib = $('[data-library]');
  if (lib && D) {
    const grid = $('.cards', lib), empty = $('.empty', lib), count = $('.lib-count', lib), q = $('#lib-q');
    const tabs = $$('.tab', lib), rooms = $('.rail-groups', lib), beh = $$('[data-layout-filter]', lib);
    const groupsBox = $('.groupbar', lib);
    const st = { tab: 'blocks', family: null, layout: null, group: null, q: '' };
    // rooms rail
    rooms.innerHTML = D.groups.filter(g => D.families.some(f => f.group === g.key && f.blocks > 0)).map(g => `<div><h4>${AR ? g.ar : `${g.name} <span class="ar">${g.ar}</span>`}</h4>${D.families.filter(f => f.group === g.key && f.blocks > 0).map(f => `<button type="button" data-family="${f.key}" aria-pressed="false"><span>${famName(f)}</span><span class="n">${f.blocks.toLocaleString('en-US')}</span></button>`).join('')}</div>`).join('');
    const applyDOM = () => {
      const isPages = st.tab === 'pages';
      const items = isPages ? D.pages.map(pageHTML) : D.blocks.filter(b => (!st.family || b.family === st.family) && (!st.layout || b.layout === st.layout) && (!st.group || (famBy[b.family] || {}).group === st.group) && (!st.q || (b.name + ' ' + b.gloss + ' ' + (famBy[b.family] || {}).latin + ' ' + (famBy[b.family] || {}).name + ' ' + (famBy[b.family] || {}).ar + ' ' + (AR_FAM[b.family] || '') + ' ' + b.slug + ' ' + b.ar_name).toLowerCase().includes(st.q))).map(b => cardHTML(b));
      let shown = items;
      if (isPages && st.q) shown = D.pages.filter(p => (p.name + ' ' + p.gloss + ' ' + p.type + ' ' + p.ar_name).toLowerCase().includes(st.q)).map(pageHTML);
      grid.innerHTML = shown.join('');
      grid.classList.toggle('cards--pages', isPages);
      empty.classList.toggle('is-on', shown.length === 0);
      $('.empty .q', lib).textContent = st.q;
      const total = isPages ? D.totals.pages : (st.family ? famBy[st.family].blocks : D.totals.blocks);
      count.textContent = T.showing(shown.length, total.toLocaleString('en-US'));
      syncStack();
      if (cursorBind) cursorBind();
    };
    const apply = () => {
      if (document.startViewTransition && motionOK) document.startViewTransition(applyDOM); else applyDOM();
      $$('[data-family]', rooms).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.family === st.family)));
      beh.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.layoutFilter === (st.layout || ''))));
      $$('[data-group]', groupsBox).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.group === (st.group || ''))));
      tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.tab === st.tab)));
      $$('[data-blocks-only]', lib).forEach(el => { el.hidden = st.tab !== 'blocks'; });
    };
    rooms.addEventListener('click', e => { const b = e.target.closest('[data-family]'); if (!b) return; st.family = st.family === b.dataset.family ? null : b.dataset.family; st.group = null; apply(); });
    beh.forEach(b => b.addEventListener('click', () => { st.layout = st.layout === b.dataset.layoutFilter ? null : (b.dataset.layoutFilter || null); apply(); }));
    $$('[data-group]', groupsBox).forEach(b => b.addEventListener('click', () => { st.group = st.group === b.dataset.group ? null : (b.dataset.group || null); st.family = null; apply(); }));
    tabs.forEach(t => t.addEventListener('click', () => { st.tab = t.dataset.tab; apply(); }));
    if (q) { let to; q.addEventListener('input', () => { clearTimeout(to); to = setTimeout(() => { st.q = q.value.trim().toLowerCase(); apply(); }, 120); }); }
    // deep links: #pages, #hero…
    const hash = (location.hash || '').slice(1);
    if (hash === 'pages') st.tab = 'pages';
    else if (hash && famBy[hash]) st.family = hash;
    $$('[data-clear]', lib).forEach(b => b.addEventListener('click', () => { st.family = st.layout = st.group = null; st.q = ''; if (q) q.value = ''; apply(); }));
    apply();
  }

  /* ---------- 8. cursor label ----------------------------------------------------- */
  let cursorBind = null;
  if (FINE.matches && motionOK) {
    const cur = document.createElement('div'); cur.className = 'cur'; cur.innerHTML = '<b></b>'; document.body.appendChild(cur);
    let x = 0, y = 0, tx = 0, ty = 0, on = false, raf = null;
    const loop = () => { x += (tx - x) * 0.22; y += (ty - y) * 0.22; cur.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`; raf = (on || Math.abs(tx - x) > 0.5) ? requestAnimationFrame(loop) : null; };
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(loop); }, { passive: true });
    cursorBind = () => $$('[data-cursor]').forEach(el => {
      if (el.dataset.curBound) return; el.dataset.curBound = '1';
      el.addEventListener('mouseenter', () => { $('b', cur).textContent = el.dataset.cursor; cur.classList.add('is-on'); on = true; if (!raf) raf = requestAnimationFrame(loop); });
      el.addEventListener('mouseleave', () => { cur.classList.remove('is-on'); on = false; });
    });
    cursorBind();
  }

  /* ---------- 9. forms + copy ---------------------------------------------------------- */
  $$('form[data-capture]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const email = $('input[type=email]', f);
    if (email && !email.checkValidity()) { email.reportValidity(); return; }
    const btn = $('button[type=submit]', f), label = btn ? btn.textContent : '';
    const note = $('.form-note', f);
    if (btn) { btn.disabled = true; btn.textContent = T.sending; }
    const list = email && email.id === 'pro-email' ? 'pro' : 'updates';
    fetch('/wp-json/asas/v1/subscribe', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email ? email.value : '', list, lang: document.documentElement.lang, page: location.href, website: '' })
    }).then(r => r.json().then(j => ({ ok: r.ok && j.ok, j }))).then(({ ok, j }) => {
      if (!ok) throw new Error((j && j.message) || T.sendFail);
      f.classList.add('is-done');
      track('generate_lead', { form: list });
    }).catch(err => {
      if (btn) { btn.disabled = false; btn.textContent = label; }
      if (note) { note.textContent = (document.documentElement.lang === 'ar' ? T.sendFail : (err.message || T.sendFail)); note.style.color = 'var(--accent)'; }
    });
  }));
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="/studio/"]');
    if (a) track('open_studio', { link_text: a.textContent.trim().slice(0, 60), link_url: a.href });
  });
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const txt = b.dataset.copy, old = b.textContent;
    try { await navigator.clipboard.writeText(txt); b.textContent = T.copied; }
    catch (e) { const s = document.createElement('input'); s.value = txt; document.body.appendChild(s); s.select(); try { document.execCommand('copy'); b.textContent = T.copied; } catch (_) { b.textContent = T.selectCopy; } s.remove(); }
    setTimeout(() => { b.textContent = old; }, 1600);
  }));

  /* ---------- 10. misc ----------------------------------------------------------------- */
  // marquee content
  $$('[data-marquee]').forEach(m => {
    if (!D) return;
    const items = D.families.filter(f => f.blocks > 0 && f.key !== 'single').map(f => AR
      ? `<span class="marquee__item"><span>${famName(f)}</span><span class="mono">${f.blocks.toLocaleString('en-US')}</span></span>`
      : `<span class="marquee__item"><span>${f.name}</span><span class="ar">${f.ar}</span><span class="mono">${f.blocks.toLocaleString('en-US')}</span></span>`);
    m.innerHTML = `<div class="marquee__track">${items.join('')}${items.join('')}</div>`;
  });
  // rooms grid
  $$('[data-rooms]').forEach(el => {
    if (!D) return;
    const lim = Number(el.dataset.limit || 99);
    const fams = D.families.filter(f => f.blocks > 0).slice(0, lim);
    el.innerHTML = fams.map(f => `<a class="room" href="${PFX + (ROOM_PAGE[f.key] || '/library/#' + f.key)}">
      <div class="room__top"><span class="room__ar">${f.ar}</span><span class="room__n">${f.blocks.toLocaleString('en-US')}</span></div>
      <div><div class="room__name">${famName(f)}</div><div class="room__latin">${AR ? `<span class="lat">${f.latin}</span> · ${f.name}` : `${f.latin} · ${f.gloss}`}</div></div>
      <div class="room__group">${(g => g ? (AR ? g.ar : g.name) : '')(D.groups.find(g => g.key === f.group))}</div>
    </a>`).join('');
  });
  // TOC highlight
  const toc = $('.toc');
  if (toc && motionOK) {
    const links = $$('a', toc), heads = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
    const tio = new IntersectionObserver(en => { en.forEach(x => { if (x.isIntersecting) { links.forEach(a => a.classList.toggle('is-on', a.getAttribute('href') === '#' + x.target.id)); } }); }, { rootMargin: '-20% 0px -70% 0px' });
    heads.forEach(h => tio.observe(h));
  }
  // year
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
