const express = require('express');
const router = express.Router();
const foodLogController = require('../controllers/foodLogController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', foodLogController.getFoodLogs);
router.get('/:id', foodLogController.getFoodLogById);
router.post('/', foodLogController.createFoodLog);
router.put('/:id', foodLogController.updateFoodLog);
router.delete('/:id', foodLogController.deleteFoodLog);

module.exports = router;
