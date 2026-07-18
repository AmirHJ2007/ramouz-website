document.body.classList.add('js');

const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const loader = document.querySelector('.loader');
const glow = document.querySelector('.cursor-glow');
const heroContent = document.querySelector('.hero-content');
const scrollCue = document.querySelector('.scroll-cue');
const progressBar = document.querySelector('.scroll-progress');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const loaderVideo = loader?.querySelector('video');
let pageReady = false;
let videoDone = !loaderVideo;
let heroStarted = false;
const startHero = () => {
  if (heroStarted) return;
  heroStarted = true;
  loader?.classList.add('hidden');
  document.body.classList.add('hero-in');
};
const tryStartHero = () => { if (pageReady && videoDone) startHero(); };
window.addEventListener('load', () => { pageReady = true; tryStartHero(); });
if (loaderVideo) {
  loaderVideo.muted = true;
  loaderVideo.play?.().catch(() => {});
  let lastT = 0;
  loaderVideo.addEventListener('timeupdate', () => {
    const d = loaderVideo.duration;
    if (loaderVideo.currentTime < lastT || (d && loaderVideo.currentTime >= d - 0.08)) {
      videoDone = true;
      tryStartHero();
    }
    lastT = loaderVideo.currentTime;
  });
  loaderVideo.addEventListener('error', () => { videoDone = true; tryStartHero(); });
  if (reducedMotion) {
    videoDone = true;
  } else {
    // autoplay may be blocked; don't hold the page hostage for the video
    const autoplayGuard = setTimeout(() => {
      if (loaderVideo.paused) { videoDone = true; tryStartHero(); }
    }, 1800);
    loaderVideo.addEventListener('playing', () => clearTimeout(autoplayGuard), { once: true });
  }
}
// hard safety: never trap the visitor on the loader
setTimeout(() => { pageReady = true; videoDone = true; startHero(); }, 8000);

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 28);
  scrollCue?.classList.toggle('away', window.scrollY > 80);
  if (progressBar) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%';
  }
}, { passive: true });

if (heroContent && !reducedMotion) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const vh = window.innerHeight || 1;
      if (y <= vh) {
        heroContent.style.transform = `translateY(${y * 0.28}px)`;
        heroContent.style.opacity = `${Math.max(0, 1 - y / (vh * 0.72))}`;
      }
      ticking = false;
    });
  }, { passive: true });
}

menuToggle?.addEventListener('click', () => nav?.classList.toggle('open'));
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Gentle JS-driven glide for in-page links — Safari's native smooth scroll is too fast
const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
let glideRaf = 0;
const glideTo = targetY => {
  cancelAnimationFrame(glideRaf);
  const startY = window.scrollY;
  const dist = targetY - startY;
  if (!dist) return;
  const duration = Math.min(1400, 550 + Math.abs(dist) * 0.22);
  const t0 = performance.now();
  const step = now => {
    const p = Math.min(1, (now - t0) / duration);
    window.scrollTo({ top: startY + dist * easeInOutCubic(p), behavior: 'instant' });
    if (p < 1) glideRaf = requestAnimationFrame(step);
  };
  glideRaf = requestAnimationFrame(step);
};
['wheel', 'touchstart'].forEach(ev =>
  window.addEventListener(ev, () => cancelAnimationFrame(glideRaf), { passive: true })
);
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link || reducedMotion) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  glideTo(target.getBoundingClientRect().top + window.scrollY - offset);
  history.pushState(null, '', link.getAttribute('href'));
});

