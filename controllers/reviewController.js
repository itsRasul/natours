const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  // if the route is => /api/v1/reviews we wanna get back All the reviews
  // if the route is => /api/v1/tours/dsf564gs1g/reviews we wanna get back all the reviews related to that tourId
  // so we use filter obj helps us to implement this strategy
  let filter = {};
  if (req.params.tourId) filter = { tour: { _id: req.params.tourId } };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.setTourUserIds = catchAsync(async (req, res, next) => {
  // in this middleWare we set tour and user id to req.body (in case there aren't in req.body)
  // to use it in next middleware

  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
});

exports.deleteMyReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;
  // user wants to delete review (without considering which tour review belongs to)
  const review = await Review.findOneAndDelete({
    _id: reviewId,
    user: { _id: req.user.id },
  });

  if (!review) {
    throw new AppError('review has not found', 404);
  }

  res.status(204).json({
    status: 'success',
    message: 'review has been deleted successfully!',
    data: {
      review,
    },
  });
});

exports.updateMyReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;

  // user wants to update review (without considering which tour review belongs to)
  const review = await Review.findOneAndUpdate(
    { _id: reviewId, user: { _id: req.user.id } },
    { review: req.body.review, rating: req.body.rating },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!review) {
    throw new AppError('review has not found!', 404);
  }

  res.status(200).json({
    status: 'success',
    message: 'review has been updated successfully!',
    data: {
      review,
    },
  });
});

exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
