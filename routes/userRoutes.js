const express = require('express');
const userController = require('../controllers/userControllers');
const authController = require('../controllers/authController');

const router = new express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router
  .route('/updateMyPassword')
  .patch(authController.protect, authController.updateMyPassword);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/updateMe')
  .patch(authController.protect, userController.updateMe);

router
  .route('/deleteMe')
  .delete(authController.protect, authController.deleteMe);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.updateUser
  )
  .delete(userController.deleteUser);

module.exports = router;