const langSelect = document.querySelector('[data-lang-select]');
const langTrigger = document.querySelector('[data-lang-trigger]');
const langMenu = document.querySelector('[data-lang-menu]');
if (langSelect && langTrigger && langMenu) {
  const langOptions = [...langMenu.querySelectorAll('button[data-lang]')];
  const triggerFlag = langTrigger.querySelector('.lang-flag');
  const triggerLabel = langTrigger.querySelector('span:not(.lang-flag)');
  const flagByLang = { en: '🇬🇧', ar: '🇴🇲' };
  const labelByLang = { en: 'English', ar: 'العربية' };

  const closeLangMenu = () => {
    langSelect.classList.remove('open');
    langTrigger.setAttribute('aria-expanded', 'false');
  };

  langTrigger.addEventListener('click', () => {
    const willOpen = !langSelect.classList.contains('open');
    langSelect.classList.toggle('open', willOpen);
    langTrigger.setAttribute('aria-expanded', String(willOpen));
  });

  langOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      langOptions.forEach(o => {
        const on = o === opt;
        o.classList.toggle('active', on);
        o.closest('li')?.setAttribute('aria-selected', String(on));
      });
      const lang = opt.dataset.lang;
      if (triggerFlag) triggerFlag.textContent = flagByLang[lang];
      if (triggerLabel) triggerLabel.textContent = labelByLang[lang];
      closeLangMenu();
      langTrigger.focus();
    });
  });

  document.addEventListener('click', e => {
    if (!langSelect.contains(e.target)) closeLangMenu();
  });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && langSelect.classList.contains('open')) {
      closeLangMenu();
      langTrigger.focus();
    }
  });
}

if (glow && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

document.querySelectorAll('.gallery-grid, .filter-bar, .contact-grid').forEach(group => {
  group.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.rdelay = Math.min(i * 70, 420);
  });
});

const closeAccordionItem = (item) => {
  const head = item.querySelector('.menu-accordion-head');
  const body = item.querySelector('.menu-accordion-body');
  item.classList.remove('open');
  head?.setAttribute('aria-expanded', 'false');
  if (body) body.style.maxHeight = '0px';
};

// Delegated so the menu keeps working after being re-rendered from Supabase
document.querySelectorAll('[data-menu-accordion]').forEach(accordion => {
  accordion.addEventListener('click', (e) => {
    const head = e.target.closest('.menu-accordion-head');
    if (!head) return;
    const item = head.closest('.menu-accordion-item');
    const body = item.querySelector('.menu-accordion-body');
    if (item.classList.contains('open')) {
      closeAccordionItem(item);
    } else {
      item.classList.add('open');
      head.setAttribute('aria-expanded', 'true');
      if (body) body.style.maxHeight = `${body.scrollHeight}px`;
    }
  });
  accordion.addEventListener('animationend', (e) => {
    const item = e.target.closest?.('.menu-accordion-item');
    if (item) item.style.animation = '';
  });
});

const menuTabs = document.querySelectorAll('.menu-tab');
const getMenuBoxes = () => document.querySelectorAll('.menu-accordion-item');
const menuPanelCount = document.querySelector('.menu-book .panel-count');
const menuPanelTitle = document.querySelector('.menu-book .panel-title');
const menuTitleByCat = { all: 'Full menu', 'coffee-base': 'Coffee Base', 'tea-matcha': 'Tea & Matcha', cold: 'Cold & Refreshing', bites: 'Bites', fit: 'Fit' };

function applyMenuFilter(filter) {
  document.querySelectorAll('.menu-accordion-item.open').forEach(closeAccordionItem);
  let shown = 0;
  let itemTotal = 0;
  getMenuBoxes().forEach(item => {
    const show = filter === 'all' || item.dataset.cat === filter;
    item.classList.toggle('hidden', !show);
    if (show) {
      itemTotal += item.querySelectorAll('.menu-item').length;
      if (!reducedMotion) {
        item.style.animation = 'none';
        void item.offsetWidth;
        item.style.animation = `galleryPop .4s ease ${shown * 55}ms both`;
      }
      shown++;
    }
  });
  if (menuPanelCount) menuPanelCount.textContent = `${itemTotal} item${itemTotal === 1 ? '' : 's'}`;
  if (menuPanelTitle) {
    menuPanelTitle.style.animation = 'none';
    void menuPanelTitle.offsetWidth;
    menuPanelTitle.textContent = menuTitleByCat[filter] || 'Full menu';
    if (!reducedMotion) menuPanelTitle.style.animation = 'menuTitleIn .4s ease';
  }
}

menuTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab.classList.contains('active')) return;
    menuTabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    applyMenuFilter(tab.dataset.cat);
  });
});

