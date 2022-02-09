const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'The tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return (this.duration / 7).toFixed(2) * 1;
});

// DOCUMENT MIDDLEWARES (THEY JUST WORK ON .SAVE & .CREATE METHOD | DON'T WORK AT .UPDATE .DELETE etc.)
// PRE MIDDLEWARE
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', (next) => {
//   console.log('saveit soon...');
//   next();
// });
// AFTER MIDDLEWARE
// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
