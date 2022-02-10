// requerimos passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// requerimos el User

const User = require('../models/User.model');


// de esta manera le decimos que data queremos almacenar en la sesion
passport.serializeUser((user, next) => {
    next(null, user.id)
}) 

passport.deserializeUser((id, next) => {
    User.findById(id)
      .then(user => {
        next(null, user)
      })
      .catch(err => next(err))
  })


  passport.use('local-auth', new LocalStrategy(

    // importante que coincidan con los objetos del User y del name de las views 
    // nos ahorrara quebraderos de cabeza y muchos problemas
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, next) => {
     
        //bucamos que el usuario este registrado, si todo coincide le dejamos pasar
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            next(null, false, { error: 'Email or password are incorrect' })
          } else {
            return user.checkPassword(password)
              .then((match) => {
                if (!match) {
                  next(null, false, { error: 'Email or password are incorrect' })
                } else {
                  next(null, user)
                }
              })
          }
        })
        .catch(err => next(err))
    }
  ))