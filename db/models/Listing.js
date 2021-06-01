const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  // subTitle: String,
  rentPrice: {
    type: String,
    required: false,
  },
  salePrice: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
    default: '',
  },
  images: {
    type: Array,
    required: false,
    default: [''],
  },
  userId: {
    type: String,
    required: true,
  },
  bedrooms: {
    type: String,
    required: false,
  },
  bathrooms: {
    type: String,
    required: false,
  },
  ameneties: {
    type: Schema.Types.Mixed,
    required: true,
    default: {},
  },
  archived: {
    type: Boolean,
    required: false,
    default: false,
  },
  status: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  squareFoot: {
    type: String,
    required: false,
  },
  depositAmount: {
    type: String,
    required: false,
  },
  leaseLength: {
    type: String,
    required: false,
  },
  mapImg: {
    type: String,
    required: false,
  },
});

const Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;
