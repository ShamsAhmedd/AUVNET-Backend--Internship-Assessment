const express = require('express');
const userWishList = require('../../controllers/user/wishlist');
const auth = require("../../middlewares/auth");
const router = express.Router();

// POST /api/user/addToWishList
router.post('/addToWishList', auth, userWishList.addToWishlist);

// GET /api/user/getWishList
router.get('/getWishList',auth, userWishList.getWishlist);

// DELETE /api/user/removeFromWishList/:productId
router.delete('/removeFromWishList/:productId', auth, userWishList.removeFromWishList);

module.exports = router;
