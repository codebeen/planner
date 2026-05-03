class TaskService {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    async getTasksByUserId(userId) {
        return await this.taskRepository.getByUserId(userId);
    }

    async getTaskById(taskId) {
        const tasks = await this.taskRepository.getByTaskId(taskId);
        return tasks.length > 0 ? tasks[0] : null;
    }

    async createTask(userId, body) {
        return await this.taskRepository.create({ user_id: userId, ...body });
    }

    async updateTask(taskId, body) {
        return await this.taskRepository.update(taskId, body);
    }

    async deleteTask(taskId) {
        return await this.taskRepository.delete(taskId);
    }
}

module.exports = TaskService;
