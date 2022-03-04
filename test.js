const crypto = require('crypto');
const bcrypt = require('bcrypt');

let hey = crypto.randomBytes(32).toString('hex');
console.log(hey);
console.log(bcrypt.hash(hey));
