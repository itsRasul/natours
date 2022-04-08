const mongoose = require('mongoose');
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

likeSchema.pre(/^findOne/, function () {
  this.populate({
    path: 'tour',
    select: { name: 1 },
  }).populate({
    path: 'user',
    select: 'name photo',
  });
});

// this func is accessble in model
likeSchema.statics.addOneLikeToTourInLikesQuantityField = async function (
  tourId,
  operator
) {
  let tour;
  // this points to model
  if (operator === 'plus') {
    tour = await Tour.findOneAndUpdate(
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
    tour = await Tour.findOneAndUpdate(
      { _id: tourId },
      {
        $inc: { likesQuantity: -1 },
      },
      {
        new: true,
      }
    );
  }

  console.log(tour);
};

// we wanna every time a like is submited increase likesQuantity field in that tour, this middleware fun execute in .save() and .create()
likeSchema.pre('save', function (next) {
  // this points to current doc
  this.constructor.addOneLikeToTourInLikesQuantityField(this.tour, 'plus');
  next();
});
// we wanna execute addOneLikeToTour... function when a like has been deleted, this middleware func execute in .findOneAndDelete() and...
likeSchema.pre(/^findOneAnd/, async function (next) {
  // this points to query
  const likeDoc = await this.findOne();

  likeDoc.constructor.addOneLikeToTourInLikesQuantityField(
    likeDoc.tour,
    'minus'
  );
  next();
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
