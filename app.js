const express = require('express');
const morgan = require('morgan');
// const helmet = require('helmet');
// const xss = require('xss-clean');
// const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const compression = require('compression');
const rateLimiter = require('./utils/limiter');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const searchRouter = require('./routes/searchRoutes');
const likeRouter = require('./routes/likeRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// specify which template engine we wanna use
app.set('view engine', 'pug');
// specify where the path of folder that files about views are located (path of views folder)
app.set('views', `${__dirname}/views`);

// MiddleWares
// this middleware cuases to serve static files
app.use(express.static(`${__dirname}/public`));
// set favicon
app.use(favicon(`${__dirname}/public/img/favicon.png`));
// security-http-headers-middleware
// app.use(helmet());
// rate-limiter-middleware
app.use(
  rateLimiter(
    process.env.RATE_LIMITING_MAX,
    process.env.RATE_LIMITING_TIME_MINUTES
  )
);
app.use('/api/v1/users', rateLimiter(10, 10));
// body-parser-middleware
app.use(express.json());
app.use(cookieParser());
// in order to parse form data comming from forms.. extended opt allows us to get complex data from form
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// data sanitization against NoSQL query injection
// app.use(mongoSanitize());
// data sanitization against XSS
// app.use(xss());

// compression middleware
app.use(compression());
// logger-middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// own middlewares | set routers to specific route
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/search', searchRouter);

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
