const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Semua route dilindungi, hanya admin
router.get('/admin/users', authMiddleware, userController.getAll);
router.post('/admin/users', authMiddleware, userController.create);
router.delete('/admin/users/:id', authMiddleware, userController.remove);
router.put('/admin/users/:id/password', authMiddleware, userController.changePassword);

module.exports = router;
