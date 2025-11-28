// const books = require("../data/data");
const Book = require("../models/Book");
const cloudinary = require("cloudinary");
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
    
    try {
    const { id } = req.params;
    const { title, author, year } = req.body;
    console.log("title:",title, "Author:", author, "Year",year)

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // If new image uploaded → delete old image from Cloudinary
    if (req.file) {
      const oldImageUrl = book.image;
      if (oldImageUrl) {
        const publicId = oldImageUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`book-images/${publicId}`);
      }

      // update new image url
      book.image = req.file.path;
    }

    // Update fields ONLY if provided
    if (title) book.title = title;
    if (author) book.author = author;
    if (year) book.year = year;

    await book.save();

    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: book,
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
}


const deletBook = async(req,res,next) =>{
  try {
    const {id} = req.params;
    
    const book =await Book.findById(id);
    
    if(!book){
      console.log("Book not found!");
      const error = new Error("book not found");
      error.statusCode = 404;
      return next(error);
    };

    //delete cloudniary image

    const publicId = book.image.split("/").pop().split(".")[0];

    await cloudinary.UploadStream.destroy(`book-image/${publicId}`);

    await Book.findByIdAndDelete(id);

    res.json({
      success:true,
      message:"Book + imaage deleted successfully"
    })

  } catch (error) {
    console.log("Delete Error", error);
    res.status = 500;
    error.message = "Delete failed"
    return next(error);
  }
    
    
}


module. exports  ={
    creatBook,
    getAllBooks,
    BooksByID,
    updateBook,
    deletBook
};