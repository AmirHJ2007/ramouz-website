#!/usr/bin/env node
/**
 * Verifies the menu artifacts agree. Exits non-zero if they don't, so it can
 * gate CI.
 *
 *   node verify_menu.mjs
 *
 * Checks:
 *   1. Every (name, price) in the static <li> menu matches the JSON-LD Menu,
 *      compared as multisets (duplicate names handled), price compared numerically.
 *   2. Item counts agree across static HTML, JSON-LD, and llms.txt.
 *   3. The JSON-LD parses as valid JSON.
 */

import { readFile } from 'node:fs/promises';

const unescape = s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const key = (name, price) => `${name}|${Number(price).toFixed(3)}`;

const html = await readFile('index.html', 'utf8');
const llms = await readFile('llms.txt', 'utf8');

// --- static items ---
const staticItems = [];
for (const m of html.matchAll(/<span class="mi-name">(.*?)<\/span>[\s\S]*?<span class="mi-price">([\d.]+)/g)) {
  staticItems.push([unescape(m[1]), m[2]]);
}

// --- schema items ---
const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (!ld) { console.error('FAIL: JSON-LD block not found'); process.exit(1); }
let schema;
try { schema = JSON.parse(ld[1]); } catch (e) { console.error('FAIL: JSON-LD does not parse:', e.message); process.exit(1); }
const schemaItems = [];
for (const sec of schema.hasMenu?.hasMenuSection || []) {
  for (const it of sec.hasMenuItem || []) schemaItems.push([it.name, it.offers.price]);
}

// --- llms.txt count ---
const llmsCount = Number((llms.match(/(\d+) items across/) || [])[1] || -1);

// --- compare multisets ---
const sBag = new Map();
staticItems.forEach(([n, p]) => sBag.set(key(n, p), (sBag.get(key(n, p)) || 0) + 1));
const jBag = new Map();
schemaItems.forEach(([n, p]) => jBag.set(key(n, p), (jBag.get(key(n, p)) || 0) + 1));

const problems = [];
for (const [k, c] of sBag) if ((jBag.get(k) || 0) !== c) problems.push(`in static HTML but not (equally) in schema: ${k}`);
for (const [k, c] of jBag) if ((sBag.get(k) || 0) !== c) problems.push(`in schema but not (equally) in static HTML: ${k}`);

console.log(`static items: ${staticItems.length} | schema items: ${schemaItems.length} | llms.txt: ${llmsCount}`);

let ok = true;
if (problems.length) { ok = false; console.error('\nMISMATCHES:'); problems.forEach(p => console.error('  - ' + p)); }
if (!(staticItems.length === schemaItems.length && schemaItems.length === llmsCount)) {
  ok = false; console.error(`\nCOUNT MISMATCH: static=${staticItems.length}, schema=${schemaItems.length}, llms=${llmsCount}`);
}

if (ok) { console.log('\n✓ All checks passed: static HTML, JSON-LD, and llms.txt agree.'); process.exit(0); }
else { console.error('\n✗ Verification failed.'); process.exit(1); }