const menuSearchInput = document.querySelector('[data-menu-search]');
const menuSearchClear = document.querySelector('[data-search-clear]');
const menuEmpty = document.querySelector('[data-menu-empty]');
const menuEmptyQuery = document.querySelector('[data-menu-empty-query]');
if (menuSearchInput && menuSearchClear && menuTabs.length && getMenuBoxes().length) {
  let preSearchTab = null;

  const openBoxForSearch = (item) => {
    const head = item.querySelector('.menu-accordion-head');
    const body = item.querySelector('.menu-accordion-body');
    item.classList.add('open');
    head?.setAttribute('aria-expanded', 'true');
    if (body) body.style.maxHeight = `${body.scrollHeight}px`;
  };

  const setActiveTab = (tab) => {
    menuTabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (menuPanelTitle && tab) menuPanelTitle.textContent = menuTitleByCat[tab.dataset.cat] || 'Full menu';
  };

  const runSearch = (raw) => {
    const query = raw.trim().toLowerCase();
    menuSearchClear.classList.toggle('show', query.length > 0);

    if (!query) {
      if (menuEmpty) menuEmpty.hidden = true;
      getMenuBoxes().forEach(box => {
        box.querySelectorAll('.menu-item').forEach(li => li.classList.remove('hidden'));
      });
      const restoreTab = preSearchTab || document.querySelector('.menu-tab[data-cat="all"]');
      preSearchTab = null;
      setActiveTab(restoreTab);
      applyMenuFilter(restoreTab?.dataset.cat || 'all');
      return;
    }

    if (!preSearchTab) {
      preSearchTab = document.querySelector('.menu-tab.active') || document.querySelector('.menu-tab[data-cat="all"]');
    }
    setActiveTab(document.querySelector('.menu-tab[data-cat="all"]'));

    let visibleItems = 0;
    getMenuBoxes().forEach(box => {
      let boxMatch = false;
      box.querySelectorAll('.menu-item').forEach(li => {
        const name = li.querySelector('.mi-name')?.textContent || '';
        const desc = li.querySelector('.mi-desc')?.textContent || '';
        const match = `${name} ${desc}`.toLowerCase().includes(query);
        li.classList.toggle('hidden', !match);
        if (match) { boxMatch = true; visibleItems++; }
      });
      box.classList.toggle('hidden', !boxMatch);
      if (boxMatch) openBoxForSearch(box); else closeAccordionItem(box);
    });

    if (menuPanelCount) menuPanelCount.textContent = `${visibleItems} item${visibleItems === 1 ? '' : 's'}`;
    if (menuEmpty) menuEmpty.hidden = visibleItems !== 0;
    if (visibleItems === 0 && menuEmptyQuery) menuEmptyQuery.textContent = raw.trim();
  };

  menuSearchInput.addEventListener('input', (e) => runSearch(e.target.value));
  menuSearchClear.addEventListener('click', () => {
    menuSearchInput.value = '';
    runSearch('');
    menuSearchInput.focus();
  });
  menuSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      menuSearchInput.value = '';
      runSearch('');
      menuSearchInput.blur();
    }
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = reducedMotion ? 0 : Number(entry.target.dataset.rdelay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold: .15});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const instaTile = document.querySelector('.contact-tile.accent');
if (instaTile && !reducedMotion) {
  const catObserver = new IntersectionObserver(entries => {
    entries.forEach(e => instaTile.classList.toggle('cat-in', e.isIntersecting));
  }, { threshold: .35 });
  catObserver.observe(instaTile);
}

