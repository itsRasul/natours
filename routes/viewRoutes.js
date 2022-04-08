const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// The diffrence between authController.protect and authController.isLoggedIn:
// in protect we actully gonna protect route and no one can be able access that route but logged in user and when a
// user which is not logged in throws an error
// but in isLoggedIn we are just gonna see if a user is loggged in, in order to render website correctly
// and if user is not logged in no error will be apears, just we find out user isn't logged in and render website in correct way
// summary: in isLoggedIn we don't protect route just we find out user is logged in or not in order to render website correctly

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tours/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.login);
router.get('/me', authController.protect, viewController.getMe);
router.get(
  '/my-tours',
  authController.protect,
  bookingController.getMyBookings
);
// THIS ROUTE FOR UPDATE USER DATA FROM SUBMITTING FORM (NOT API)
// router.post(
//   '/update-user-data',
//   authController.protect,
//   viewController.updateUserData
// );

module.exports = router;
