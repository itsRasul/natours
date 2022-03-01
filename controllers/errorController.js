const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const { message } = err;
  return new AppError(message, 400);
};

const handleDublicateFieldDB = (err) => {
  const message = `dublicate field value: "${err.keyValue.name}" please try another value`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // this error is related to programming problme, so we are not gonna show
    // all the details to client

    // 1) Log Error to console
    console.error(`Error: ${err}`);

    // 2) send a thin message just to show somthing went wrong(not details)
    res.status(500).json({
      status: 'error',
      message: 'Oops, somthing went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  // here is where we're gonna handle all the Error (operational Error)
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    // meaning of these if else statements is we wanna make error operational by ourself using AppError

    // when user tries to get a Tour by whole wrong id this error will be occured that err.name is CastError
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    // when user tries to update a source that has wrong field value
    //  and validators throws Error, err.name is ValidationError
    else if (err.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    // when user tries create a tour that has dublicate field err.code is 11000
    else if (err.code === 11000) error = handleDublicateFieldDB(error);

    sendErrorProd(error, res);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
