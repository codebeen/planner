class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async getUserById(userId) {
        const users = await this.userRepository.getUserById(userId);
        return users.length > 0 ? users[0] : null;
    }

    async createUser(user) {
        return await this.userRepository.createUser(user);
    }

    async updateUser(userId, updatedFields) {
        return await this.userRepository.updateUser(userId, updatedFields);
    }
}

module.exports = UserService;
