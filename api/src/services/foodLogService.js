class FoodLogService {
    constructor(foodLogRepository) {
        this.foodLogRepository = foodLogRepository;
    }

    async getFoodLogsByUserId(userId) {
        return await this.foodLogRepository.getByUserId(userId);
    }

    async getFoodLogById(foodLogId) {
        const logs = await this.foodLogRepository.getByFoodLogId(foodLogId);
        return logs.length > 0 ? logs[0] : null;
    }

    async createFoodLog(userId, body) {
        return await this.foodLogRepository.create({ user_id: userId, ...body });
    }

    async updateFoodLog(foodLogId, body) {
        return await this.foodLogRepository.update(foodLogId, body);
    }

    async deleteFoodLog(foodLogId) {
        return await this.foodLogRepository.delete(foodLogId);
    }
}

module.exports = FoodLogService;
