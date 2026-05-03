class TaskDto {
    constructor(task) {
        this.id = task.task_id;
        this.title = task.name;
        this.taskDate = task.task_date;
        this.starTime = task.start_time;
        this.endTime = task.end_time;
        this.isDone = task.is_done;
        this.userId = task.user_id;
    }

    static map(tasks) {
        if (Array.isArray(tasks)) {
            return tasks.map(task => new TaskDto(task));
        }
        return new TaskDto(tasks);
    }
}

module.exports = TaskDto;
