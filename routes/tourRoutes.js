const express = require('express');
const tourController = require('./../controllers/tourControllers');

const router = new express.Router();
router.route('/').get(tourController.getAllTours).post(tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;
