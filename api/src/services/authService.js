class AuthService {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    async register(email, password) {
        return await this.authRepository.signUp(email, password);
    }

    async login(email, password) {
        return await this.authRepository.signIn(email, password);
    }

    async logout() {
        return await this.authRepository.signOut();
    }
}

module.exports = AuthService;
