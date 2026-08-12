const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {

    // Get token from HttpOnly cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.id;

    next();

  } catch (error) {

    console.error(
      'Auth middleware error:',
      error
    );

    return res.status(401).json({
      error: 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;