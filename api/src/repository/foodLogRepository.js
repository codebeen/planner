const { supabaseAdmin } = require("../config/supabase");

class FoodLogRepository {
    // Get all food logs for a specific user
    async getByUserId(userId) {
        const { data, error } = await supabaseAdmin
            .from("FoodLogs")
            .select("*")
            .eq("user_id", userId);
        
        if (error) throw error;
        return data;
    }

    // Get a single food log by id
    async getByFoodLogId(foodLogId) {
        const { data, error } = await supabaseAdmin
            .from("FoodLogs")
            .select("*")
            .eq("food_log_id", foodLogId);
        
        if (error) throw error;
        return data; // return the first match
    }

    // Create a food log
    async create(foodLog) {
        const { data, error } = await supabaseAdmin
            .from("FoodLogs")
            .insert([foodLog])
            .select();
        
        if (error) throw error;
        return data;
    }

    // Update a food log
    async update(foodLogId, updatedFields) {
        const { data, error } = await supabaseAdmin
            .from("FoodLogs")
            .update(updatedFields)
            .eq("food_log_id", foodLogId)
            .select();
        
        if (error) throw error;
        return data; // return the first match
    }

    // Delete a food log
    async delete(foodLogId) {
        const { data, error } = await supabaseAdmin
            .from("FoodLogs")
            .delete()
            .eq("food_log_id", foodLogId);

        if (error) throw error;
        return data; // return the first match
    }
}

module.exports = FoodLogRepository;