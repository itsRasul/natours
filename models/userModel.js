const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name!'],
    minLength: [3, 'name has to be more than 3 character'],
    maxLength: [32, 'name has to be more than 32 character'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'hey'],
    // validate: [validator.isEmail, 'email is invalid'],
    validate: {
      validator: validator.isEmail,
      message: 'email is invalid',
    },
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minLength: [8, 'password has to be more than 8 character'],
    // validate: {
    //   validator: validator.isStrongPassword(this.password, {
    //     minLowerCase: 1,
    //     minUpperCase: 1,
    //     minNumber: 1,
    //   }),
    // },
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    minLength: [8, 'password has to be more than 8 character'],
    // this validator only executes on .save() and .create() (NOT .update or..)
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  resetPassword: String,
  resetPasswordExpires: Date,
});
// hash password and delete confirmPassword to avioding save it in DB
userSchema.pre('save', async function (next) {
  // this func only runs in case if the password field is modified
  if (!this.isModified('password')) return next();
  // we encrypt the password to make database safe from hackers to accessing password
  this.password = await bcrypt.hash(this.password, 12);
  // delete confirmpassword because we don't need that any more
  this.passwordConfirm = undefined;
  next();
});
// when save user doc if password has been changed => set or update passwordChangedAt field
userSchema.pre('save', function (next) {
  if (!(this.isModified('password') || this.isNew)) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// userSchema.checkPasswordAndPasswordConfirm('save', function(next) {
//   if(!(this.isModified('password'))) return next();
//   if(!(this.password === this.passwordConfirm)){
//     next(new AppError('password and passwordConfirm is not the same!', 400));
//   }
// })

// correct if new password is the same password that is in DB
userSchema.methods.correctPassword = async function (
  condidatePassword,
  userPassword
) {
  return await bcrypt.compare(condidatePassword, userPassword);
};
// check when user tries to log in,his password has been changed after log in or not
userSchema.methods.isChangedPassword = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordTimeStamp = this.passwordChangedAt.getTime() / 1000;
    return passwordTimeStamp > JWTTimeStamp;
  }
  return false;
};

userSchema.methods.createResetPasswordToken = function () {
  // create a reset Token using crypto module
  // we don't use jwt because it's not that important and security issue
  const resetToken = crypto.randomBytes(32).toString('hex');

  // we hash the reset password and save it to DB, and just main token should be sended to user email,
  // becuase resetPassword is almost like real password,
  // user send the reset password to us, and we should compare that with the resetPassword we have in DB
  // just like real password we encrypt resetPassword for avoiding damage of hackers
  this.resetPassword = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // reset password should be expired at 10 minutes after the bottom code is finished.
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
