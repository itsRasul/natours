const catchAsync = require('../utils/catchAsync');
const Book = require('../models/bookingModel');
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
    throw new AppError(
      'review has not found, or you are not who has written this review',
      404
    );
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

exports.deleteAllReviews = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const reviews = await Review.deleteMany({ tour: tourId });

  if (!reviews) {
    throw new AppError('there is no review on this tour!', 404);
  }
  res.status(204).json({
    status: 'success',
    message: 'all the review on this tour has been deleted successfully!',
    data: {
      reviews,
    },
  });
});
exports.createReview = catchAsync(async (req, res) => {
  // before creating review, check if user booked the tour that want to send a review
  const booking = await Book.findOne({
    user: req.user.id,
    tour: req.body.tour,
  });
  if (booking) {
    // user booked this tour, so he can review on it
    const review = await Review.create(req.body);
    res.status(200).json({
      status: 'success',
      message: 'your review has been submitted successfully!',
      data: {
        data: review,
      },
    });
  } else {
    // user has not booked this tour, so he can't review on it
    res.status(403).json({
      status: 'fail',
      message: "you can't give a review on a tour which you have not booked!",
    });
  }
});

exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
