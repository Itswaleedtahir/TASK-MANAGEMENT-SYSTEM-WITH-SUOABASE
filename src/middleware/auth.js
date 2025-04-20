const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw { status: 401, message: 'No token provided' };
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    
    // Add the user information to the request
    // Supabase JWT tokens have the user ID in the 'sub' claim
    req.user = {
      id: decoded.sub,
      sub: decoded.sub, // Keep sub for backward compatibility
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next({ status: 401, message: 'Invalid token' });
    } else {
      next(error);
    }
  }
};

module.exports = authMiddleware;