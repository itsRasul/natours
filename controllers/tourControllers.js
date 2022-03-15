const Tour = require('../models/tourModel');
const APIFeature = require('../utils/APIFeature');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// Error handling with try catch
exports.getAllTours = async (req, res, next) => {
  try {
    const feature = new APIFeature(Tour.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();
    const tours = await feature.query;

    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Error handling with catchAsync Function: this way makes us to not using of Try catch blocks
// in controller func
exports.getTour = catchAsync(async (req, res, next) => {
  // const tour = await Tour.findById(req.params.id).populate({
  //   path: 'guides',
  //   select: '-__v -passwordChangedAt',
  // });
  // we don't populate guides here like up codes, because this way we have to populate in all the query and make dublicate code
  // so we actully populate 'guides' in query middleware in tourModel and it runs for every query without dublicate any code

  // populate: populate method on query causes mongoose take whole data in 'path' property in DB instead of just id
  // to do that, mongoose has to send another query in DB

  const tour = await Tour.findById(req.params.id).populate('review');
  if (!tour) {
    throw new AppError('This tour is not exist', 404);
    // this Error will be catched by catchAsync func
    // return next(new AppError('This tour is not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

exports.createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    throw new AppError('This tour is not exist', 404);
    // return next(new AppError('This tour is not exist', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    throw new AppError('This tour is not exist', 404);
    // return next(new AppError('This tour is not exist', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
// aggregation
exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
// aggregation
exports.getMonthlyTours = catchAsync(async (req, res) => {
  // IT DOESN'T WORK, DON'T KNOW WHY
  const year = req.params.year * 1;
  const monthlyTours = await Tour.aggregate([
    {
      $unwind: {
        path: '$startDates',
        includeArrayIndex: 'arrayIndex',
      },
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`).toISOString(),
          $lte: new Date(`${year}-12-31`).toISOString(),
        },
      },
    },
    {
      $group: {
        _id: { $month: new Date('$startDates') },
        numTourStarts: { $sum: 1 },
        name: { $push: '$name' },
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      monthlyTours,
    },
  });
});

exports.aliesTopTours = catchAsync(async (req, res, next) => {
  req.query.sort = '-ratingAverage,price';
  req.query.limit = 5;
  req.query.fields = 'name,price,ratingAverage';

  next();
});
