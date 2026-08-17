#!/usr/bin/env node
/**
 * Generates the Schema.org JSON-LD for the site (CafeOrCoffeeShop + full Menu)
 * from the live Supabase data, and writes it into the <script type="application/ld+json">
 * block in index.html. Re-run this whenever the menu changes so the structured
 * data can't drift from what visitors actually see.
 *
 *   node generate_menu_schema.mjs
 *
 * Read-only against Supabase (uses the public anon key already in the site).
 */

import { readFile, writeFile } from 'node:fs/promises';

const SUPABASE_URL = 'https://waibybqjhzddpfhzrisx.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhaWJ5YnFqaHpkZHBmaHpyaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzODg4ODYsImV4cCI6MjA5OTk2NDg4Nn0.zufjm2J4F4mePJhd072hoXh5vLqfXNVuPFEN1BbKs3k';
const SITE = 'https://amirhj2007.github.io/ramouz-website';
const HTML_FILE = 'index.html';

// ---- business facts (single source of truth for the LocalBusiness schema) ----
const business = {
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  name: 'Ramouz Café',
  description: 'Specialty coffee roasted in-house, fresh bakery, and desserts on the Muscat waterfront.',
  url: `${SITE}/`,
  image: `${SITE}/assets/images/homw.jpg`,
  logo: `${SITE}/assets/images/logo.png`,
  telephone: '+96878449000',
  servesCuisine: ['Coffee', 'Café', 'Bakery', 'Desserts'],
  priceRange: '$$',
  currenciesAccepted: 'OMR',
  address: { '@type': 'PostalAddress', addressLocality: 'Muscat', addressCountry: 'OM' },
  geo: { '@type': 'GeoCoordinates', latitude: 23.6129115, longitude: 58.4536845 },
  sameAs: [
    'https://instagram.com/ramouz_oman',
    'https://www.google.com/maps/place/?q=place_id:ChIJjeAjZQD_kT4R6l3hc6sXThM',
  ],
  hasMap: 'https://www.google.com/maps/place/?q=place_id:ChIJjeAjZQD_kT4R6l3hc6sXThM',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'], opens: '06:30', closes: '00:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '06:30', closes: '01:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '08:00', closes: '01:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '00:30' },
  ],
};

const bySort = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

async function fetchMenu() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/categories?select=name,sort_order,sections(name,sort_order,items(name,description,price,image_url,is_available,sort_order))`,
    { headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } }
  );
  if (!res.ok) throw new Error(`Supabase fetch failed: HTTP ${res.status}`);
  return res.json();
}

function buildMenu(cats) {
  const sections = [];
  let itemCount = 0;
  cats.sort(bySort).forEach(cat => {
    (cat.sections || []).sort(bySort).forEach(sec => {
      const items = (sec.items || []).sort(bySort);
      if (!items.length) return;
      sections.push({
        '@type': 'MenuSection',
        name: sec.name,
        hasMenuItem: items.map(it => {
          const item = { '@type': 'MenuItem', name: it.name };
          if (it.description) item.description = it.description;
          if (it.image_url) item.image = it.image_url;
          item.offers = {
            '@type': 'Offer',
            price: Number(it.price).toFixed(3),
            priceCurrency: 'OMR',
            availability: it.is_available === false
              ? 'https://schema.org/OutOfStock'
              : 'https://schema.org/InStock',
          };
          itemCount++;
          return item;
        }),
      });
    });
  });
  return { menu: { '@type': 'Menu', name: 'Ramouz Café Menu', hasMenuSection: sections }, sections: sections.length, items: itemCount };
}

async function main() {
  const cats = await fetchMenu();
  const { menu, sections, items } = buildMenu(cats);
  const schema = { ...business, hasMenu: menu };
  const json = JSON.stringify(schema, null, 2);

  let html = await readFile(HTML_FILE, 'utf8');
  const block = `<script type="application/ld+json">\n${json}\n  </script>`;
  const re = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;
  if (!re.test(html)) throw new Error('Could not find the JSON-LD <script> block in index.html');
  html = html.replace(re, block);
  await writeFile(HTML_FILE, html);

  console.log(`Wrote menu schema: ${sections} sections, ${items} items (three-decimal OMR offers).`);
}

main().catch(err => { console.error(err); process.exit(1); });
