const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middleware/auth');

// Public
router.get('/news/featured', newsController.getFeatured);
router.get('/news', newsController.getAll);
router.get('/news/:id', newsController.getById);
router.get('/news/slug/:slug', newsController.getBySlug);

// Admin (protected)
router.get('/admin/news/stats', authMiddleware, newsController.getStats);
router.get('/admin/news', authMiddleware, newsController.getAllAdmin);
router.post('/news', authMiddleware, newsController.create);
router.put('/news/:id', authMiddleware, newsController.update);
router.delete('/news/:id', authMiddleware, newsController.remove);
router.patch('/news/:id/extend', authMiddleware, newsController.extend);

module.exports = router;
