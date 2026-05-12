const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middleware/auth');
const { requireStaff } = authMiddleware;

// Public
router.get('/news/featured', newsController.getFeatured);
router.get('/news', newsController.getAll);
router.get('/news/slug/:slug', newsController.getBySlug);
router.get('/news/:id', newsController.getById);

// Admin (protected)
router.get('/admin/news/stats', authMiddleware, requireStaff, newsController.getStats);
router.get('/admin/news', authMiddleware, requireStaff, newsController.getAllAdmin);
router.post('/news', authMiddleware, requireStaff, newsController.create);
router.put('/news/:id', authMiddleware, requireStaff, newsController.update);
router.delete('/news/:id', authMiddleware, requireStaff, newsController.remove);
router.patch('/news/:id/extend', authMiddleware, requireStaff, newsController.extend);

module.exports = router;
