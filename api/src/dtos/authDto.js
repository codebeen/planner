const UserDto = require('./userDto');

class AuthDto {
    constructor(authData) {
        this.user = new UserDto(authData.user);
        this.session = {
            accessToken: authData.session?.access_token,
            refreshToken: authData.session?.refresh_token,
            expiresAt: authData.session?.expires_at,
        };
    }
}

module.exports = AuthDto;
