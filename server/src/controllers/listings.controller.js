'use strict';
const pool = require('../db/pool');
const { z } = require('zod');

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * GET /api/listings/:id
 * Returns the full listing with joined photos and amenities.
 * Shape matches what the frontend Home.tsx currently renders.
 */
async function getListing(req, res, next) {
  try {
    // 1. Validate params (already done by middleware, but re-binding for clarity)
    const { id } = req.params;

    // 2. Fetch listing
    const [listings] = await pool.query(
      'SELECT id, title, subtitle, description, property_type, location, price_per_night, guests, bedrooms, beds, baths, rating, review_count, host_name, host_since, host_is_superhost FROM listings WHERE id = ?',
      [id]
    );

    if (listings.length === 0) {
      const err = new Error('Listing not found.');
      err.statusCode = 404;
      return next(err);
    }

    const listing = listings[0];

    // 3. Fetch photos
    const [photos] = await pool.query(
      'SELECT id, url, room_label, caption, sort_order FROM listing_photos WHERE listing_id = ? ORDER BY sort_order ASC',
      [id]
    );

    // 4. Fetch amenities
    const [amenities] = await pool.query(
      'SELECT id, label, icon_key FROM amenities WHERE listing_id = ? ORDER BY id ASC',
      [id]
    );

    res.json({
      listing: {
        ...listing,
        price_per_night: parseFloat(listing.price_per_night),
      },
      photos,
      amenities,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getListing, paramsSchema };
