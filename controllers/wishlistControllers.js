const Book = require("../models/Book");

const User = require("../models/User");


//Add book to wishlist

const addToWishlist = async(req,res,next) =>{

    try {
        const bookId = req.params.id;
        const userId = req.user.id;

        const book  = await Book.findById(bookId);

        if(!book) return res.status(404).json({
            message:"Book not found"
        });

        const user = await User.findById(userId);

        if(!user) return res.status(404).json({
            message:"User doesn't exit"
        })

        if(user.wishlist.includes(bookId)){
            return res.status(400).json({
                message:"Book already in wishlist"
            });
        }

        user.wishlist.push(bookId);
        await user.save();

        res.status(200).json({
            success:true,
            message:"Added to wishlist"
        });
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}


//Remove from wishlist

const removeFromWishlist = async(req,res,next) =>{
    try {
        const bookId = req.params.id;
        const userId = req.user.id;

        const user = await User.findById(userId);

        user.wishlist = user.wishlist.filter(id => id.toString() !== bookId);
        await user.save();

        res.status(200).json({
            success:true,
            message:"Remove from wishlist"
        });
    } catch (error) {
         res.status(500).json({
            message:error.message
         })
    }
}


//get all wishlisted book

const getWishlist = async (req,res) =>{
    try {
         const userId = req.user.id;

         const user = await User.findById(userId).populate("wishlist");

         res.status(200).json({
            success:true,
            count :user.wishlist.length,

         });
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
}