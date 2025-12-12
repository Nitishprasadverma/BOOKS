const express = require("express");
const auth  = require("../middleware/authMiddleware");

const {addToWishlist,removeFromWishlist,getWishlist} = require("../controllers/wishlistControllers");




const router = express.Router();

//ADd book to wishlist

router.post("/books/:id/wishlist", auth,addToWishlist);

//remove
router.delete("/books/:id/wishlist", auth, removeFromWishlist);

//get logged in user wishlist
router.get("/user/wishlist", auth,getWishlist);

module.exports = router;