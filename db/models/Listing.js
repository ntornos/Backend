const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: String,
  subTitle: String,
  price: Number,
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
    require: true,
  },
  ameneties: {
    type: Schema.Types.Mixed,
    required: true,
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
});

const Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;
