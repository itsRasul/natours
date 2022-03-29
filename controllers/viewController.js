const Tour = require('../models/tourModel');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) get tours from tour model
  const tours = await Tour.find();
  // 2) build template dynamiclly

  // 3) render the template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  // 1) get tour data which is requested (includes reviews and guides)
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'review',
    select: '-__V',
  });
  // 2) build template
  // 3) render template considering step 1
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour', {
      title: tour.name,
      tour,
    });
});

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'login',
  });
});
