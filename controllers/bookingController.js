const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');

exports.getAllBooking = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();

  res.status(200).json({
    status: 'success',
    result: bookings.length,
    data: {
      bookings,
    },
  });
});

exports.getBooking = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById({ _id: bookingId });

  if (!booking) throw new AppError('no booking found by this id!', 404);

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

exports.getMyBookingsAPI = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    result: bookings.length,
    data: {
      bookings,
    },
  });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  // user is userId who is buying a tour
  if (req.user && req.user.id !== user)
    // request is comming from API (postman), check if current user who is logged in actually is user that is in req.body
    throw new AppError(
      "you're not able to booking a tour for another user!",
      401
    );

  if (!req.body.price) {
    // request is comming from API (postman)
    const tour = await Tour.findById(req.body.tour);
    req.body.price = tour.price;
  }

  const booking = await Booking.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'booking is added into your account successfully!',
    data: {
      booking,
    },
  });
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  // 1) find all bookings that belongs to current user
  const bookings = await Booking.find({ user: req.user.id });

  // 2) find tourIds from bookings found
  const tourIDs = bookings.map((booking) => booking.tour.id);

  // 3) find tours from tourIds array
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  // 4) render overview page and pass tours into that
  res.status(200).render('overview', {
    title: 'my tours',
    tours,
  });
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  // this controller only for admin, an admin can remove any booking he wants
  const booking = await Booking.findOneAndDelete({ _id: req.params.bookingId });

  if (!booking) throw new AppError('no booking has found by this id!', 404);

  res.status(204).json({
    status: 'success',
    message: 'booking has been deleted successfully!',
    data: {
      booking,
    },
  });
});

exports.deleteMyBooking = catchAsync(async (req, res, next) => {
  // this controller for any users, user only can delete own booking, not for another user
  const booking = await Booking.findOneAndDelete({
    _id: req.params.bookingId,
    user: req.user.id,
  });

  if (!booking)
    throw new AppError('there is no booking by this id for you!', 404);

  res.status(204).json({
    status: 'success',
    message: 'booking has been delted successfully!',
    data: {
      booking,
    },
  });
});

exports.updateBooking = catchAsync(async (req, res, next) => {
  const updatedBooking = await Booking.findOneAndUpdate(
    { _id: req.params.bookingId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedBooking)
    throw new AppError('there is no booking by this id!', 404);

  res.status(200).json({
    status: 'success',
    message: 'booking is updated successfully!',
    data: {
      updatedBooking,
    },
  });
});
