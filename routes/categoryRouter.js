const router = require('express').Router();
const CategoryController = require('../controllers/categoryController');

router.get('/categories', CategoryController.getCategories);

module.exports = router;