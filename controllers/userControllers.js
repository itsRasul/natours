const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

// remove all fields in body expect ...fields array
const filterField = (body, ...fields) => {
  const newObj = {};
  Object.keys(body).forEach((el) => {
    if (fields.includes(el)) {
      newObj[el] = body[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(404).json({
    status: 'success',
    result: users.length,
    users,
  });
});

exports.createUser = catchAsync((req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'this route handling is not yet defiend!',
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'this route handling is not yet defiend!',
  });
});
// update insensetive data of current user with his token
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) make an error if user enterd password and passwordConfirm field
  if (req.body.password || req.body.passwordConfirm) {
    throw new AppError(
      'this route is not for updating password, if you wanna update password please use /updatePassword route ',
      400
    );
  }
  // 2) Get user and update it | remove the sensetive field that user has not update them like ROLE field or..
  // just let user to update normal data like NAME and EMAIL and PHOTO
  const filteredFields = filterField(req.body, 'name', 'email');

  // findAndUpdate if we set runValidator: true in option obj only runs validators related to only fields that updated
  // for example if we don't enter email field in body and just enter name field
  // validators of email (required, validate.isEmail and ...) is not executing

  // remember the validators in middleware(userSchema.pre('save') is not running at all in .findUpdate and .findDelete)
  // also validate function in schema is also not gonna run in .findAndUpdate
  // thoso just only gonna run in .save and .create

  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user._id },
    filteredFields,
    {
      new: true,
      runValidators: true,
    }
  );
  // 3) send the updated user to client
  res.status(200).json({
    status: 'success',
    message: 'data be updated successfully!',
    user: updatedUser,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  // update user is actully made of 5 section:
  // 1- a user should be able to update his data (non-sensetive) => /updateMe
  // 2- a user should be able to update his password and passwordConfirm => /updateMyPassword
  // 3- admin should be able to update a user data (non-sensetive) => users/:id (patch)
  // 4- admin should be able to update a user's password => updatePassword/:id
  // 5- resetPassword using forgot password

  // it route is only for admin to manipulate user data (not password)
  if (req.body.password || req.body.passwordConfirm) {
    throw new AppError(
      'this route is not to update password, please to updating password use /updatePassword/:id',
      401
    );
  }
  const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new AppError('user with this id is not exist', 404);
  }
  // Object.keys(req.body).forEach((el) => {
  //   user[el] = req.body[el];
  // });
  // await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: 'success',
    message: 'the user has been updated successfully!',
    user,
  });
});

exports.deleteUser = catchAsync((req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'this route handling is not yet defiend!',
  });
});
