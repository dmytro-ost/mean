const Joi = require('joi');

module.exports.validOldNewPass = async (req, res, next) => {
  const schema = Joi.object({
    oldPassword:
      Joi.string().required(),
    newPassword:
      Joi.string().required()
  });

  try {
    await schema.validateAsync(req.body);
    req.user.oldPassword = req.body.oldPassword;
    req.user.newPassword = req.body.newPassword;
    next();
  }
  catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};
