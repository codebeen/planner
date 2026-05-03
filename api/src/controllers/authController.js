const AuthRepository = require('../repository/authRepository');
const AuthService = require('../services/authService');
const AuthDto = require('../dtos/authDto');
const UserDto = require('../dtos/userDto');
const ApiResponse = require('../dtos/apiResponse');

class AuthController {
    constructor() {
        this.authRepository = new AuthRepository();
        this.authService = new AuthService(this.authRepository);
    }

    register = async (req, res) => {
        try {
            const { email, password } = req.body;
            const data = await this.authService.register(email, password);
            res.status(201).json(ApiResponse.success(new AuthDto(data), 'Registration successful'));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    };

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const data = await this.authService.login(email, password);
            res.json(ApiResponse.success(new AuthDto(data), 'Login successful'));
        } catch (error) {
            res.status(401).json(ApiResponse.error(error.message));
        }
    };

    logout = async (req, res) => {
        try {
            await this.authService.logout();
            res.status(200).json(ApiResponse.success(null, 'Logged out successfully'));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };

    getMe = async (req, res) => {
        res.json(ApiResponse.success(UserDto.map(req.user)));
    };
}

module.exports = new AuthController();
