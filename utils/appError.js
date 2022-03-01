// for error handling in express we have 3 section or files
// 1) AppError
// 2) catchAsync function
// 3) errorController
// 1: by this class we are able to make Error by ourSelf in properiate situation
// 2: by this function we catch the Error which is throwed in app => call next(err)
// 3: by this section we will handle The Error and send back the response to client
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
  }
}

module.exports = AppError;
