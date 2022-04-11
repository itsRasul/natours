const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const Tour = require('./tourModel');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'like must belongs to a user!'],
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'like must belongs to a tour!'],
  },
});

likeSchema.index({ user: 1, tour: 1 }, { unique: true });

likeSchema.pre(/^findOne/, function (next) {
  this.populate({
    path: 'tour',
    select: { name: 1 },
  }).populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// this func is accessble in model
likeSchema.statics.addOneLikeToTourInLikesQuantityField = async function (
  tourId,
  operator
) {
  // this points to model
  if (operator === 'plus') {
    await Tour.findOneAndUpdate(
      { _id: tourId },
      {
        //$inc stands for increment
        $inc: { likesQuantity: 1 },
      },
      {
        new: true,
      }
    );
  } else {
    await Tour.findOneAndUpdate(
      { _id: tourId },
      {
        $inc: { likesQuantity: -1 },
      },
      {
        new: true,
      }
    );
  }
};

// we wanna every time a like is submited increase likesQuantity field in that tour, this middleware fun execute in .save() and .create()
likeSchema.post('save', function () {
  // this points to current doc
  this.constructor.addOneLikeToTourInLikesQuantityField(this.tour, 'plus');
});
// we wanna execute addOneLikeToTour... function when a like has been deleted, this middleware func execute in .findOneAndDelete() and...
likeSchema.pre(/^findOneAnd/, async function (next) {
  // this points to query
  this.likeDoc = await this.findOne();
  if (!this.likeDoc)
    return next(new AppError('there is no like on this tour by you!!', 404));
  next();
});

likeSchema.post(/^findOneAnd/, function () {
  this.likeDoc.constructor.addOneLikeToTourInLikesQuantityField(
    this.likeDoc.tour,
    'minus'
  );
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
