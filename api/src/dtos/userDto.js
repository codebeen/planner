class UserDto {
    constructor(user) {
        this.user_id = user.user_id || user.id;
        this.email = user.email;
        this.display_name = user.display_name;
    }

    static map(users) {
        if (Array.isArray(users)) {
            return users.map(user => new UserDto(user));
        }
        return new UserDto(users);
    }
}

module.exports = UserDto;
