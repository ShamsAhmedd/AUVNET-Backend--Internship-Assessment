const asyncHandler = require("express-async-handler");
const { Product, validateAddProduct, validateUpdateProduct } = require("../../models/Product");
const mongoose = require('mongoose'); 

// Add Product
const addProduct = asyncHandler(async (req, res) => {

  const { error } = validateAddProduct(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const product = new Product({
    ...req.body,
    owner: req.user._id.toString(), 
  });

  const saved = await product.save();
  res.status(201).json(saved);
});

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("owner", "username")
    .populate("category", "name");
  res.json(products);
});


//Get user product
const getUserProducts = asyncHandler(async (req, res) => {

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized: User not found in request" });
    }

    const products = await Product.find({ owner: req.user._id })
      .populate("category", "name");

      res.json(products);
});

// Get products by category
const getProductsByCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;
  const products = await Product.find({ category: categoryId })
    .populate("owner", "username")
    .populate("category", "name");
  res.json(products);
});

// Update Product (only if owner)
const updateProduct = asyncHandler(async (req, res) => {

  const { error } = validateUpdateProduct(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  if (product.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Not authorized" });
  }

  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
});

// Delete Product (only if owner)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ error: "Product not found" });

  if (product.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Not authorized" });
  }

  await product.deleteOne();
  res.json({ message: "Product deleted successfully" });
});

module.exports = {addProduct,getAllProducts,getUserProducts,getProductsByCategory,updateProduct,deleteProduct};
