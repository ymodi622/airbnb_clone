#!/usr/bin/env node
/**
 * seed-photos.js
 * ──────────────
 * Reads image_map.json and seeds/upserts each photo entry into the
 * listing_photos table.
 *
 * Usage:
 *   node scripts/seed-photos.js                     # full seed
 *   node scripts/seed-photos.js --map ./image_map.json
 *   node scripts/seed-photos.js --dry-run           # preview without DB writes
 *   node scripts/seed-photos.js --clear 1           # delete photos for listing 1 first, then insert
 *   node scripts/seed-photos.js --listing 1         # only process listing_id=1
 *
 * Flags:
 *   --map <path>    Path to the JSON mapping file  (default: ./image_map.json)
 *   --dry-run       Print what would be inserted without touching the DB
 *   --clear <id>    Delete existing photos for listing <id> before inserting
 *   --listing <id>  Filter entries to this listing_id only
 */

'use strict';

require('dotenv').config();
const path  = require('path');
const fs    = require('fs');
const mysql = require('mysql2/promise');

// ─── CLI flags ───────────────────────────────────────────────────────────────
const args     = process.argv.slice(2);
const flag     = (n) => { const i = args.indexOf(n); return i !== -1 ? args[i + 1] : null; };
const hasFlag  = (n) => args.includes(n);

const mapFile   = flag('--map')     ?? path.join(__dirname, '..', 'image_map.json');
const dryRun    = hasFlag('--dry-run');
const clearId   = flag('--clear')   ? parseInt(flag('--clear'),   10) : null;
const filterLid = flag('--listing') ? parseInt(flag('--listing'), 10) : null;

// ─── Load mapping file ───────────────────────────────────────────────────────
if (!fs.existsSync(mapFile)) {
  console.error(`❌  Map file not found: ${mapFile}`);
  process.exit(1);
}

let photoMap;
try {
  photoMap = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
} catch (e) {
  console.error(`❌  Failed to parse JSON: ${e.message}`);
  process.exit(1);
}

if (!Array.isArray(photoMap.photos) || photoMap.photos.length === 0) {
  console.error('❌  image_map.json must contain a non-empty "photos" array.');
  process.exit(1);
}

let photos = photoMap.photos;
if (filterLid) {
  photos = photos.filter(p => p.listing_id === filterLid);
  console.log(`🔍  Filtering to listing_id=${filterLid} → ${photos.length} photo(s)`);
}

// ─── Validate entries ────────────────────────────────────────────────────────
const VALID_LABELS = new Set(['Living room', 'Bedroom', 'Kitchen', 'Bathroom', 'Pool', 'Gym', 'Exterior', 'Other']);
let hasErrors = false;
photos.forEach((p, i) => {
  const errs = [];
  if (!Number.isInteger(p.listing_id) || p.listing_id < 1)  errs.push('listing_id must be a positive integer');
  if (!p.url || typeof p.url !== 'string')                   errs.push('url must be a non-empty string');
  if (!VALID_LABELS.has(p.room_label))                       errs.push(`room_label must be one of: ${[...VALID_LABELS].join(', ')}`);
  if (!Number.isInteger(p.sort_order))                       errs.push('sort_order must be an integer');
  if (errs.length) { console.error(`❌  Entry #${i} (${p.url ?? '?'}): ${errs.join('; ')}`); hasErrors = true; }
});
if (hasErrors) process.exit(1);

// ─── Main ────────────────────────────────────────────────────────────────────
async function run() {
  if (dryRun) {
    console.log('\n📋  DRY-RUN — no DB changes will be made\n');
    photos.forEach(p => {
      console.log(`  ▸ listing_id=${p.listing_id} | sort=${String(p.sort_order).padStart(2)} | [${p.room_label.padEnd(12)}] | ${p.url}`);
      if (p.caption) console.log(`      caption: "${p.caption}"`);
    });
    console.log(`\n✅  ${photos.length} photo(s) would be processed.`);
    return;
  }

  let conn;
  try {
    conn = await mysql.createConnection({
      host:     process.env.DB_HOST     ?? 'localhost',
      port:     parseInt(process.env.DB_PORT ?? '3306', 10),
      user:     process.env.DB_USER     ?? 'airbnb_app',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME     ?? 'airbnb_db',
      timezone: '+00:00',
      multipleStatements: false,
    });
    console.log(`✅  Connected to MySQL → ${process.env.DB_NAME}`);
  } catch (e) {
    console.error(`❌  DB connection failed: ${e.message}`);
    console.error('    Check server/.env and make sure MySQL is running.');
    process.exit(1);
  }

  try {
    // 1. Optional clear
    if (clearId !== null) {
      const [result] = await conn.execute(
        'DELETE FROM listing_photos WHERE listing_id = ?', [clearId]
      );
      console.log(`🗑   Cleared ${result.affectedRows} existing photo(s) for listing_id=${clearId}`);
    }

    // 2. Check if (listing_id, url) unique index exists — use INSERT IGNORE if not
    let hasUniqueIdx = false;
    try {
      const [rows] = await conn.execute(`
        SELECT COUNT(*) AS cnt
        FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'listing_photos'
          AND INDEX_NAME = 'uq_listing_url'
      `, [process.env.DB_NAME ?? 'airbnb_db']);
      hasUniqueIdx = rows[0].cnt > 0;
    } catch (_) { /* ignore */ }

    let inserted = 0, skipped = 0;

    for (const photo of photos) {
      const values = [photo.listing_id, photo.url, photo.room_label, photo.caption ?? null, photo.sort_order];

      if (hasUniqueIdx) {
        // Safe upsert — update caption/label/order if URL already exists for listing
        const [r] = await conn.execute(`
          INSERT INTO listing_photos (listing_id, url, room_label, caption, sort_order)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            room_label = VALUES(room_label),
            caption    = VALUES(caption),
            sort_order = VALUES(sort_order)
        `, values);
        if (r.affectedRows >= 1) inserted++;
      } else {
        // Check if this (listing_id, url) combo already exists
        const [existing] = await conn.execute(
          'SELECT id FROM listing_photos WHERE listing_id = ? AND url = ? LIMIT 1',
          [photo.listing_id, photo.url]
        );
        if (existing.length > 0) {
          // Update existing row
          await conn.execute(
            'UPDATE listing_photos SET room_label=?, caption=?, sort_order=? WHERE listing_id=? AND url=?',
            [photo.room_label, photo.caption ?? null, photo.sort_order, photo.listing_id, photo.url]
          );
          skipped++;
        } else {
          await conn.execute(
            'INSERT INTO listing_photos (listing_id, url, room_label, caption, sort_order) VALUES (?, ?, ?, ?, ?)',
            values
          );
          inserted++;
        }
      }
    }

    console.log(`\n🎉  Done!`);
    console.log(`   ▸ Inserted : ${inserted}`);
    console.log(`   ▸ Updated  : ${skipped}`);
    console.log(`   ▸ Total    : ${photos.length}`);

  } finally {
    await conn.end();
  }
}

run().catch(err => {
  console.error('❌  Unexpected error:', err.message);
  process.exit(1);
});
