const asyncHandler = require("express-async-handler");
const Wishlist = require("../../models/wishlist");
const {Product} = require("../../models/Product");

// Add a product to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "ProductId is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const exists = await Wishlist.findOne({ user: userId, product: productId });
    if (exists) {
      return res.status(400).json({ error: "Product already in wishlist" });
    }

    const wishlistItem = new Wishlist({ user: userId, product: productId });

    await wishlistItem.save();

    res.status(200).json({
      message: "Product added to wishlist successfully",
      wishlistItem,
    });
  
});

// Remove a product from wishlist
const removeFromWishList = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;

  const removed = await Wishlist.findOneAndDelete({ user: userId, product: productId });

  if (!removed) {
    return res.status(404).json({ error: "Product not found in your wishlist" });
  }

  res.status(200).json({ message: "Product removed from wishlist" });
});

// Get the current user's wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.find({ user: userId })
    .populate({
      path: 'product',
      populate: {
        path: 'category',
        select: 'name',
      },
    });

  res.status(200).json(wishlist);
});

module.exports = {addToWishlist,removeFromWishList,getWishlist};
