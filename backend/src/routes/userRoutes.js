const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const { requireAdmin } = authMiddleware;

// Semua route dilindungi, hanya admin
router.get('/admin/users', authMiddleware, requireAdmin, userController.getAll);
router.post('/admin/users', authMiddleware, requireAdmin, userController.create);
router.delete('/admin/users/:id', authMiddleware, requireAdmin, userController.remove);
router.put('/admin/users/:id/password', authMiddleware, requireAdmin, userController.changePassword);

module.exports = router;
