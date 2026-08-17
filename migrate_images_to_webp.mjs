#!/usr/bin/env node
/**
 * One-time migration: convert existing Supabase menu photos from JPEG to WebP.
 *
 * For every item whose image_url points at a .jpg/.jpeg in the menu-images
 * bucket, this will:
 *   1. download the JPEG
 *   2. convert it to WebP (via the `cwebp` CLI)
 *   3. upload the .webp to Supabase Storage
 *   4. update items.image_url in the database to the new .webp URL
 *
 * The original .jpg is LEFT in storage (safe rollback) unless you pass --delete-old.
 *
 * Requirements: Node 18+, and `cwebp` installed (brew install webp).
 *
 * WRITE ACCESS: this needs permission to upload files and update the database.
 * Two ways to provide it:
 *   (a) Temporarily disable RLS in the Supabase SQL editor, then the built-in
 *       anon key below is enough (no secret to set). Re-enable RLS afterwards:
 *         alter table items disable row level security;
 *         alter table storage.objects disable row level security;
 *         -- ...run migration...
 *         alter table items enable row level security;
 *         alter table storage.objects enable row level security;
 *   (b) Keep RLS on and export a write-capable key instead:
 *         export SUPABASE_KEY="eyJ...service_role key..."
 *
 * Usage:
 *   node migrate_images_to_webp.mjs --dry-run     # preview, changes nothing
 *   node migrate_images_to_webp.mjs               # do it (keeps old .jpg files)
 *   node migrate_images_to_webp.mjs --delete-old  # also delete the old .jpg files
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { writeFile, readFile, unlink, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const execFileP = promisify(execFile);

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://waibybqjhzddpfhzrisx.supabase.co';
// Same public anon key the site uses. With RLS temporarily disabled this is
// enough to write; otherwise export SUPABASE_KEY with a write-capable key.
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhaWJ5YnFqaHpkZHBmaHpyaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzODg4ODYsImV4cCI6MjA5OTk2NDg4Nn0.zufjm2J4F4mePJhd072hoXh5vLqfXNVuPFEN1BbKs3k';
const KEY = process.env.SUPABASE_KEY || ANON_KEY;
const BUCKET = 'menu-images';
const QUALITY = 82;

const DRY_RUN = process.argv.includes('--dry-run');
const DELETE_OLD = process.argv.includes('--delete-old');

const PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;

const authHeaders = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
};

async function getItems() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/items?select=id,name,image_url`, {
    headers: authHeaders,
  });
  if (!res.ok) throw new Error(`Fetch items failed: HTTP ${res.status} ${await res.text()}`);
  return res.json();
}

function needsConversion(url) {
  return typeof url === 'string'
    && url.startsWith(PUBLIC_PREFIX)
    && /\.jpe?g($|\?)/i.test(url);
}

async function convertToWebp(jpgBuffer, tmp) {
  const inPath = join(tmp, 'in.jpg');
  const outPath = join(tmp, 'out.webp');
  await writeFile(inPath, jpgBuffer);
  await execFileP('cwebp', ['-q', String(QUALITY), inPath, '-o', outPath]);
  const webp = await readFile(outPath);
  await unlink(inPath).catch(() => {});
  await unlink(outPath).catch(() => {});
  return webp;
}

async function uploadWebp(key, webpBuffer) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${key}`, {
    method: 'POST',
    headers: { ...authHeaders, 'Content-Type': 'image/webp', 'x-upsert': 'true' },
    body: webpBuffer,
  });
  if (!res.ok) throw new Error(`Upload failed: HTTP ${res.status} ${await res.text()}`);
}

async function updateItem(id, newUrl) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/items?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...authHeaders, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ image_url: newUrl }),
  });
  if (!res.ok) throw new Error(`DB update failed: HTTP ${res.status} ${await res.text()}`);
}

async function deleteOld(key) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${key}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  if (!res.ok) console.warn(`  (warning) could not delete old file: HTTP ${res.status}`);
}

async function main() {
  console.log(`Supabase: ${SUPABASE_URL}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}${DELETE_OLD ? ' + delete old .jpg' : ''}\n`);

  const items = await getItems();
  const targets = items.filter(i => needsConversion(i.image_url));
  console.log(`${items.length} items total, ${targets.length} JPEG photos to convert.\n`);
  if (!targets.length) return;

  const tmp = await mkdtemp(join(tmpdir(), 'webp-mig-'));
  let ok = 0, fail = 0, savedJpg = 0, savedWebp = 0;

  for (const item of targets) {
    const oldKey = decodeURIComponent(item.image_url.slice(PUBLIC_PREFIX.length).split('?')[0]);
    const newKey = oldKey.replace(/\.jpe?g$/i, '.webp');
    const newUrl = `${PUBLIC_PREFIX}${newKey.split('/').map(encodeURIComponent).join('/')}`;
    const label = item.name || item.id;

    try {
      const jpgRes = await fetch(item.image_url);
      if (!jpgRes.ok) throw new Error(`download HTTP ${jpgRes.status}`);
      const jpgBuf = Buffer.from(await jpgRes.arrayBuffer());
      const webpBuf = await convertToWebp(jpgBuf, tmp);
      savedJpg += jpgBuf.length; savedWebp += webpBuf.length;

      const pct = Math.round((1 - webpBuf.length / jpgBuf.length) * 100);
      console.log(`• ${label}: ${(jpgBuf.length/1024|0)}KB -> ${(webpBuf.length/1024|0)}KB (-${pct}%)`);

      if (!DRY_RUN) {
        await uploadWebp(newKey, webpBuf);
        await updateItem(item.id, newUrl);
        if (DELETE_OLD) await deleteOld(oldKey);
      }
      ok++;
    } catch (err) {
      console.error(`✗ ${label}: ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone. Converted ${ok}, failed ${fail}.`);
  console.log(`Total: ${(savedJpg/1024/1024).toFixed(2)}MB JPEG -> ${(savedWebp/1024/1024).toFixed(2)}MB WebP`);
  if (DRY_RUN) console.log('(dry run — nothing was uploaded or changed)');
}

main().catch(err => { console.error(err); process.exit(1); });
