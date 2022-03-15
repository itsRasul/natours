const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
// mergeParams causes to get access before params which set in before router
// in before router (tourRouter) we had this rout '/:tourId/reviews' and passesd reviewRouter for this rout
// we should turn mergeParams on in reviewRouter to get access to :tourId param in before router
// you know what i'm saying? :/
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

router.route('/:id').get(reviewController.getReview);

module.exports = router;
