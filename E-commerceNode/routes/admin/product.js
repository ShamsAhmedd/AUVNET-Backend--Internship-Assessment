const express = require('express');
const adminProductController = require('../../controllers/admin/Product');
const router = express.Router();


// GET /api/admin/getAllProducts
router.get('/getAllProducts', adminProductController.getAllProducts);

// DELETE /api/admin/deleteProduct/:id
router.delete('/deleteProduct/:id', adminProductController.deleteProduct);

module.exports=router