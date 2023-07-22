const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const EMAIL_PATTERN = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/i;
const SALT_ROUNDS = 10;

const userSchema = new Schema({
  name: {
    type: String,
    required: 'name is required',
    minLength: [3, 'name needs at least 3 chars']
  },
  email: {
    type: String,
    required: 'email is required',
    match: [EMAIL_PATTERN, 'email is not valid'],
    unique: true
  },
  password: {
    type: String,
    required: 'password is required',
    match: [PASSWORD_PATTERN, 'password needs at least 8 chars'],
  },
  avatar: {
    type: String
  },
  social: {
    google: {
      type: String,
    }
  },
  active: {
    type: Boolean,
    default: false
  }
});

// Hasheo la contraseña antes de guardar en la base de datos
userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, SALT_ROUNDS)
    .then((hash) => {
      this.password = hash
      next()
    })
    .catch((err) => {
      next(err)
    })
  } else {
    next()
  }
})

// Creo una función que compara la contraseña que llega con la contraseña que está guardada en la DB
userSchema.methods.checkPassword = function(passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password)
}

const User = mongoose.model('User', userSchema);

module.exports = User;