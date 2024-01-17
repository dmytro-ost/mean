const express = require('express');

const router = new express.Router();
const ash = require('express-async-handler');

const {
  authMiddleware
} = require('./middlewares/authMiddleware');

const {
  validOldNewPass
} = require('./middlewares/changePassMiddleware');

const {
  getProfile,
  deleteProfile,
  changePassword
} = require('../controllers/profileController');

router.get('/users/me', authMiddleware, ash(getProfile));
router.delete('/users/me', authMiddleware, ash(deleteProfile));
router.patch(
  '/users/me/password',
  authMiddleware,
  ash(validOldNewPass),
  ash(changePassword)
);

module.exports = router;
