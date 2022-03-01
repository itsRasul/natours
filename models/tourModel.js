const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'The tour must have a name'],
      unique: true,
      trim: true,
      minlength: [10, 'the Tour name must has above 10 charector.'],
      maxlength: [50, 'the Tour name must has below 50 charctor.'],
      // // third party validator
      // validate: {
      //   validator: validator.isAlpha,
      //   message:
      //     'the name field must be only letter (not numbers or even spaces)',
      // },
    },
    slug: String,
    price: {
      type: Number,
      required: [true, 'The tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // custome validator
        validator: function (val) {
          // this keyWord points to current document
          // this keyWord just points to current document so => this validator just work in .create(), NOT .update()
          return val < this.price;
        },
        message: `priceDiscount {VALUE} should be less than ${this.price} field.`,
      },
    },
    duration: {
      type: Number,
      required: [true, 'The tour must have a duration'],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'The tour must have summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'The rating field must be above 1.0'],
      max: [5, 'The rating field must be below 5.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    imageCover: {
      type: String,
      required: [true, 'The tour must have a imageCover'],
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
      required: [true, 'The tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'The difficulty field must be between [easy, medium, difficult]',
      },
    },
    startDates: [String],
    secret: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return (this.duration / 7).toFixed(2) * 1;
});

// DOCUMENT MIDDLEWARES (THEY JUST WORK ON .SAVE & .CREATE METHOD | DON'T WORK ON .UPDATE .DELETE etc.)
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

// QUERY MIDDLEWARES
// IF EVENT BE JUST 'FIND', IT WOULD WORKS JUST FOR QUERY.FIND() METHOD (NOT .FINDONE() METHOD),
// BUT WE USE REGEX TO SOLVE THIS PROBLME, BY THIS REGEX (/^FIND/) THE EVENT HANDLER(I MEAN QUERY MIDDLEWARE)
// ACCEPTS ALL THE METHODS ABOUT QUERY LIKE .FIND & .FINDONE AND etc
tourSchema.pre(/^find/, function (next) {
  this.find({ secret: { $ne: true } });
  next();
});
// WE COULD JUST WRITE 'FIND' INSTEAD OF /^FIND/ REGEX
// BUT IN THAT CASE WE ALSO NEED TO DEFINE ANOTHER MIDDLEWARE
// THAT TRIGGERS WHEN .FINDONE() METHOD IS CALLED, FOR EXAMPLE:
// tourSchema.pre('findone', (next) => {
//   // do a work
//   next();
// });

// AGREGGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  // this points to aggregate obj
  // this.pipeline() points to aggregate array that we wrote[{$match:...},{},...]
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
