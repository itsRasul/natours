const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authController');

const router = new express.Router();

// router.param('id', tourController.checkId);
router
  .route('/top-5-tours')
  .get(tourController.aliesTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-tours/:year').get(tourController.getMonthlyTours);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
