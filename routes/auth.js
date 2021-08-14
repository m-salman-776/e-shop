const express = require('express');

const authController = require('../controllers/auth')
const router = express.Router();

router.get('/login',authController.getLogin)
router.post('/login',authController.postLogin)
router.post('/logout',authController.postLogout)

router.get('/signup',authController.getSignUp)
router.post('/signup',authController.postSigUp)

router.get('/reset',authController.getResetPassword)
router.post('/reset',authController.postResetPassword)

router.get('/reset/:token',authController.changepassword)
router.post('/setpassword',authController.setPassword)
module.exports = router
