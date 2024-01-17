const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const getProfile = async (req, res) => {
  const currentUser = await User.findOne({
    _id: req.user._id
  }, {
    _id: 1,
    email: 1,
    created_date: 1
  });

  if (!currentUser) {
    return res.status(400).json({
      message: 'User not found!'
    });
  }

  return res.status(200).json({
    user: currentUser
  });
};

const deleteProfile = async (req, res) => {
  const currentUser = await User.findOne({
    _id: req.user._id
  });

  if (!currentUser) {
    return res.status(400).json({
      message: 'User not found!'
    });
  }

  if (currentUser.role === 'DRIVER') {
    return res.status(400).json({
      message: 'Driver can not delete profile'
    });
  }

  User.deleteOne({

    _id: req.user._id

  }, (err, result) => {
    if (err) {
      return res.status(400).json({
        message: `Can't delete user from DB. ${err}`
      });
    }

    return res.status(200).json({
      message: 'Profile deleted successfully'
    });
  });
};

const changePassword = async (req, res) => {
  const currentUser = await User.findOne({
    _id: req.user._id
  });

  if (!currentUser) {
    return res.status(400).json({
      message: 'User not found!'
    });
  }

  if (!(await bcrypt.compare(req.user.oldPassword, currentUser.password))) {
    return res.status(400).json({
      message: 'Wrong password!'
    });
  }

  // All OK here. we can change password
  User.updateOne({

    _id: req.user._id

  }, {

    password: await bcrypt.hash(req.user.newPassword, 10)

  }, (err, result) => {
    if (err) {
      return res.status(400).json({
        message: `Can't update password in DB. ${err}`
      });
    }

    return res.status(200).json({
      message: 'Success'
    });
  });
};

module.exports = {
  getProfile,
  deleteProfile,
  changePassword
};
