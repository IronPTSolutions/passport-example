const User = require("../models/User.model");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const MAX_AGE = 7;
module.exports.sessionConfig = expressSession({
  secret: "super-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 3600 * 1000 * MAX_AGE,
  },
  store: new MongoStore({
    mongoUrl: "mongodb://127.0.0.1:27017/passport-example",
  }),
});
