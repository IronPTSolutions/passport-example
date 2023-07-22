const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/User.model')

module.exports.register = (req, res, next) => {
  res.render('auth/register', )
}

module.exports.doRegister = (req, res, next) => {
  function renderWithErrors(errors) {
    res.render('auth/register', {
      user: req.body,
      errors: errors,
    })
  }

  User.findOne({ email: req.body.email})
  .then((user) => {
    if(user) {
      renderWithErrors({ email: 'email is alreay registered'})
    } else {
      user = { name, email, password } = req.body
      if (req.file) {
        user.avatar = req.file.path
      }

      return User.create(user)
      .then((user) => {
        res.redirect('/')
      })
    }
  })
  .catch((error) => {
    if(error instanceof mongoose.Error.ValidationError) {
      renderWithErrors(error.errors)
    } else {
      next(error)
    }
  })
} 

module.exports.login = (req, res, next) => {
  res.render('auth/login', )
}

// Creo una función que haga la lógica de loguearse con passport y que me sirva tanto si es para local, como Google, como Slack etc. 
const loginWithStrategy = (strategy, req, res, next) => {
  const passportController = passport.authenticate(strategy, (error, user, validations) => {
    if (error) {
      next(error);
    } else if (!user) {
      console.log('no hay usuario')
      res.status(400).render('auth/login', { user: strategy === 'local-auth' ? req.body : {}, errors: validations});
    } else {
      console.log('hay usuario')
      req.login(user, (error) => {
        if (error) {
          next(error)
        } else {
          res.redirect('/')
        }
      })
    }
  })
  passportController(req, res, next);
}

module.exports.doLogin = (req, res, next) => {
  loginWithStrategy('local-auth', req, res, next);
}

module.exports.loginWithGoogle = (req, res, next) => {
  const passportController = passport.authenticate('google-auth', {
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    prompt: 'select_account'  // esto es para que siempre aparezca la ventana de seleccionar una cuenta y no se conecta a la cuenta que está logueada automáticamente.
  });

  passportController(req, res, next);
};

module.exports.doLoginWithGoogle = (req, res, next) => {
  loginWithStrategy('google-auth', req, res, next);
}

