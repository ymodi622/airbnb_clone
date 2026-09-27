'use strict';
const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  room_label: { type: String },
  caption: { type: String },
  sort_order: { type: Number, default: 0 },
});

const amenitySchema = new mongoose.Schema({
  label: { type: String, required: true },
  icon_key: { type: String },
});

const listingSchema = new mongoose.Schema(
  {
    numericId: { type: Number, index: true }, // For backward compatibility with numeric IDs
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    property_type: { type: String },
    location: { type: String },
    price_per_night: { type: Number, required: true, default: 0 },
    guests: { type: Number, default: 1 },
    bedrooms: { type: Number, default: 1 },
    beds: { type: Number, default: 1 },
    baths: { type: Number, default: 1 },
    rating: { type: Number, default: 0 },
    review_count: { type: Number, default: 0 },
    host_name: { type: String },
    host_since: { type: Number },
    host_is_superhost: { type: Boolean, default: false },
    photos: [photoSchema],
    amenities: [amenitySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Listing', listingSchema);