const slider = document.querySelector('[data-slider]');
if (slider) {
  const slides = [...slider.querySelectorAll('[data-slide]')];
  const stage = slider.querySelector('.slide-stage');
  const dotsWrap = slider.querySelector('[data-dots]');
  const countCur = slider.querySelector('[data-count-current]');
  const pad = n => String(n + 1).padStart(2, '0');
  let current = 0;
  let busy = false;

  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) b.classList.add('active');
    b.addEventListener('click', () => goTo(i, i > current ? 'next' : 'prev'));
    dotsWrap?.appendChild(b);
    return b;
  });
  slides.forEach((s, i) => s.setAttribute('aria-hidden', i === 0 ? 'false' : 'true'));

  function goTo(index, dir) {
    if (busy) return;
    const target = (index + slides.length) % slides.length;
    if (target === current) return;
    busy = true;
    const out = slides[current];
    const inn = slides[target];
    slider.dataset.dir = dir;
    void slider.offsetWidth;
    out.classList.remove('is-active');
    out.classList.add('is-leaving');
    inn.classList.add('is-active');
    out.setAttribute('aria-hidden', 'true');
    inn.setAttribute('aria-hidden', 'false');
    dots.forEach((d, i) => d.classList.toggle('active', i === target));
    if (countCur) {
      countCur.textContent = pad(target);
      if (!reducedMotion) {
        countCur.style.animation = 'none';
        void countCur.offsetWidth;
        countCur.style.animation = 'countTick .4s ease';
      }
    }
    current = target;
    setTimeout(() => { out.classList.remove('is-leaving'); busy = false; }, reducedMotion ? 0 : 680);
  }
  const next = () => goTo(current + 1, 'next');
  const prev = () => goTo(current - 1, 'prev');
  slider.querySelector('[data-next]')?.addEventListener('click', next);
  slider.querySelector('[data-prev]')?.addEventListener('click', prev);

  let dragX = null;
  stage?.addEventListener('pointerdown', e => { dragX = e.clientX; stage.classList.add('dragging'); });
  window.addEventListener('pointerup', e => {
    if (dragX === null) return;
    const dx = e.clientX - dragX;
    dragX = null;
    stage?.classList.remove('dragging');
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
  });
  window.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (!slider.matches(':hover') && !slider.contains(document.activeElement)) return;
    e.preventDefault();
    (e.key === 'ArrowRight' ? next : prev)();
  });
}

const tilt = document.querySelector('[data-tilt]');
if (tilt && window.matchMedia('(pointer:fine)').matches) {
  tilt.addEventListener('pointermove', (e) => {
    const r = tilt.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    tilt.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  tilt.addEventListener('pointerleave', () => tilt.style.transform = 'rotateY(0) rotateX(0)');
}

const filterButtons = document.querySelectorAll('[data-filter]');
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => item.addEventListener('animationend', () => { item.style.animation = ''; }));
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    let shown = 0;
    galleryItems.forEach(item => {
      const show = filter === 'all' || item.dataset.type.includes(filter);
      item.classList.toggle('hidden', !show);
      if (show && !reducedMotion) {
        item.classList.add('visible');
        item.style.animation = 'none';
        void item.offsetWidth;
        item.style.animation = `galleryPop .45s ease ${shown * 45}ms both`;
        shown++;
      }
    });
  });
});

const lightbox = document.querySelector('[data-lightbox]');
const lightboxImg = lightbox?.querySelector('img');
const lightboxCap = lightbox?.querySelector('.lightbox-cap');
document.querySelectorAll('[data-src]').forEach(item => {
  item.addEventListener('click', () => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = item.dataset.src;
    if (lightboxCap) {
      const cap = item.querySelector('span');
      lightboxCap.textContent = cap ? (cap.lastChild?.textContent || '').trim() : '';
    }
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
  });
});

document.querySelector('[data-close-lightbox]')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
function closeLightbox(){
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  setTimeout(() => { lightboxImg.src = ''; }, 220);
}

/* ===== Premium menu: floating photo preview on item hover ===== */
(() => {
  const canHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const book = document.querySelector('[data-menu-book]');
  if (!book || !canHover || noMotion) return;

  const preview = document.createElement('div');
  preview.className = 'mi-preview';
  preview.setAttribute('aria-hidden', 'true');
  preview.innerHTML = '<img alt=""><span class="mi-preview-name"></span>';
  document.body.appendChild(preview);
  const pImg = preview.querySelector('img');
  const pName = preview.querySelector('.mi-preview-name');

  let raf = 0, mx = 0, my = 0;
  const place = () => {
    raf = 0;
    const w = preview.offsetWidth || 240;
    const h = preview.offsetHeight || 300;
    let x = mx + 26, y = my - h / 2;
    if (x + w > window.innerWidth - 14) x = mx - w - 26;
    y = Math.max(14, Math.min(y, window.innerHeight - h - 14));
    preview.style.transform = `translate(${x}px, ${y}px) rotate(2.5deg)`;
  };

  book.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!raf && preview.classList.contains('show')) raf = requestAnimationFrame(place);
  });

  book.addEventListener('mouseover', (e) => {
    const item = e.target.closest('.menu-item');
    if (!item || !book.contains(item)) return;
    const thumb = item.querySelector('.mi-thumb img');
    if (!thumb || !thumb.currentSrc && !thumb.src) return;
    const name = item.querySelector('.mi-name')?.textContent.trim() || '';
    pImg.src = thumb.currentSrc || thumb.src;
    pName.textContent = name;
    preview.classList.add('show');
    if (!raf) raf = requestAnimationFrame(place);
  });

  book.addEventListener('mouseout', (e) => {
    const item = e.target.closest('.menu-item');
    if (item && !item.contains(e.relatedTarget)) preview.classList.remove('show');
  });

  window.addEventListener('scroll', () => preview.classList.remove('show'), { passive: true });
})();

