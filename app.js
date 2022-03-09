const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimiter = require('./utils/limiter');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// security-http-headers-middleware
app.use(helmet());
// rate-limiter-middleware
app.use(
  rateLimiter(
    process.env.RATE_LIMITING_MAX,
    process.env.RATE_LIMITING_TIME_MINUTES
  )
);
app.use('/api/v1/users', rateLimiter(5, 10));
// body-parser-middleware
app.use(express.json());

// data sanitization against NoSQL query injection
app.use(mongoSanitize());
// data sanitization against XSS
app.use(xss());

// logger-middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

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
