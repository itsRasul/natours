// bult-in node.js module for image proccessing
const sharp = require('sharp');
const multer = require('multer');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

// const userPhotoStrorage = multer.diskStorage({
//   // this func specify where files are gonna be stored
//   destination: (req, file, cb) => {
//     // cb stands for callback, it's somthing like next() in express, if there is an error put that error into the first argument, otherhands put null
//     // in second argument put actully value, and when cb is called, it's gonna to run next func
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const extension = file.mimetype.split('/')[1]; // returns passvand file ex) jpeg, png
//     // we wanna name the file like this => user-userId-timeStamp.extension => user-68f4sd1f68sd-35468516185.jpeg
//     cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//   },
// });

// instead of using top code we use this code in order to save photo in memory (buffer)
// because we need the photo in next middleware (resizeing middleware) it's better to save photo in buffer
// to get better performance..
const userPhotoStrorage = multer.memoryStorage();

const userPhotoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('please upload a image', 400), false);
  }
};
// getting middleware from multer in order to parsing files that's comming from form-data
const upload = multer({
  storage: userPhotoStrorage,
  fileFilter: userPhotoFilter,
});
// put this middleware where we wanna upload a file
exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};

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

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.deleteUser = factory.deleteOne(User);

exports.createUser = catchAsync((req, res, next) => {
  res.status(500).json({
    status: 'error',
    message:
      'this route handler is not defiend, please use /signup in order to create a user!',
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id);

  if (!currentUser) {
    throw new AppError('the user is not exist!', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: currentUser,
    },
  });
});

// update insensetive data of current user with his token
exports.updateMe = catchAsync(async (req, res, next) => {
  // when we use multer middleware if user uploads a file we can access to the file, the file is stored to fileSystem automaticlly
  // but it's not stored in DB directly, just fileSystem, and we just store the name of the file in DB
  // we access to file/files that user has uploaded in req.file(in case one file) and req.files(in case multiple files)
  // console.log(req.body); => {name: 'rasul', email: 'a@b.co'}
  // console.log(req.file); => {file}
  // console.log(req.files); => [{file}, {file}, ...]
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
  // if user upload a photo, we want to update phptp field in DB
  if (req.file) filteredFields.photo = req.file.filename;

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
