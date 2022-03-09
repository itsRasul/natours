const rateLimiter = require('express-rate-limit');

function limiter(max, timeMinutes) {
  return rateLimiter({
    max: max,
    windowMs: timeMinutes * 60 * 1000,
    message: 'too many request!',
    standardHeaders: true,
    legacyHeaders: false,
  });
}

module.exports = limiter;
