const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryTasks
} = require('../controllers/categoryController');

// Apply authentication middleware to all category routes
router.use(authenticate);

// Category routes
router.post('/', createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.get('/:id/tasks', getCategoryTasks);

module.exports = router;