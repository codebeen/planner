const TaskRepository = require('../repository/taskRepository');
const TaskService = require('../services/taskService');
const TaskDto = require('../dtos/taskDto');
const ApiResponse = require('../dtos/apiResponse');

class TaskController {
    constructor() {
        this.taskRepository = new TaskRepository();
        this.taskService = new TaskService(this.taskRepository);
    }

    getTasks = async (req, res) => {
        try {
            const tasks = await this.taskService.getTasksByUserId(req.user.id);
            res.json(ApiResponse.success(TaskDto.map(tasks)));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };

    getTaskById = async (req, res) => {
        try {
            const task = await this.taskService.getTaskById(req.params.id);
            if (!task) return res.status(404).json(ApiResponse.error('Task not found', 'Not Found'));
            res.json(ApiResponse.success(TaskDto.map(task)));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };

    createTask = async (req, res) => {
        try {
            const task = await this.taskService.createTask(req.user.id, req.body);
            res.status(201).json(ApiResponse.success(TaskDto.map(task[0]), 'Task created successfully'));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };

    updateTask = async (req, res) => {
        try {
            const task = await this.taskService.updateTask(req.params.id, req.body);
            res.json(ApiResponse.success(TaskDto.map(task[0]), 'Task updated successfully'));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };

    deleteTask = async (req, res) => {
        try {
            await this.taskService.deleteTask(req.params.id);
            res.status(200).json(ApiResponse.success(null, 'Task deleted successfully'));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };
}

module.exports = new TaskController();
