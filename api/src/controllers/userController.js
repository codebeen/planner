const UserRepository = require('../repository/userRepository');
const UserService = require('../services/userService');
const UserDto = require('../dtos/userDto');
const ApiResponse = require('../dtos/apiResponse');

class UserController {
    constructor() {
        this.userRepository = new UserRepository();
        this.userService = new UserService(this.userRepository);
    }

    getProfile = async (req, res) => {
        try {
            const user = await this.userService.getUserById(req.user.id);
            if (!user) return res.status(404).json(ApiResponse.error('User not found', 'Not Found'));
            res.json(ApiResponse.success(UserDto.map(user)));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };

    updateProfile = async (req, res) => {
        try {
            const user = await this.userService.updateUser(req.user.id, req.body);
            res.json(ApiResponse.success(UserDto.map(user[0]), 'Profile updated successfully'));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };
}

module.exports = new UserController();
