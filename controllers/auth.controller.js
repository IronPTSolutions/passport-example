const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/User.model')


//pintamos el registro
module.exports.register = (req, res, next) => {
  res.render('auth/register', )
}

//pintamos el login
module.exports.login = (req, res, next) => {
  res.render('auth/login', )
}


// lo primero que hacemos en una pagina para poder usar su contenido es
//REGISTRARSE
module.exports.doRegister = (req, res, next) => {
  const user = req.body;

  //creamos constante de errores
  const renderWithErrors = (errors) => {
    res.render('auth/register', {errors, user})
  }

  //Buscamos el usuario
  User.findOne({ email: user.email})
  .then((userFound) => {
    if (userFound) {
      renderWithErrors({email: 'Email already in use'})
    } else {
      return User.create(user)
      .then(() => {
        res.redirect('/login')
      })
    }
  })
  .catch(err => {
    if( err instanceof mongoose.Error.ValidationError) {
      renderWithErrors(err.errors)
    } else {
      next(err)
    }
  })
}

//Una vez regitrados, debemos loguearnos
//necesitamos antes configurar passport
module.exports.doLogin = (req, res, next) => {




}

