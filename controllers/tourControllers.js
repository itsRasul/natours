const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModel');
const APIFeature = require('../utils/APIFeature');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const storageTourImages = multer.memoryStorage();

const tourFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('please just upload images!', 400), false);
};

const upload = multer({
  storage: storageTourImages,
  fileFilter: tourFileFilter,
});

exports.uploadTourImages = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 3,
  },
]); // req.files => {imageCover: [file], images: [file, file, file]}

// upload.single('photo')   returns {photo: {file}}
// upload.array('images', 4)  returns [{file},{file}]

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  // resize imageCover

  // passing name of the image cover to req.body in order to storing name photo in DB in next
  // middleware by Ability of accissing name of the imageCover
  req.body.imageCover = `tour-${req.user.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // resize images

  req.body.images = [];

  const promises = req.files.images.map(async (image, i) => {
    const nameImage = `tour-${req.user.id}-${Date.now()}-images-${i}.jpeg`;
    await sharp(image.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${nameImage}`);
    req.body.images.push(nameImage);
  });

  await Promise.all(promises);

  next();
});
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

exports.getToursWithin = catchAsync(async (req, res, next) => {
  // latitude: mokhtasat arzi joghrafiaie
  // longitude:  mokhtasat tooli joghrafiaie
  const { latlng, distance, unit } = req.params;

  const [latitude, longitude] = latlng.split(',');

  if (!latitude || !longitude) {
    throw new AppError(
      'please enter latitude and longitude in this format: "latitude,longitude"',
      400
    );
  }

  // radius utit should be radian
  // to convert mile and kilometer in radin:
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  // distance = earth radius * radians (radian is a degree)
  // radians = distance / earth radius
  // km radians = distance in km / 6371
  // mi radians = distance in mi / 3959
  // i don't get it, you could consider radius to radian
  // 6371 is radius of erth in km
  // distance is the distance of my location to a tour
  // and distance / radius => radian(kind of degree)
  // radius sould not be radius:/, i mean depending on this logig now instead of radius we should have radian:|
  // and also mongoose want us to put radian in query too, but it named it radius instead of radian
  // i don't get this, but to make our life easier, consider radius to radian for now
  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  // #centerSphere = [ [ longitude, latitude ], radius]
  //                      center point        degree      =>  distance => DB querys geos within this distance

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      data: tours,
    },
  });
});

// we wanna get all tour's distances from specific point

exports.tourDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [latitude, longtitude] = latlng.split(',');

  if (!latitude || !longtitude) {
    throw new AppError(
      'please enter latitute and longtitude in this format: "latitude,longtitude"',
      400
    );
  }

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  const distances = await Tour.aggregate([
    // geoNear stage needs to be the first stage
    // geoNear is only stagee that about to geoSpetial aggregation
    // geoNear requires at least one field that has geospatial index (startLocation is in index)
    // each filed that is in geospatial index is considered by this aggregation in order to perform calculate data
    // if two fileds are in geospatial index we must to use 'keys' parqameter in order to controll that which one to use
    {
      $geoNear: {
        // one of the parameter we have to use in geoNear in 'near',
        // 'near' is the point from which to calculate the distances, so all the distances will be calculate from this point
        near: {
          // we need to define near parameter in geo json format
          type: 'Point',
          coordinates: [longtitude * 1, latitude * 1],
        },
        // another parameter we have to use is 'distanceField', in this parameter we have to specify the name of distance field
        // that we wanna store distance data
        distanceField: 'distance',
        // another field that we can use in $geoNear stage is distanceMultiplier, in this field we specify one number that divides distances by itself
        // actully we convert unit's distances in this way
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
