/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'JustAnyWords';

const registerCredentialsSchema = joi.object({
  email:
    joi.string().email().required(),
  password:
    joi.string().required(),
  role:
    joi.string().valid('DRIVER', 'SHIPPER').required()
});

const loginCredentialsSchema = joi.object({
  email:
    joi.string().email().required(),
  password:
    joi.string().required()
});

const forgotPasswordSchema = joi.object({
  email:
    joi.string().email().required()
});

const register = async (req, res) => {
  try { // JOI try/catch
    const {
      email,
      password,
      role
    } = joi.attempt(req.body, registerCredentialsSchema);

    const currentUser = await User.findOne({
      email
    });

    if (currentUser) {
      return res.status(400).json({
        message: 'Такий користувач вже зареєєстрований'
      });
    }

    const user = new User({
      email,
      password: await bcrypt.hash(password, 10),
      role
    });
    await user.save();

    return res.status(200).json({
      message: 'Профайл зареєстровано'
    });
  }
  catch (error) {
    return res.status(400).json({
      message: `Bad request. Check input fields. ${error}`
    });
  }
};

const login = async (req, res) => {
  try { // JOI try/catch
    const {
      email,
      password
    } = joi.attempt(req.body, loginCredentialsSchema);

    const user = await User.findOne({
      email
    }).exec();

    if (!user) {
      return res.status(400).json({
        message: 'User not found!'
      });
    }

    const currentUser = {
      _id: user._id,
      role: user.role,
      email: user.email,
      created_date: user.created_date
    };

    const isPasswordOK = await bcrypt.compare(password, user.password);
    if (!isPasswordOK) {
      return res.status(400).json({
        message: 'Wrong password'
      });
    }

    return res.json({
      jwt_token: jwt.sign(JSON.stringify(currentUser), JWT_SECRET)
    });
  }
  catch (error) {
    return res.status(400).json({
      message: `Bad request. Check input fields. ${error}`
    });
  }
};

const forgotPassword = async (req, res) => {
  try { // JOI try/catch
    const {
      email
    } = joi.attempt(req.body, forgotPasswordSchema);

    const user = await User.findOne({
      email
    }).exec();

    if (!user) {
      return res.status(400).json({
        message: 'User not found!'
      });
    }

    // const newPassword = Math.random().toString(36).slice(-8).toString();
    //  const hash = await bcrypt.hash(newPassword, 10);
    // await User.findOneAndUpdate({
    //   email,
    // }, {
    //   password: hash,
    // });

    return res.json({
      message: 'New password sent to your email address'
    });
  }
  catch (error) {
    return res.status(400).json({
      message: `Bad request. Check input fields. ${error}`
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword
};
