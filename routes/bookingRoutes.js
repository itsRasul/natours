const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/getMyBookings',
  authController.protect,
  bookingController.getMyBookingsAPI
);

router
  .route('/deleteMyBooking/:bookingId')
  .delete(authController.protect, bookingController.deleteMyBooking);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    bookingController.getAllBooking
  )
  .post(authController.protect, bookingController.createBooking);

router
  .route('/:bookingId')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    bookingController.getBooking
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    bookingController.deleteBooking
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    bookingController.updateBooking
  );

module.exports = router;
