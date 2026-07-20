// Live menu: fetches categories/sections/items from Supabase and re-renders
// the menu accordion. The static HTML stays visible until data arrives, and
// remains the fallback whenever the fetch fails.

const SUPABASE_URL = 'https://waibybqjhzddpfhzrisx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhaWJ5YnFqaHpkZHBmaHpyaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzODg4ODYsImV4cCI6MjA5OTk2NDg4Nn0.zufjm2J4F4mePJhd072hoXh5vLqfXNVuPFEN1BbKs3k';

(async () => {
  // reveal the menu (fetched or fallback) and let the loader proceed
  const menuDone = () => {
    document.body.classList.add('menu-ready');
    window.dispatchEvent(new Event('ramouz:menu-done'));
  };
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.info('[menu-live] Supabase not configured; using the static menu.');
    menuDone();
    return;
  }
  const accordion = document.querySelector('[data-menu-accordion]');
  if (!accordion) { menuDone(); return; }

  const CAT_SLUGS = {
    'Coffee Base': 'coffee-base',
    'Tea & Matcha': 'tea-matcha',
    'Cold & Refreshing': 'cold',
    'Bites': 'bites',
    'Fit': 'fit',
  };
  const slugify = s => s.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const THUMB_PH = '<svg class="mi-thumb-ph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8 1-6h2"/></svg>';
  const CHEVRON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const bySort = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

  let cats;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/categories?select=*,sections(*,subsections(*),items(*,variants(*)))`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    cats = await res.json();
  } catch (err) {
    console.warn('[menu-live] fetch failed, falling back to static menu:', err);
    menuDone();
    return;
  }
  if (!Array.isArray(cats) || !cats.length) { menuDone(); return; }

  let html = '';
  let totalItems = 0;
  const renderedCats = [];
  cats.sort(bySort).forEach(cat => {
    const catSlug = CAT_SLUGS[cat.name] || slugify(cat.name);
    const catHadItems = totalItems;
    (cat.sections || []).sort(bySort).forEach(sec => {
      const secSlug = slugify(sec.name);
      const subNames = new Map((sec.subsections || []).map(s => [s.id, s]));
      const items = (sec.items || []).filter(i => i.is_available !== false).sort(bySort);
      if (!items.length) return;
      totalItems += items.length;

      let rows = '';
      let lastSub = null;
      items.forEach(item => {
        const sub = item.subsection_id != null ? subNames.get(item.subsection_id) : null;
        if (sub && sub.name !== lastSub) {
          rows += `<li class="menu-subhead">${esc(sub.name)}</li>`;
          lastSub = sub.name;
        }
        const img = `<img src="${esc(item.image_url || 'assets/images/logo.png')}" alt="${esc(item.name)}" width="56" height="56" loading="lazy" onerror="this.remove()">`;
        const thumbCls = item.image_url ? 'mi-thumb' : 'mi-thumb mi-thumb--brand';
        const desc = item.description ? `<p class="mi-desc">${esc(item.description)}</p>` : '';
        const variants = (item.variants || []).sort(bySort);
        const picker = variants.length
          ? `<span class="mi-picker"><select class="mi-select" aria-label="${esc(item.name)} options">${variants.map(v => `<option>${esc(v.name)}</option>`).join('')}</select>${CHEVRON}</span>`
          : '';
        const price = Number(item.price).toFixed(3);
        rows += `<li class="menu-item"><span class="${thumbCls}">${THUMB_PH}${img}</span><div class="mi-main"><div class="mi-head"><span class="mi-name">${esc(item.name)}</span><span class="mi-dots"></span><span class="mi-price">${price}</span></div>${picker}${desc}</div></li>`;
      });

        const tintCls = cat.color ? ' has-tint' : '';
      const tintStyle = cat.color ? ` style="--cat-tint:${esc(cat.color)}"` : '';
      html += `<div class="menu-accordion-item${tintCls}"${tintStyle} data-cat="${esc(catSlug)}" data-box="${esc(secSlug)}">`
        + `<button type="button" class="menu-accordion-head" aria-expanded="false" aria-controls="acc-${esc(secSlug)}">`
        + `<span class="acc-icon">${sec.icon || THUMB_PH}</span>`
        + `<span class="acc-title">${esc(sec.name)}</span>`
        + `<span class="acc-count">${items.length} item${items.length === 1 ? '' : 's'}</span>`
        + `<span class="acc-chevron" aria-hidden="true">${CHEVRON}</span>`
        + `</button>`
        + `<div class="menu-accordion-body" id="acc-${esc(secSlug)}"><ul class="menu-list menu-list--thumbs">${rows}</ul></div>`
        + `</div>`;
    });
    if (totalItems > catHadItems) renderedCats.push({ name: cat.name, slug: catSlug, emoji: cat.emoji });
  });
  if (!totalItems) { menuDone(); return; }

  accordion.innerHTML = html;

  // rebuild the category tabs so admin-made categories appear on the site
  const allTab = document.querySelector('.menu-tabs .menu-tab[data-cat="all"]');
  if (allTab) {
    const TAB_EMOJI = {
      'Coffee Base': '☕',
      'Tea & Matcha': '🍵',
      'Cold & Refreshing': '🧊',
      'Bites': '🥐',
      'Fit': '💪',
    };
    document.querySelectorAll('.menu-tabs .menu-tab:not([data-cat="all"])').forEach(t => t.remove());
    let anchor = allTab;
    renderedCats.forEach(cat => {
      const b = document.createElement('button');
      b.className = 'menu-tab';
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', 'false');
      b.dataset.cat = cat.slug;
      b.dataset.label = cat.name;
      b.innerHTML = `<span class="tab-ico" aria-hidden="true">${esc(cat.emoji || TAB_EMOJI[cat.name] || '🍽️')}</span>${esc(cat.name)}`;
      anchor.after(b);
      anchor = b;
    });
  }

  // keep the "82 items, all prices in OMR" subtitle honest
  const subtitle = document.querySelector('#menu .section-heading p:not(.eyebrow)');
  if (subtitle) subtitle.textContent = subtitle.textContent.replace(/^\d+/, String(totalItems));
  menuDone();
})();
