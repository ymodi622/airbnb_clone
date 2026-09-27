'use strict';
const { z } = require('zod');
const Listing = require('../models/Listing');
const Wishlist = require('../models/Wishlist');

const listingIdParamsSchema = z.object({
  listingId: z.coerce.string().min(1),
});

/** Helper to resolve a listing by numericId or MongoDB _id */
async function findListingById(listingId) {
  if (/^\d+$/.test(listingId)) {
    return await Listing.findOne({ numericId: parseInt(listingId, 10) });
  }
  return await Listing.findById(listingId);
}

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
    const listing = await findListingById(listingId);
    if (!listing) {
      const err = new Error('Listing not found.');
      err.statusCode = 404;
      return next(err);
    }

    // Check current wishlist state
    const existing = await Wishlist.findOne({ user: userId, listing: listing._id });

    if (existing) {
      // Already saved — unsave
      await Wishlist.deleteOne({ _id: existing._id });
      return res.json({ saved: false });
    } else {
      // Not saved — save
      await Wishlist.create({ user: userId, listing: listing._id });
      return res.json({ saved: true });
    }
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/wishlist/:listingId/status
 * Returns { saved: boolean }.
 * Uses optionalAuth — if not logged in, returns { saved: false } rather than 401.
 */
async function getWishlistStatus(req, res, next) {
  try {
    const { listingId } = req.params;

    if (!req.user) {
      return res.json({ saved: false });
    }

    const listing = await findListingById(listingId);
    if (!listing) {
      return res.json({ saved: false });
    }

    const existing = await Wishlist.findOne({ user: req.user.id, listing: listing._id });
    res.json({ saved: !!existing });
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

    // Fetch wishlists with populated listing details
    const wishlists = await Wishlist.find({ user: userId })
      .populate('listing')
      .sort({ createdAt: -1 });

    const rows = wishlists
      .map((w) => {
        const l = w.listing;
        if (!l) return null;
        const cover_photo = l.photos && l.photos.length > 0 ? l.photos[0].url : null;
        return {
          id: l.numericId || l._id.toString(),
          _id: l._id.toString(),
          title: l.title,
          subtitle: l.subtitle,
          property_type: l.property_type,
          location: l.location,
          price_per_night: l.price_per_night,
          cover_photo,
        };
      })
      .filter(Boolean);

    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  toggleWishlist,
  getWishlistStatus,
  getUserWishlists,
  listingIdParamsSchema,
};
