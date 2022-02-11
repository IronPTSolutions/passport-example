const mongoose = require('mongoose');
// requerimos passport para el doLogin
const passport = require('passport');
// requerimos el modelo User
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
//una vez configurado passport podemos continuar
module.exports.doLogin = (req, res, next) => {
  passport.authenticate('local-auth', (err, user, validations) => {
    if (err) {
      next(err)
    } else if(!user) {
      res.status(404).render('auth/login', { errorMessage: validations.error })
    } else {
      req.login(user, (loginError) => {
        if (loginError) {
          next(loginError)
        } else {
          res.redirect('/profile')
        }
      })
    }
  })(req, res, next)
}

// ese (req, res, next) es xq todo lo anterior es como si fuese
//una funcion por si misma. 


module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/login');
}

//creado el logout