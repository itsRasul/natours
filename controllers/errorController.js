module.exports = (err, req, res, next) => {
  // here is where we're gonna handle all the Error (operational Error)
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
