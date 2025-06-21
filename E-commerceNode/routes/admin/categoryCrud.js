const express = require('express');

const CategoryController = require('../../controllers/admin/CategoryCrud');

const router = express.Router();

// /api/admin/addCategory 
router.post('/addCategory', CategoryController.addCategory);

// /api/admin/rootCategories
router.get('/rootCategories', CategoryController.getRootCategory);

// /api/admin/childrenCategories/:id
router.get('/childrenCategories/:id',CategoryController.getChildrenCategories);

// /api/admin/allCategories
router.get('/allCategories', CategoryController.getAllCategory);

// /api/admin/updateCategory/:id
router.put('/updateCategory/:id',CategoryController.updateCategory);

// /api/admin/deleteCategory/:id
router.delete('/deleteCategory/:id',CategoryController.deleteCategory);

module.exports=router;