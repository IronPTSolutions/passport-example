const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller')
const upload = require('../config/multer.config')
const secure = require('../middlewares/secure.mid')

router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/register', secure.isNotAuthenticated, authController.register)
router.post('/register', secure.isNotAuthenticated, upload.single('avatar'), authController.doRegister)
router.get('/login', secure.isNotAuthenticated, authController.login)
router.post('/login', secure.isNotAuthenticated, authController.doLogin)
router.get('/logout', secure.isAuthenticated, authController.logout)

router.get('/profile', secure.isAuthenticated, userController.profile)
router.get('/users/:id/activate', authController.activate);

router.get('/authenticate/google', authController.loginWithGoogle)
router.get('/authenticate/google/cb', authController.doLoginWithGoogle)

module.exports = router;