'use strict';
const { Router } = require('express');
const {
  toggleWishlist,
  getWishlistStatus,
  getUserWishlists,
  listingIdParamsSchema,
} = require('../controllers/wishlist.controller');
const validate = require('../middleware/validate');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = Router();

// Get all wishlists for current user
router.get('/', requireAuth, getUserWishlists);

// Toggle save/unsave — must be logged in
router.post('/:listingId', requireAuth, validate({ params: listingIdParamsSchema }), toggleWishlist);

// Status check — returns false (not 401) for logged-out users
router.get('/:listingId/status', optionalAuth, validate({ params: listingIdParamsSchema }), getWishlistStatus);

module.exports = router;
