const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
}, {
  timestamps: true
});

wishlistSchema.index({ user: 1, product: 1 }, { unique: true });
const Wishlist = mongoose.model("wishlist", wishlistSchema);

module.exports = Wishlist;
