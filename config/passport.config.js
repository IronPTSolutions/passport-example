// requerimos passport
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

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

// passport google 
  passport.use('google-auth', new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, next) => {
      const googleID = profile.id;
      const name = profile.displayName;
      const email = profile.emails && profile.emails[0].value || undefined
        
      if (googleID && email) {
        User.findOne({ $or: [
          { email },
          { googleID }
        ]})
          .then(user => {
            if (user) {
              next(null, user)
            } else {
              // Crear uno nuevo
              return User.create({
                name,
                email,
                password: mongoose.Types.ObjectId(),
                googleID,
                image
              })
                .then(userCreated => {
                  next(null, userCreated)
                })
            }
          })
          .catch(err => next(err))
      } else {
        next(null, false, { error: 'Error connecting with Google Auth' })
      }
    }


  ))


  