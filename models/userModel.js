const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
});
// hash password
userSchema.pre('save', async function (next) {
  // this func only runs in case if the password field is modified
  if (!this.isModified('password')) return next();
  // we encrypt the password to make database safe from hackers to accessing password
  this.password = await bcrypt.hash(this.password, 12);
  // delete confirmpassword because we don't need that any more
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  condidatePassword,
  userPassword
) {
  return await bcrypt.compare(condidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
