const mongoose = require('mongoose')
const User = require('../models/User.model')
const passport = require('passport')

module.exports.register = (req, res, next) => {
  res.render('auth/register', )
}

module.exports.doRegister = (req, res, next) => {
  const user = req.body

  const renderWithErrors = (errors) => {
    res.render('auth/register', {errors, user})
  }

  User.findOne({email: user.email})
  .then((isUser) => {
    if(isUser) {renderWithErrors, {email: 'Email already in use'}
    } else {
      return User.create(user)
        .then(() => {
          res.redirect ('/login')
        })
    }
  })
  .catch(err => {
    if(err instanceof mongoose.Error.ValidationError) {
      renderWithErrors(err.error)
    }else {
      next(err)
    }
  })
}

module.exports.login = (req, res, next) => {
  res.render('auth/login', )
}

module.exports.doLogin = (req, res, next) => {
 passport.authenticate('local-auth', (err, user, validations) => {
  if(err) {
    next(err)
  } else if (!user) {
    res.status(404).render('auth/login', {user: req.body, errorMessage: validations.error})
  } else {
    req.login(user, (loginErr) => {
      if (!loginErr) {
        next(loginErr)
      } else {
        res.redirect('/profile')
      }
    })
  }
 }) (req, res, next)
}

module.exports.logOut = (req, res, next) => {
  req.logOut();
  res.redirect('/login')
}