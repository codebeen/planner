class FoodLogDto {
    constructor(log) {
        this.food_log_id = log.food_log_id;
        this.food = log.food;
        this.category = log.category;
        this.calories = log.calories;
        this.date_time = log.date_time;
        this.user_id = log.user_id;
    }

    static map(logs) {
        if (Array.isArray(logs)) {
            return logs.map(log => new FoodLogDto(log));
        }
        return new FoodLogDto(logs);
    }
}

module.exports = FoodLogDto;
