#!/usr/bin/env node
/**
 * SINGLE SOURCE OF TRUTH for the menu on the page.
 *
 * Reads the menu from Supabase and rewrites, from that one fetch:
 *   1. the static <li class="menu-item"> accordion in index.html
 *      (between <!-- MENU:START --> and <!-- MENU:END -->)
 *   2. the hasMenu object inside the single <script type="application/ld+json">
 *   3. the item-count in the #menu subtitle
 *   4. the item-count in llms.txt
 *
 * Because the visible fallback and the schema come from one run, they cannot
 * diverge. The item HTML template is kept identical to assets/js/menu-live-2.js
 * so the static fallback matches what the live overlay renders.
 *
 *   node build_menu.mjs
 *
 * Read-only against Supabase (public anon key).
 */

import { readFile, writeFile } from 'node:fs/promises';

const SUPABASE_URL = 'https://waibybqjhzddpfhzrisx.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhaWJ5YnFqaHpkZHBmaHpyaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzODg4ODYsImV4cCI6MjA5OTk2NDg4Nn0.zufjm2J4F4mePJhd072hoXh5vLqfXNVuPFEN1BbKs3k';
const SITE = 'https://amirhj2007.github.io/ramouz-website';
const PLACE = 'https://www.google.com/maps/place/?q=place_id:ChIJjeAjZQD_kT4R6l3hc6sXThM';

// ---------- shared render helpers (kept identical to menu-live-2.js) ----------
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
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const bySort = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

