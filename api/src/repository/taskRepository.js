const { supabaseAdmin } = require("../config/supabase");

class TaskRepository {
    // Get all tasks for a specific user
    async getByUserId(userId) {
        const { data, error } = await supabaseAdmin
            .from("Tasks")
            .select("task_id, name, task_date, start_time, end_time, is_done, user_id")
            .eq("user_id", userId);
        
        if (error) throw error;
        return data;
    }

    // Get a single task by id
    async getByTaskId(taskId) {
        const { data, error } = await supabaseAdmin
            .from("Tasks")
            .select("task_id, name, task_date, start_time, end_time, is_done, user_id")
            .eq("task_id", taskId);
        
        if (error) throw error;
        return data; 
    }

    // Create a task
    async create(task) {
        const { data, error } = await supabaseAdmin
            .from("Tasks")
            .insert([task])
            .select("task_id, name, task_date, start_time, end_time, is_done, user_id");
        
        if (error) throw error;
        return data;
    }

    // Update a task
    async update(taskId, updatedFields) {
        const { data, error } = await supabaseAdmin
            .from("Tasks")
            .update(updatedFields)
            .eq("task_id", taskId)
            .select("task_id, name, task_date, start_time, end_time, is_done, user_id");
        
        if (error) throw error;
        return data; 
    }

    // Delete a task
    async delete(taskId) {
        const { data, error } = await supabaseAdmin
            .from("Tasks")
            .delete()
            .eq("task_id", taskId);

        if (error) throw error;
        return data;
    }
}

module.exports = TaskRepository;
