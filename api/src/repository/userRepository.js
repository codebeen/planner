const { supabaseAdmin } = require("../config/supabase");

class UserRepository {
    // Get a user by id
    async getUserById(userId) {
        const { data, error } = await supabaseAdmin
            .from("Users")
            .select("*")
            .eq("user_id", userId);

        if (error) throw error;
        return data;
    }

    // Create a new user
    async createUser(user) {
        const { data, error } = await supabaseAdmin
            .from("Users")
            .insert([user])
            .select();

        if (error) throw error;
        return data;
    }

    // Update a user
    async updateUser(userId, updatedFields) {
        const { data, error } = await supabaseAdmin
            .from("Users")
            .update(updatedFields)
            .eq("user_id", userId)
            .select();

        if (error) throw error;
        return data;
    }
}

module.exports = UserRepository;