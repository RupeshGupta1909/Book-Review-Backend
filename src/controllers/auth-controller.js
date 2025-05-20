const User = require('../models/user-model');
const ApiResponse = require('../utils/response-util');
const JwtUtil = require('../utils/jwt-util');
const AuthValidator = require('../validators/auth-validator');

class AuthController {
    async signup(req, res) {
        try {
        const validator = new AuthValidator('signup');
        if (!validator.validate(req.body)) {
            return res.status(400).json(
            ApiResponse.badRequest('Validation failed', { errors: validator.errors })
            );
        }
        const { username, email, password } = validator.value;
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json(
            ApiResponse.badRequest('User with this email or username already exists')
            );
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password
        });

        // Generate token
        const token = JwtUtil.generateToken(user._id);

        // Remove password from output
        user.password = undefined;

        res.status(201).json(
            ApiResponse.created({ user, token })
        );
        } catch (error) {
        res.status(400).json(
            ApiResponse.error(400, error.message)
        );
        }
    }

    async login(req, res) {
        try {
        const validator = new AuthValidator('login');
        if (!validator.validate(req.body)) {
            return res.status(400).json(
            ApiResponse.badRequest('Validation failed', { errors: validator.errors })
            );
        }

        const { email, password } = validator.value;

        // Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json(
            ApiResponse.unauthorized('Incorrect email or password')
            );
        }

        // Generate token
        const token = JwtUtil.generateToken(user._id);

        // Remove password from output
        user.password = undefined;

        res.status(200).json(
            ApiResponse.success({ user, token })
        );
        } catch (error) {
        res.status(400).json(
            ApiResponse.error(400, error.message)
        );
        }
    }
}

module.exports = new AuthController(); 