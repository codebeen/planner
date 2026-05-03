const FoodLogRepository = require('../repository/foodLogRepository');
const FoodLogService = require('../services/foodLogService');
const FoodLogDto = require('../dtos/foodLogDto');
const ApiResponse = require('../dtos/apiResponse');

class FoodLogController {
    constructor() {
        this.foodLogRepository = new FoodLogRepository();
        this.foodLogService = new FoodLogService(this.foodLogRepository);
    }

    getFoodLogs = async (req, res) => {
        try {
            const logs = await this.foodLogService.getFoodLogsByUserId(req.user.id);
            res.json(ApiResponse.success(FoodLogDto.map(logs)));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };

    getFoodLogById = async (req, res) => {
        try {
            const log = await this.foodLogService.getFoodLogById(req.params.id);
            if (!log) return res.status(404).json(ApiResponse.error('Food log not found', 'Not Found'));
            res.json(ApiResponse.success(FoodLogDto.map(log)));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };

    createFoodLog = async (req, res) => {
        try {
            const log = await this.foodLogService.createFoodLog(req.user.id, req.body);
            res.status(201).json(ApiResponse.success(FoodLogDto.map(log[0]), 'Food log created successfully'));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };

    updateFoodLog = async (req, res) => {
        try {
            const log = await this.foodLogService.updateFoodLog(req.params.id, req.body);
            res.json(ApiResponse.success(FoodLogDto.map(log[0]), 'Food log updated successfully'));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };

    deleteFoodLog = async (req, res) => {
        try {
            await this.foodLogService.deleteFoodLog(req.params.id);
            res.status(200).json(ApiResponse.success(null, 'Food log deleted successfully'));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    };
}

module.exports = new FoodLogController();
