const express = require('express');
const userProductController = require('../../controllers/user/product');
const auth = require("../../middlewares/auth");
const router = express.Router();

// POST /api/user/addProduct
router.post('/addProduct', auth, userProductController.addProduct);

// GET /api/user/getAllProduct
router.get('/getAllProduct', userProductController.getAllProducts);

// GET /api/user/getUserProduct
router.get('/getUserProduct', auth, userProductController.getUserProducts);

// GET /api/user/getProductByCategory/:categoryId
router.get('/getProductByCategory/:categoryId', userProductController.getProductsByCategory);

// PUT /api/user/updateProduct/:id
router.put('/updateProduct/:id', auth, userProductController.updateProduct);

// DELETE /api/user/deleteProduct/:id
router.delete('/deleteProduct/:id', auth, userProductController.deleteProduct);

module.exports = router;
