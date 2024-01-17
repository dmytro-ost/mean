const express = require('express');

const router = new express.Router();
const ash = require('express-async-handler');

const {
  register,
  login,
  forgotPassword
} = require('../controllers/authController');

router.post('/auth/register', ash(register));
router.post('/auth/login', ash(login));
router.post('/auth/forgot_password', ash(forgotPassword));

module.exports = router;
