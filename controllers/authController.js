const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { nextTick } = require('process');
// const { decode } = require('punycode');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signUp = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);

  // WE DON'T USE TOP CODE BECAUSE IT MAKES A SECURITY BUG
  // MAYBE SOMEONE SPECIFY ROLE PROPERTY IN THE BODY AND IT MEANS ANYONE WHO WANT CAN BE ADMIN
  // BUT IN BOTTOM CODE WE JUST PICK THE PROPERTIES WE WANT, EVEN SOMEONE SPECIFY ROLE PROPERY,
  // WE DON'T TAKE THAT INTO THE DATABASE
  // FOR CREATE A ADMIN WE CAN CREATE A NORMAL USER AND GO TO DATABASE AND MODIFY
  // ROLE PROPERTY TO "ADMIN" INSTEAD OF "USER".

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    user: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // 1) check user and password exist in req.body
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError('please provide your email and password', 401);
  }
  // 2) if user exist && password is correct
  const user = await User.findOne({ email });

  // 3) if everyThing is ok, create a new token and send it to client

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('email or password are incorrect!', 401);
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // point: WE USULLY SEND TOKEN IN HEADER REQUEST (NOT BODY) THIS WAY => authorization: brearer <TOKEN>
  // 1) check if token exists and it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // req.headers.authorization.split(' ') => ['brearer', '<TOKEN>']
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    throw new AppError(
      'you are not logged in! please log in and try again.',
      401
    );
  }

  // 2) verification token
  const decodeToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3) check if user still exists
  const currentUser = await User.findById(decodeToken.id);
  if (!currentUser) {
    throw new AppError(
      'The user belonging to this token does no longer exist!',
      401
    );
  }

  // 4) check if user changed the password after the token was issued
  const changedPassword = currentUser.isChangedPassword(decodeToken.iat);
  if (changedPassword) {
    throw new AppError(
      'user recently changed password, please log in again!',
      401
    );
  }

  // if compiler reachs at this posit and no error has occured,
  // it means user have token correctly, so let him/her to access current middleware
  req.user = currentUser;

  next();
});

exports.restrictTo = function (...roles) {
  // roles => ['admin', 'lead-guide'] , req.user.role => 'user'
  // the main middleware
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('you are forbidden to access this part', 403);
    }
    next();
  };
};
