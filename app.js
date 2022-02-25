const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
// core middlewares
app.use(express.json());
// third-party middlewares
app.use(morgan('dev'));
// own middlewares | set routers to specific route
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(`i can't find this URL: ${req.originalUrl}`, 404);

  // when next func is called with an argument(any argument) => express finds out
  // an Error has occured.. so ignores all the middlwares and goes to last middleware,
  // the last middleware is where we're gonna handle all the Error depends on it's type
  // point: argument we pass into next func is sended to that middleware as first parameter
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
