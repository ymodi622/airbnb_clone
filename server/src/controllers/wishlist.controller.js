'use strict';
const { z } = require('zod');
const pool = require('../db/pool');

const listingIdParamsSchema = z.object({
  listingId: z.coerce.number().int().positive(),
});

/**
 * POST /api/wishlist/:listingId
 * Toggle save/unsave. Requires auth (requireAuth applied in route).
 * Returns { saved: boolean } reflecting the new state.
 */
async function toggleWishlist(req, res, next) {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    // Check if listing exists
    const [listings] = await pool.query(
      'SELECT id FROM listings WHERE id = ?',
      [listingId]
    );
    if (listings.length === 0) {
      const err = new Error('Listing not found.');
      err.statusCode = 404;
      return next(err);
    }

    // Check current wishlist state
    const [existing] = await pool.query(
      'SELECT user_id FROM wishlists WHERE user_id = ? AND listing_id = ?',
      [userId, listingId]
    );

    if (existing.length > 0) {
      // Already saved — unsave
      await pool.query(
        'DELETE FROM wishlists WHERE user_id = ? AND listing_id = ?',
        [userId, listingId]
      );
      return res.json({ saved: false });
    } else {
      // Not saved — save
      await pool.query(
        'INSERT INTO wishlists (user_id, listing_id) VALUES (?, ?)',
        [userId, listingId]
      );
      return res.json({ saved: true });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/wishlist/:listingId/status
 * Returns { saved: boolean }.
 * Uses optionalAuth — if not logged in, returns { saved: false } rather than 401,
 * so the heart icon always renders for logged-out users.
 */
async function getWishlistStatus(req, res, next) {
  try {
    const { listingId } = req.params;

    if (!req.user) {
      return res.json({ saved: false });
    }

    const [rows] = await pool.query(
      'SELECT user_id FROM wishlists WHERE user_id = ? AND listing_id = ?',
      [req.user.id, listingId]
    );

    res.json({ saved: rows.length > 0 });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/wishlist
 * Returns a list of saved listings for the current user.
 * Requires auth.
 */
async function getUserWishlists(req, res, next) {
  try {
    const userId = req.user.id;

    // Fetch listings joined with their first photo for the thumbnail
    const [rows] = await pool.query(`
      SELECT 
        l.id, l.title, l.subtitle, l.property_type, l.location, l.price_per_night,
        (SELECT url FROM listing_photos lp WHERE lp.listing_id = l.id ORDER BY sort_order ASC LIMIT 1) as cover_photo
      FROM listings l
      JOIN wishlists w ON l.id = w.listing_id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `, [userId]);

    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { toggleWishlist, getWishlistStatus, getUserWishlists, listingIdParamsSchema };
