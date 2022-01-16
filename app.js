const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();
// core middlewares
app.use(express.json());
// third-party middlewares
app.use(morgan('dev'));
// own middlewares | set routers to specific route
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
module.exports = app;
