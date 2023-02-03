require('dotenv').config()

const express = require('express');
const logger = require('morgan');
const passport = require('passport');
const createError = require('http-errors');
const { sessionConfig, loggedUser } = require('./config/session.config') //PREGUNTAR ESTO! SI QUITO LOGGEDUSER ME SALTA ERROR app.use() requires a middleware function

const router = require('./config/routes.config');
require('./config/db.config');
require('./config/hbs.config');
require('./config/passport.config');

const app = express();

app.use(logger('dev')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

/** Configure static files */
app.use(express.static("public"));

// Session middleware
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
})
/** Router **/
app.use('/', router)

/**
 * Error Middlewares
 */


app.use((req, res, next) => {
  next(createError(404, 'Page not found'));
});

app.use((error, req, res, next) => {
  console.log(error)
  let status = error.status || 500;

  res.status(status).render('error', {
    message: error.message,
    error: req.app.get('env') === 'development' ? error : {}
  })
})

app.listen(3000, () => console.log('App listening on port 3000!'));

