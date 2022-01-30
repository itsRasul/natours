const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'The tour must have a name'],
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    require: [true, 'The tour must have a price'],
  },
  priceDiscount: Number,
  duration: {
    type: Number,
    require: [true, 'The tour must have a duration'],
  },
  summary: {
    type: String,
    trim: true,
    require: [true, 'The tour must have summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  imageCover: {
    type: String,
    require: [true, 'The tour must have a imageCover'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  maxGroupSize: Number,
  difficulty: {
    type: String,
    require: [true, 'The tour must have a difficulty'],
  },
  startDates: [String],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
