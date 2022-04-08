const APIFeature = require('../utils/APIFeature');
const Like = require('../models/likeModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createLike = catchAsync(async (req, res) => {
  const { tour } = req.body;
  const like = await Like.create({ tour, user: req.user.id });

  res.status(200).json({
    status: 'success',
    data: {
      like,
    },
  });
});

exports.deleteMyLike = catchAsync(async (req, res, next) => {
  const like = await Like.findOneAndDelete({
    user: req.user.id,
    tour: req.params.tourId,
  });

  if (!like) throw new AppError('there is no like in this tour by you!', 404);

  res.status(204).json({
    status: 'success',
    message: 'like deleted successfully!',
    data: {
      like,
    },
  });
});

exports.getAllLikes = catchAsync(async (req, res, next) => {
  // if the route is => /api/v1/likes we wanna get back All the reviews
  // if the route is => /api/v1/tours/dsf564gs1g/likes we wanna get back all the reviews related to that tourId
  // so we use filter obj helps us to implement this strategy
  let filter = {};
  if (req.params.tourId) filter = { tour: { _id: req.params.tourId } };

  try {
    const feature = new APIFeature(Like.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();
    const doc = await feature.query;

    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: {
        data: doc,
      },
    });
  } catch (err) {
    next(err);
  }
});
// exports.deleteAllLikes = catchAsync(async (req, res, next) => {
//   await Like.findByIdAndDelete();

//   res.status(204).json({
//     status: 'success',
//     message: 'all likes are removed!',
//   });
// });

exports.getLike = factory.getOne(Like);
exports.deleteLike = factory.deleteOne(Like);
