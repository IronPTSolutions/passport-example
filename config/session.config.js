const expressSession = require('express-session');
const MongoStore = require('connect-mongo');
const { MONGODB_URI } = require('./db.config')

const MAX_AGE = 7;

module.exports.sessionConfig = expressSession({
  secret: 'super-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 3600 * 1000 * MAX_AGE // maxAge: 2023-05-02
  },
  store: new MongoStore({
    mongoUrl: MONGODB_URI,
    // ttl: 24 * 3600 * MAX_AGE
  })
})