/* ===== Expand all / Collapse all ===== */
(() => {
  const btn = document.querySelector('[data-expand-all]');
  const accordion = document.querySelector('[data-menu-accordion]');
  if (!btn || !accordion) return;
  const label = btn.querySelector('[data-expand-label]');

  const visibleItems = () =>
    [...accordion.querySelectorAll('.menu-accordion-item')].filter(it => !it.classList.contains('hidden'));

  const setItem = (item, open) => {
    const head = item.querySelector('.menu-accordion-head');
    const body = item.querySelector('.menu-accordion-body');
    item.classList.toggle('open', open);
    if (head) head.setAttribute('aria-expanded', String(open));
    if (body) body.style.maxHeight = open ? `${body.scrollHeight}px` : '0px';
  };

  const refresh = () => {
    const items = visibleItems();
    const allOpen = items.length > 0 && items.every(it => it.classList.contains('open'));
    btn.classList.toggle('all-open', allOpen);
    if (label) label.textContent = allOpen ? 'Collapse all' : 'Expand all';
    btn.setAttribute('aria-label', allOpen ? 'Collapse all categories' : 'Expand all categories');
  };

  btn.addEventListener('click', () => {
    const items = visibleItems();
    const allOpen = items.length > 0 && items.every(it => it.classList.contains('open'));
    items.forEach(it => setItem(it, !allOpen));
    refresh();
  });

  document.querySelector('#menu')?.addEventListener('click', () => requestAnimationFrame(refresh));
  refresh();
})();

/* ===== About slider: autoplay with progress dot ===== */
(() => {
  const slider = document.querySelector('[data-slider]');
  if (!slider || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const nextBtn = slider.querySelector('[data-next]');
  const dotsWrap = slider.querySelector('[data-dots]');
  if (!nextBtn || !dotsWrap) return;

  const DURATION = 5000;
  let progress = 0, last = null, hovering = false, inView = false;

  const reset = () => {
    progress = 0;
    dotsWrap.querySelectorAll('button').forEach(b => b.style.removeProperty('--p'));
  };

  const tick = (t) => {
    requestAnimationFrame(tick);
    if (last === null) { last = t; return; }
    const dt = Math.min(t - last, 100);
    last = t;
    if (hovering || !inView || document.hidden) return;
    progress += dt;
    const dot = dotsWrap.querySelector('button.active');
    if (dot) dot.style.setProperty('--p', Math.min(progress / DURATION, 1).toFixed(4));
    if (progress >= DURATION) { reset(); nextBtn.click(); }
  };

  slider.addEventListener('pointerenter', () => { hovering = true; });
  slider.addEventListener('pointerleave', () => { hovering = false; });
  slider.addEventListener('pointerdown', reset);
  slider.addEventListener('keydown', reset);
  dotsWrap.addEventListener('click', reset);
  slider.querySelectorAll('.slider-arrow').forEach(b => b.addEventListener('click', reset));

  new IntersectionObserver(
    entries => entries.forEach(e => { inView = e.isIntersecting; }),
    { threshold: .3 }
  ).observe(slider);

  requestAnimationFrame(tick);
})();

/* ===== Gallery: cursor-follow 3D tilt (desktop only) ===== */
(() => {
  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const grid = document.querySelector('[data-gallery]');
  if (!grid) return;
  grid.addEventListener('pointermove', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    const r = item.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    item.style.transition = 'transform .12s ease-out, box-shadow .35s ease';
    item.style.transform =
      `perspective(800px) translateY(-8px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
  });
  grid.addEventListener('pointerout', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item || item.contains(e.relatedTarget)) return;
    item.style.transition = '';
    item.style.transform = '';
  });
})();

/* ===== Footer: auto-updating copyright year ===== */
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});
