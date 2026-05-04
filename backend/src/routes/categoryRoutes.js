const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');

router.get('/categories', categoryController.getAll);
router.post('/categories', authMiddleware, categoryController.create);
router.put('/categories/:id', authMiddleware, categoryController.update);
router.delete('/categories/:id', authMiddleware, categoryController.remove);

module.exports = router;
