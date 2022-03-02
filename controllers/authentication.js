const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

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
  console.log(token);
  res.status(200).json({
    status: 'success',
    token,
  });
});
