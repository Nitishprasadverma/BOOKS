// const books = require("../data/data");
const Book = require("../models/Book");

const creatBook = async (req, res, next) => {
  try {
    const { title, author, year} = req.body;
 const imageUrl = req.file ? req.file.path : null;
 console.log(imageUrl);
    if (!title || !author || !year) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const book = await Book.create({ title, author, year,
    image: imageUrl
     });
    res.status(201).json({
        message:"Book created successfully",
        data:book
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({error: error})
    // next(error);
  }
};
const getAllBooks = async (req, res, next) => {

    try {
        const {page = 1, limit = 10, search, author, year} = req.query;

        //filter object
        let filter = {};

        //search in title
        if(search){
            filter.title = {$regex:search, $options: 'i'};
        }

        if(author){
            filter.author = {$regex:author,$options:"i"};
        }

        if(year){
            filter.year = Number(year);
        }

        //pagination
        const skip = (page - 1) *limit;

        //Database Query
        const books = await Book.find  (filter).skip(skip).limit(Number(limit));

        const total = await Book.countDocuments(filter);

        return res.status(200).json({
            status:200,
            total,
            currentPage : Number(page),
            totalPages: Math.ceil(total /limit),
            data:books
        })


    } catch (error) {
        next(error);
    }
//   try {
//     const books = await Book.find();
//     if (!books) {
//       const error = new Error("Book not found");
//       error.statusCode = 404;
//       return next(error);
//     }
//     res.json(books);
//   } catch (err) {
//     next(err);
//   }
};

const BooksByID = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      const error = new Error("Book not found");
      error.statusCode = 404;
      return next(error);
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
};

const updateBook = async(req,res,next) =>{
    const {id} = req.params;
    const updateData = req.body;

    try{
        const book = await Book.findByIdAndUpdate(id,updateData, {new: true});
        if(!book){
            const error = new Error("Book not found");
      error.statusCode = 404;
      return next(error);
        }
        return res.status(200).json({
            status:200,
            message:"updated successfully",
            data:book
        });
    }catch(err){
        err.statusCode = 500;
        return next(err);
    }
}


const deletBook = async(req,res,next) =>{
    const {id} = req.params;
    
    const book =await Book.findByIdAndDelete(id)
    res.send("Book deleted");
}


module. exports  ={
    creatBook,
    getAllBooks,
    BooksByID,
    updateBook,
    deletBook
};