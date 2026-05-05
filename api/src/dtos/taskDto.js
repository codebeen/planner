class TaskDto {
    constructor(task) {
        this.task_id = task.task_id;
        this.name = task.name;
        this.task_date = task.task_date;
        this.start_time = task.start_time;
        this.end_time = task.end_time;
        this.is_done = task.is_done;
        this.user_id = task.user_id;
    }

    static map(tasks) {
        if (Array.isArray(tasks)) {
            return tasks.map(task => new TaskDto(task));
        }
        return new TaskDto(tasks);
    }
}

module.exports = TaskDto;
