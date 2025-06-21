const asyncHandler = require("express-async-handler");
const { Product } = require("../../models/Product");

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("category", "name");
  res.json(products);
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) return res.status(404).json({ error: "Product not found" });

  await product.deleteOne();
  res.json({ message: "Product deleted successfully" });
});

module.exports = { getAllProducts, deleteProduct };
