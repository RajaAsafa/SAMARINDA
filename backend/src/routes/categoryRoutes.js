const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');
const { requireStaff } = authMiddleware;

router.get('/categories', categoryController.getAll);
router.post('/categories', authMiddleware, requireStaff, categoryController.create);
router.put('/categories/:id', authMiddleware, requireStaff, categoryController.update);
router.delete('/categories/:id', authMiddleware, requireStaff, categoryController.remove);

module.exports = router;
