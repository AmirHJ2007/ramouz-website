#!/usr/bin/env python3
"""Upload all menu images to Supabase Storage and point supabase-seed.sql at them.

Usage:
  SUPABASE_URL=https://xxxx.supabase.co \
  SUPABASE_SERVICE_KEY=eyJ... \
  python3 upload_images.py

Requires a public Storage bucket named "menu-images" (create it in the
Supabase dashboard: Storage -> New bucket -> name: menu-images, Public).
"""
import json, mimetypes, os, re, sys, urllib.parse, urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
BUCKET = "menu-images"

url = os.environ.get("SUPABASE_URL", "").rstrip("/")
key = os.environ.get("SUPABASE_SERVICE_KEY", "")
if not url or not key:
    sys.exit("Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables first.")

data = json.loads(open(os.path.join(BASE, "assets/js/menu-data.js")).read()
                  .partition("=")[2].rstrip().rstrip(";"))

# unique image paths, URL-decoded to find the real files on disk
imgs = []
for cat in data:
    for sec in cat["sections"]:
        for item in sec["items"]:
            if item["img"] and item["img"] not in imgs:
                imgs.append(item["img"])

print(f"{len(imgs)} images to upload to bucket '{BUCKET}'\n")

url_map = {}   # old relative path -> new public URL
failed = []
for rel in imgs:
    disk = os.path.join(BASE, urllib.parse.unquote(rel))
    if not os.path.exists(disk):
        print(f"  MISSING on disk: {disk}")
        failed.append(rel)
        continue
    # storage key: path under assets/menu/, keep folder structure
    key_path = urllib.parse.unquote(rel).replace("assets/menu/", "", 1)
    enc_key = urllib.parse.quote(key_path)
    endpoint = f"{url}/storage/v1/object/{BUCKET}/{enc_key}"
    body = open(disk, "rb").read()
    ctype = mimetypes.guess_type(disk)[0] or "application/octet-stream"
    req = urllib.request.Request(endpoint, data=body, method="POST", headers={
        "Authorization": f"Bearer {key}",
        "Content-Type": ctype,
        "x-upsert": "true",
    })
    try:
        with urllib.request.urlopen(req) as r:
            r.read()
        url_map[rel] = f"{url}/storage/v1/object/public/{BUCKET}/{enc_key}"
        print(f"  ok  {key_path}")
    except urllib.error.HTTPError as e:
        print(f"  FAIL {key_path}: {e.code} {e.read().decode()[:200]}")
        failed.append(rel)

if failed:
    sys.exit(f"\n{len(failed)} uploads failed — fix these before running the seed.")

# rewrite the seed file to use the public storage URLs
seed_path = os.path.join(BASE, "supabase-seed.sql")
seed = open(seed_path).read()
for rel, pub in url_map.items():
    seed = seed.replace(f"'{rel}'", f"'{pub}'")
open(seed_path, "w").write(seed)
print(f"\nAll {len(url_map)} images uploaded.")
print("supabase-seed.sql now points at Supabase Storage URLs — paste it into the SQL editor.")
