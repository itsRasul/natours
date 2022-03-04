const express = require('express');
const userController = require('../controllers/userControllers');
const authController = require('../controllers/authController');

const router = new express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
