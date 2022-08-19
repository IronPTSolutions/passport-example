const express = require('express');
const router = express.Router();
const passport =require('passport');
const authController = require('../controllers/auth.controller');
const usersController = require('../controllers/users.controller');
const authMiddlewares = require('../middlewares/authMiddlewares')
const SCOPE =[
  'profile',
  'email'
];


router.get('/', (req, res, next) => {
  res.render('index')
})


//AUTH
router.get('/register', authController.register)
router.post('/register', authController.doRegister) 
router.get('/login',authMiddlewares.isNotAuthenticated, authController.login)
router.post('/login', authController.doLogin) 

router.get('/login/google', passport.authenticate('google-auth', { scope: SCOPE })); 
router.get('/auth/google/callback', authController.doLoginGoogle);

router.get("/logout", authMiddlewares.isAuthenticated, authController.logout);

//USER
router.get('/profile', authMiddlewares.isAuthenticated, usersController.profile);

module.exports = router;
