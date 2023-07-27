// Requiero todo lo que necesito en este archivo (passport, mongoose, el modelo de usuario y los métodos strategy que tienen los paquetes de local y google de passport)
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/User.model');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Creamos las funciones de serialize (cuando el usuario se autentica correctamente sólo tomamos el id) y desearialize (encontramos al usuario a través del id que guardamos anteriormente y recuperamos todos sus datos)
passport.serializeUser((user, next) => {
    next(null, user.id);
});

passport.deserializeUser((id, next) => {
    User.findById(id)
    .then((user) => next(null, user))
    .catch(next)
});

// Ahora creamos toda la lógica de la estrategia local para poder autenticar a las personas que quieran loguearse.
passport.use(
    'local-auth', // Es el nombre que le damos a la estrategia, lo podemos llamar como queramos.
    new LocalStrategy( //LocalStrategy recibe un objeto que tiene dos campos (usernameField y passwordField) en estos campos tenemos que indicar a qué campos de nuestro modelo hacen referencia. Y recibe un callback que realiza la lógica para ver si el usuario existe en la DB, si la contraseña coincide, etc.
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        (email, password, next) => {
            User.findOne({ email })
            .then((user) => {
                if (!user) {
                    next(null, null, { email: 'Invalid email or password'}) // La lógica de la función next la hacemos en auth.controller, en loginWithStrategy
                } else {
                    return user.checkPassword(password)
                    .then((match) => {
                        if (match) {
                            next(null, user);
                        } else {
                            next(null, null, { email: 'Invalid email or password'})
                        }
                    })
                }
            })
            .catch(next)
        }
    )
)

passport.use(
    'google-auth',
    new GoogleStrategy(
        {
            clientID: process.env.G_CLIENT_ID,
            clientSecret: process.env.G_CLIENT_SECRET,
            callbackURL: process.env.G_REDIRECT_URI || '/authenticate/google/cb'
        },
        (accessToken, refreshToken, profile, next) => { // esta función recibe siempre estos cuatro parámetros
            // el token no lo necesitamos así que no lo vamos a usar en ningún momento

            //Ahora indicamos a lo que va a corresponder los campos de nuestro modelo llamando a los valores que tiene el objeto profile:
            const googleId = profile.id;
            const name = profile.displayName;
            const email = profile.emails[0] ? profile.emails[0].value : undefined;

            if(googleId && name && email) {
                User.findOne({ $or: [{ email }, {'social.google': googleId}] })
                .then((user) => {
                    if(!user) {
                        user = new User({
                            name, 
                            email, 
                            password: new mongoose.Types.ObjectId(),
                            avatar: profile.photos[0].value,
                            social: {
                                google: googleId,
                            },
                            active: true,
                        });

                        return user.save().then((user) => next(null, user));
                    } else {
                        next(null, user);
                    }
                })
                .catch(next);
            } else {
                next(null, null, { oauth: 'invalid google oauth response'});
            }
        }
    )
)