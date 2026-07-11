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

const startHero = () => {
  loader?.classList.add('hidden');
  document.body.classList.add('hero-in');
};
window.addEventListener('load', () => {
  setTimeout(startHero, 700);
});
setTimeout(startHero, 2200);

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

const langButtons = document.querySelectorAll('.lang-toggle button');
langButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    langButtons.forEach(b => b.classList.toggle('active', b === btn));
  });
});

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

const menuTabs = document.querySelectorAll('.menu-tab');
const menuPanels = document.querySelectorAll('.menu-panel');
menuTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab.classList.contains('active')) return;
    menuTabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    menuPanels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === tab.dataset.cat));
  });
});

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
