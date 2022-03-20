const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      required: [true, 'rating can not be empty!'],
      min: [1, 'rating has to be greater than 5!'],
      max: [5, 'rating has to be fewer than 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    // parent refrencing
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour!'],
    },
    // parent refrencing
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user!'],
    },
  },
  // the bottom object cuases whenever show up virtuals property whenever we have output
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// to avoiding dublicate review from one user in one tour
// when user try to create a new review, when review goes in to the DB, DB creates index from tour and user field and
// becuase uniqe option is true it makes Error and avoids to dublicating review from an one user be register to a tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// baraye inke ye seri az etela'at marboot be yek collection ro dar yek collection dige zakhire konim be soorat zir amal mikonim,
// masalan avg review ha va tedad review haye sabt shode baraye yek tour ra dar An tour store konim:

// static methods:
// The methodes that aree declared this way (Schema.static.blah) are accessble in model (not Doc | Unlike intance methodes that
// are accessble in doc => Schema.methods.blah)

// we used statics method becuase in static method 'this' points to model and we need model
// while in intance methid 'this' points to Document
reviewSchema.statics.calcAvgAndNumberRating = async function (tourId) {
  // this keyWord points to Model

  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: 0,
      ratingAverage: 4.5,
    });
  }
};
// hala bayad kari konim ke har moghe review save shod
// calcAvg.. call beshe ta avg va tedad review ha be tour marboote ezafe va update beshe
reviewSchema.post('save', function () {
  // 'this' points to current Document
  // and 'this.constructor' points to reviewModel
  // in .post('save') we can't use next keyWord because it is last middleware
  this.constructor.calcAvgAndNumberRating(this.tour);
});

// baraye inke kar bala baraye update va delete shodan review ha ham etefagh biofte bayad az query middleware ha estefade konim
// chon doc middleware (.pre('save')) ha faghat dar .save() va .create() etefagh miofte va ma baray .findOneAndUpdate .findOneAndDelte
// va findByIdAndUpdate .findByIdAndDelete ham mikhahim func .calcAvgAndNumberRating ejra beshe pas az query middleware ha estefade mikonim
// .findByIdAndUpdate va delete mokhafaf hamoon .findOneAndUpdate hastan pas ba /^findOne/ hame ro entekhab mikonim ke da tammam
// halat hay update va delete in query middleWare kar kone

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // 'this' points to current query
  // because we are not able to access review document and we have only just query (this points to query)
  // for get access to current review doc we execute query to get back review doc
  this.r = await this.findOne();
  if (!this.r) {
    return next(new AppError('review is not exist!', 404));
  }
  next();
});
reviewSchema.post(/^findOneAnd/, function () {
  // this points to query
  // this.r points to review Doc which comes from pre middleware
  // this.r.constructor points to reviewModel
  this.r.constructor.calcAvgAndNumberRating(this.r.tour);
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
