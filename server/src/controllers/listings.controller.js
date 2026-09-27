'use strict';
const Listing = require('../models/Listing');
const { z } = require('zod');

const paramsSchema = z.object({
  id: z.coerce.string().min(1),
});

/**
 * GET /api/listings/:id
 * Returns the full listing with joined photos and amenities.
 * Shape matches what the frontend Home.tsx currently renders.
 */
async function getListing(req, res, next) {
  try {
    const { id } = req.params;

    // Search by Mongo _id or numericId for backward compatibility
    let query;
    if (/^\d+$/.test(id)) {
      query = { numericId: parseInt(id, 10) };
    } else {
      query = { _id: id };
    }

    const listingDoc = await Listing.findOne(query);

    if (!listingDoc) {
      const err = new Error('Listing not found.');
      err.statusCode = 404;
      return next(err);
    }

    const listingObj = listingDoc.toObject();
    const photos = (listingObj.photos || []).map((p, idx) => ({
      id: p._id ? p._id.toString() : idx + 1,
      url: p.url,
      room_label: p.room_label,
      caption: p.caption,
      sort_order: p.sort_order,
    }));

    const amenities = (listingObj.amenities || []).map((a, idx) => ({
      id: a._id ? a._id.toString() : idx + 1,
      label: a.label,
      icon_key: a.icon_key,
    }));

    const listing = {
      id: listingObj.numericId || listingObj._id.toString(),
      _id: listingObj._id.toString(),
      title: listingObj.title,
      subtitle: listingObj.subtitle,
      description: listingObj.description,
      property_type: listingObj.property_type,
      location: listingObj.location,
      price_per_night: listingObj.price_per_night,
      guests: listingObj.guests,
      bedrooms: listingObj.bedrooms,
      beds: listingObj.beds,
      baths: listingObj.baths,
      rating: listingObj.rating,
      review_count: listingObj.review_count,
      host_name: listingObj.host_name,
      host_since: listingObj.host_since,
      host_is_superhost: listingObj.host_is_superhost ? 1 : 0,
    };

    res.json({
      listing,
      photos,
      amenities,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getListing, paramsSchema };
