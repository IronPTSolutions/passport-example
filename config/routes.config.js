const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/users.controller');

const authMiddleware = require('../middlewares/auth.middleware')

router.get('/', (req, res, next) => {
  res.render('index')
})

// añadimos un proceso mas a la tuberia
// si isNotAuthenticated solo le dejamos acceder login y register
// si isAutheticated le dejamos acceder perfil y logout.


router.get('/register', authMiddleware.isNotAuthenticated, authController.register)
router.get('/login', authMiddleware.isNotAuthenticated, authController.login)
router.post('/register', authMiddleware.isNotAuthenticated, authController.doRegister)
router.post('/login', authMiddleware.isNotAuthenticated, authController.doLogin)




router.get('/profile', authMiddleware.isAuthenticated, userController.profile )

module.exports = router;