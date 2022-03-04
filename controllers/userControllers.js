const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync((req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'this route handling is not yet defiend!',
  });
});

exports.createUser = catchAsync((req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'this route handling is not yet defiend!',
  });
});

exports.getUser = catchAsync((req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'this route handling is not yet defiend!',
  });
});

exports.updateUser = catchAsync((req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'this route handling is not yet defiend!',
  });
});

exports.deleteUser = catchAsync((req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'this route handling is not yet defiend!',
  });
});
