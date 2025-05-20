const jwt = require('jsonwebtoken');

class JwtUtil {
    static generateToken(userId) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
        });
    }

    static verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
}

module.exports = JwtUtil; 