const express = require('express');
const authController = require('../controllers/authController');
const likeController = require('../controllers/likeController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    likeController.getAllLikes
  )
  .post(authController.protect, likeController.createLike)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    likeController.deleteAllLikes
  );

router
  .route('/deleteMyLike')
  .delete(authController.protect, likeController.deleteMyLike);

router
  .route('/:id')
  .get(authController.protect, likeController.getLike)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    likeController.deleteLike
  );

module.exports = router;
