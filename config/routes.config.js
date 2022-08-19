const express = require('express');
const router = express.Router();
const passport = require("passport");
const authController = require('../controllers/auth.controller');
const userController = require ("../controllers/user.controller");
const authMiddlewares = require("../middlewares/authMiddleware");

const SCOPES = ["profile", "email"];

router.get('/', (req, res, next) => {
  res.render('index')
})

// authentication
router.get('/register', authController.register);
router.post("register", authController.doRegister);
router.get('/login', authMiddlewares.isNotAuthenticated, authController.login);
router.post("/login", authController.doLogin);

//passport
router.get("/login/google", authMiddlewares.isNotAuthenticated, passport.authenticate("google-auth", { scope: SCOPES }));
router.get("/auth/google/callback", authMiddlewares.isNotAuthenticated, authController.doLoginGoogle);
router.get("/logout", authMiddlewares.isAuthenticated, authController.logout);

//users
router.get("/profile", authMiddlewares.isAuthenticated, userController.profile);

  


module.exports = router;