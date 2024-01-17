const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'JustAnyWords';

module.exports.authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(400).json({
      message: 'No Authorization http header found!'
    });
  }

  const [tokenType, token] = header.split(' ');

  if (!tokenType) {
    return res.status(400).json({
      message: 'Token type (JWT) is not exist at begin of header!'
    });
  }

  if (!token) {
    return res.status(400).json({
      message: 'No JWT token found!'
    });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  }
  catch (err) {
    return res.status(400).json({
      message: `Token is not valid. ${err}`
    });
  }
};
