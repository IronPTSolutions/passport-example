const express = require('express');
const { authorize } = require('passport');

const router = express.Router();

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller')

router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/register', authMiddleware.isNotAuthenticated,authController.register)
router.post('/register', authMiddleware.isNotAuthenticated, authController.doRegister)

router.get('/login', authMiddleware.isNotAuthenticated, authController.login)
router.post('/login', authMiddleware.isNotAuthenticated, authController.doLogin)

router.get('/logout', authMiddleware.isAuthenticated, authController.logOut)

router.get('/profile', authMiddleware.isAuthenticated, userController.profile)

module.exports = router;