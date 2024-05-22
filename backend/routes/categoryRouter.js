const express = require('express');
const isAuthenticated = require('../middlewares/isAuth');
const categoryController = require('../controllers/categoryController');

const categoryRouter = express.Router();

// Creating Category
categoryRouter.post('/create', isAuthenticated, categoryController.createCategory);

// Reading Category
categoryRouter.get('/lists', isAuthenticated, categoryController.readingCategory);

// Updating Category
categoryRouter.put('/update/:id', isAuthenticated, categoryController.updateCategory);

// Deleting Category
categoryRouter.delete('/delete/:id', isAuthenticated, categoryController.deleteCategory);

module.exports = categoryRouter;