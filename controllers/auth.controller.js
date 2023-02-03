const createError = require('http-errors');
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/User.model');


module.exports.register = (req, res, next) => {
  res.render('auth/register', )
}


module.exports.doRegister = (req, res, next) => {
  const renderWithErrors = (errors) => {
    res.render('auth/register', {
      user: {
        email: req.body.email,
        name: req.body.name
      },
      errors
    })
  }

  User.findOne({email: req.body.email})
  .then(user => {
    if (!user) {
      return User.create(req.body)
      .then(user => {
        res.redirect("/login")
      })
    } else {
      renderWithErrors({email: "Email already in use"})
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

module.exports.login = (req, res, next) => {
  res.render('auth/login')
}

const doLoginWithStrategy = (req, res, next, strategy = 'local-auth') => {
  if (strategy === "local-auth") {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(404).render('auth/login', { errorMessage: 'Email or password are incorrect' })
    }
  }


passport.authenticate(strategy, (err, user, validations) => {
  if (err) {
    next(err)
  } else if (!user) {
    console.log({ errorMessage: validations.error })
    res.status(404).render('auth/login', { user: { email: email }, errorMessage: validations.error })
  } else {
    req.login(user, (loginError) => {  //PREGUNTAR ESTO
      if (loginError) {
        next(loginError)
      } else {
        res.redirect('/profile')
      }
    })
  }
})(req, res, next)
}


module.exports.doLogin = (req, res, next) => {
  doLoginWithStrategy(req, res, next)
}

module.exports.profile = (req, res, next) => {
  res.render("user/profile")
}

module.exports.doLogout = (req, res, next) => {
  req.session.destroy()
  res.redirect("/login")
}