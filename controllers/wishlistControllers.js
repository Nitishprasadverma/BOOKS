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

         //pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        //filters

        const{search, category} = req.query;

        let bookFilter = {};

        //Title search
        if(search){
            bookFilter.title = {$regex:search,$options:"i"};
        }

        //category
        if(category){
            bookFilter.category = category;
        }

         
         const user = await User.findById(userId).populate({
            path:"wishlist",
            match:bookFilter,
            skip:skip,
            limit:limit
         });

         if(!user){
            return res.status(404).json({message:"User not found"});
         }
         const totalWishlistCount = user.wishlist.length;

         res.status(200).json({
            success:true,
            page,
            limit,
            totalWishlistCount,
            count :user.wishlist.length,
            Data:user.wishlist

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
