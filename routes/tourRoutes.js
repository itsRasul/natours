const express = require('express');
const tourController = require('../controllers/tourControllers');

const router = new express.Router();

// router.param('id', tourController.checkId);
router
  .route('/top-5-tours')
  .get(tourController.aliesTopTours, tourController.getAllTours);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
