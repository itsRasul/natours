const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = new express.Router();

// nested routes

// instead of this => POST api/v1/review
// we want this => POST api/v1/tours/adfs564f1sdf/reviews
// to create review
router.use('/:tourId/reviews', reviewRouter);

// router.param('id', tourController.checkId);
router
  .route('/top-5-tours')
  .get(tourController.aliesTopTours, tourController.getAllTours);

// instead of put authController.protect each route we could use bottom code and get rid of all protect in every route
// router.use(authController.protect);
// top code cuases to protect all of routes after this line without puting 'protect' in each route, ok?
// but actully i didn't do that

router
  .route('/tour-stats')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.getTourStats
  );

router
  .route('/monthly-tours/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.getMonthlyTours
  );

// for quering tours which are near about to our location we define this route
// of course we could also query like this: tours?distance=400&lanlat=0.5584,1.54874&unit=km
// but we preferred to define endpoint like bottom line:
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
