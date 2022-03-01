const express = require('express');
const userController = require('../controllers/userControllers');
const athentication = require('../controllers/authentication');

const router = new express.Router();

router.route('/signup').post(athentication.signUp);

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
