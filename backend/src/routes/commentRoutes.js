const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');
const { requireStaff } = authMiddleware;

// Public
router.get('/news/:newsId/comments', commentController.getByNews);
router.post('/comments', commentController.create);

// Admin (protected)
router.get('/admin/comments', authMiddleware, requireStaff, commentController.getAllAdmin);
router.delete('/comments/:id', authMiddleware, requireStaff, commentController.remove);

module.exports = router;
