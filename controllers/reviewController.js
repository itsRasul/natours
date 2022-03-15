const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
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

exports.getReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.find({ _id: id });

  if (!review) {
    throw new AppError('review has not found!', 404);
  }

  res.status(200).json({
    status: 'success',
    review,
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    review: newReview,
  });
});
