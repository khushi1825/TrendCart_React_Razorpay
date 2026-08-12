const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {

    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith('Bearer ')
    ) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    // Extract JWT
    const token = authHeader.split(' ')[1];

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store user ID for protected routes
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