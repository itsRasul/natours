const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeature = require('../utils/APIFeature');

exports.getAllToursDependsOnSearch = catchAsync(async (req, res, next) => {
  const { search } = req.params;
  const searchQuery = search.split('-').join(' ');
  const query = Tour.find({
    name: { $regex: `.*${searchQuery}.*`, $options: 'i' },
  });
  console.log(req.query);
  const feature = new APIFeature(query, req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  const tours = await feature.query;

  if (tours.length === 0) throw new AppError('no tours found!', 404);

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});