async function fetchMenu() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/categories?select=*,sections(*,subsections(*),items(*,variants(*)))`,
    { headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } }
  );
  if (!res.ok) throw new Error(`Supabase fetch failed: HTTP ${res.status}`);
  const cats = await res.json();
  if (!Array.isArray(cats) || !cats.length) throw new Error('Supabase returned no categories');
  return cats;
}

/** Walk the menu once; produce the static accordion HTML, the schema Menu, and counts. */
function build(cats) {
  let accordionHtml = '';
  const menuSections = [];
  const prices = [];
  let itemCount = 0;

  cats.sort(bySort).forEach(cat => {
    const catSlug = CAT_SLUGS[cat.name] || slugify(cat.name);
    (cat.sections || []).sort(bySort).forEach(sec => {
      const secSlug = slugify(sec.name);
      const subNames = new Map((sec.subsections || []).map(s => [s.id, s]));
      const items = (sec.items || []).sort(bySort);
      if (!items.length) return;
      itemCount += items.length;

      // --- static HTML rows (identical template to menu-live-2.js) ---
      let rows = '';
      let lastSub = null;
      const schemaItems = [];
      items.forEach(item => {
        const sub = item.subsection_id != null ? subNames.get(item.subsection_id) : null;
        if (sub && sub.name !== lastSub) {
          rows += `<li class="menu-subhead">${esc(sub.name)}</li>`;
          lastSub = sub.name;
        }
        const img = `<img src="${esc(item.image_url || 'assets/images/logo.webp')}" alt="${esc(item.name)}" width="56" height="56" loading="lazy" onerror="this.remove()">`;
        const thumbCls = item.image_url ? 'mi-thumb' : 'mi-thumb mi-thumb--brand';
        const desc = item.description ? `<p class="mi-desc">${esc(item.description)}</p>` : '';
        const variants = (item.variants || []).sort(bySort);
        const picker = variants.length
          ? `<span class="mi-picker"><select class="mi-select" aria-label="${esc(item.name)} options">${variants.map(v => `<option>${esc(v.name)}</option>`).join('')}</select>${CHEVRON}</span>`
          : '';
        const priceShort = Number(item.price).toFixed(1);
        const unavailable = item.is_available === false;
        const liCls = unavailable ? 'menu-item menu-item--unavail' : 'menu-item';
        const unavailTag = unavailable ? '<span class="mi-tag-unavail">Unavailable</span>' : '';
        rows += `<li class="${liCls}"><span class="${thumbCls}">${THUMB_PH}${img}</span><div class="mi-main"><div class="mi-head"><span class="mi-name">${esc(item.name)}</span>${unavailTag}<span class="mi-dots"></span><span class="mi-price">${priceShort} <span class="mi-cur">OMR</span></span></div>${picker}${desc}</div></li>`;

        // --- schema item (3-decimal OMR offer) ---
        prices.push(Number(item.price));
        const si = { '@type': 'MenuItem', name: item.name };
        if (item.description) si.description = item.description;
        if (item.image_url) si.image = item.image_url;
        si.offers = {
          '@type': 'Offer',
          price: Number(item.price).toFixed(3),
          priceCurrency: 'OMR',
          availability: unavailable ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
        };
        schemaItems.push(si);
      });

      const tintCls = cat.color ? ' has-tint' : '';
      const tintStyle = cat.color ? ` style="--cat-tint:${esc(cat.color)}"` : '';
      accordionHtml +=
        `<div class="menu-accordion-item${tintCls}"${tintStyle} data-cat="${esc(catSlug)}" data-box="${esc(secSlug)}">`
        + `<button type="button" class="menu-accordion-head" aria-expanded="false" aria-controls="acc-${esc(secSlug)}">`
        + `<span class="acc-icon">${sec.icon || THUMB_PH}</span>`
        + `<span class="acc-title">${esc(sec.name)}</span>`
        + `<span class="acc-count">${items.length} item${items.length === 1 ? '' : 's'}</span>`
        + `<span class="acc-chevron" aria-hidden="true">${CHEVRON}</span>`
        + `</button>`
        + `<div class="menu-accordion-body" id="acc-${esc(secSlug)}"><ul class="menu-list menu-list--thumbs">${rows}</ul></div>`
        + `</div>\n`;

      menuSections.push({ '@type': 'MenuSection', name: sec.name, hasMenuItem: schemaItems });
    });
  });

  const min = Math.min(...prices).toFixed(3);
  const max = Math.max(...prices).toFixed(3);
  return { accordionHtml: accordionHtml.trimEnd(), menuSections, itemCount, sectionCount: menuSections.length, priceRange: `OMR ${min} - OMR ${max}` };
}

function buildSchema({ menuSections, priceRange }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: 'Ramouz Café',
    description: 'Specialty coffee roasted in-house, fresh bakery, and desserts on the Muscat waterfront.',
    url: `${SITE}/`,
    image: `${SITE}/assets/images/homw.jpg`,
    logo: `${SITE}/assets/images/logo.png`,
    telephone: '+96878449000',
    servesCuisine: ['Coffee', 'Café', 'Bakery', 'Desserts'],
    priceRange,
    currenciesAccepted: 'OMR',
    address: { '@type': 'PostalAddress', addressLocality: 'Muscat', addressCountry: 'OM' },
    geo: { '@type': 'GeoCoordinates', latitude: 23.6129115, longitude: 58.4536845 },
    sameAs: ['https://instagram.com/ramouz_oman', PLACE],
    hasMap: PLACE,
    subOrganization: {
      '@type': 'EducationalOrganization',
      name: 'Ramouz School',
      description: 'Hands-on barista training on real espresso machines — from your first pour to your first shift behind the bar.',
      url: `${SITE}/#about`,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'], opens: '06:30', closes: '00:30' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '06:30', closes: '01:30' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '08:00', closes: '01:30' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '00:30' },
    ],
    hasMenu: { '@type': 'Menu', name: 'Ramouz Café Menu', hasMenuSection: menuSections },
  };
}

async function main() {
  const cats = await fetchMenu();
  const built = build(cats);
  const schema = buildSchema(built);

  // ---- index.html ----
  let html = await readFile('index.html', 'utf8');

  const menuRe = /(<!-- MENU:START[^>]*-->)[\s\S]*?(<!-- MENU:END -->)/;
  if (!menuRe.test(html)) throw new Error('MENU:START/END markers not found in index.html');
  html = html.replace(menuRe, `$1\n          ${built.accordionHtml}\n          $2`);

  const ldRe = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;
  if (!ldRe.test(html)) throw new Error('JSON-LD block not found in index.html');
  html = html.replace(ldRe, `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n  </script>`);

  // subtitle count: "<N> items, search or filter…"
  html = html.replace(/(<p>)\d+( items, search or filter)/, `$1${built.itemCount}$2`);

  await writeFile('index.html', html);

  // ---- llms.txt count ----
  let llms = await readFile('llms.txt', 'utf8');
  llms = llms.replace(/\d+ items across/, `${built.itemCount} items across`);
  await writeFile('llms.txt', llms);

  console.log(`Built menu: ${built.sectionCount} sections, ${built.itemCount} items | priceRange ${built.priceRange}`);
}

main().catch(err => { console.error(err); process.exit(1); });
