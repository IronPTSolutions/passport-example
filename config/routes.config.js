const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');

router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/register', authController.register)
router.get('/login', authController.login)
router.post('/register',authController.doRegister)

module.exports = router;