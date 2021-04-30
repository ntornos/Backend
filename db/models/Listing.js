const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  // subTitle: String,
  price: {
    type: Number,
    required: false,
    default: 0,
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
});

const Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;
