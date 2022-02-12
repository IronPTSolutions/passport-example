const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/User.model');
const mailer = require("../config/mailer.config");

module.exports.register = (req, res, next) => {
  res.render('auth/register')
}

module.exports.login = (req, res, next) => {
  res.render('auth/login')
}

module.exports.doRegister = (req, res, next) => {
  const user = req.body;

  // { email: 'Already in use' }
  const renderWithErrors = (errors) => {
    res.render('auth/register', { errors, user })
  }

  User.findOne({ email: user.email })
    .then((userFound) => {
      if (userFound) {
        renderWithErrors({ email: 'Email already in use' })
      } else {
        if (req.file) {
          user.image = req.file.path
        }
        return User.create(user)
          .then((createdUser) => {
            mailer.sendActivationMail(createdUser.email, createdUser.activationToken);
            res.redirect('/login')
          })

      }
    })
    .catch(err => {
      if (err instanceof mongoose.Error.ValidationError) {
        renderWithErrors(err.errors)
      } else {
        next(err)
      }
    })
}

const login = (req, res, next, provider) => {
  passport.authenticate(provider || 'local-auth', (err, user, validations) => {
    if (err) {
      next(err)
    } else if(!user) {
      res.status(404).render('auth/login', { errorMessage: validations.error })
    } else {
      req.login(user, (loginError) => {
        if (loginError) {
          next(loginError)
        } else {
          req.flash('flashMessage', 'Has iniciado sesión con éxito')
          res.redirect('/profile')
        }
      })
    }
  })(req, res, next)
}

module.exports.doLogin = (req, res, next) => {
  login(req, res, next)
}

module.exports.doLoginGoogle = (req, res, next) => {
  login(req, res, next, 'google-auth')
}

module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/login');
}

module.exports.activate = (req, res, next) => {
  const token = req.params.token;

  User.findOneAndUpdate({ activationToken: token, active: false }, { active: true })
    .then((u) => {
      req.flash('flashMessage', 'Has activado tu cuenta con éxito!')
      res.redirect('/login')
    })
    .catch(err => next(err))
}