const User = require('../models/user-model');
const ApiResponse = require('../utils/response-util');
const JwtUtil = require('../utils/jwt-util');
const MESSAGES = require('../constants/messages');

exports.protect = async (req, res, next) => {
  try {
    // 1) Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json(
        ApiResponse.unauthorized(MESSAGES.TOKEN_MISSING)
      );
    }

    // 2) Verify token
    const decoded = JwtUtil.verifyToken(token);

    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json(
        ApiResponse.unauthorized(MESSAGES.TOKEN_USER_NOT_EXIST)
      );
    }

    // 4) Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json(
      ApiResponse.unauthorized(MESSAGES.TOKEN_INVALID)
    );
  }
}; 