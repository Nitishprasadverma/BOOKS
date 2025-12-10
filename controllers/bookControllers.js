// const books = require("../data/data");
const Book = require("../models/Book");
const cloudinary = require("cloudinary");
const creatBook = async (req, res, next) => {
  try {
    const { title, author, year, category, price } = req.body;

    if (!title || !author || !year || !category || !price) {
      return res.status(400).json({
        success: true,
        message: "Title, Author, Year & Category are required",
      });
    }

    if (!req.files || !req.files.coverImage || !req.files.pdf) {
      return res.status(400).json({
        success: true,
        message: "Cover Image & PDF are requires",
      });
    }

    //Image upload

    let imageUpload;

    try {
      imageUpload = await cloudinary.uploader.upload(
        req.files.coverImage[0].path,
        {
          folder: "book-images",
          resource_type: "Image",
        }
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
        error: error.message,
      });
    }

    // PDF upload

    let pdfUpload;
    try {
      pdfUpload = await cloudinary.uploader.upload(req.files.pdf[0].path, {
        folder: "book-pdfs",
        resource_type: "raw",
        format: "pdf",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "PDF upload failed",
        error: error.message,
      });
    }

    //Create Book in DB

    const book = await Book.create({
      title,
      author,
      year,
      category,
      price: price || 0,
      coverImage: imageUpload.secure_url,
      pdfUrl: pdfUpload.secure_url,
      publicIdImage: imageUpload.public_id,
      publicIdPdf: pdfUpload.public_id,
      uploadedBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    console.log("Create book error ->", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, author, year } = req.query;

    //filter object
    let filter = {};

    //search in title
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (author) {
      filter.author = { $regex: author, $options: "i" };
    }

    if (year) {
      filter.year = Number(year);
    }

    //pagination
    const skip = (page - 1) * limit;

    //Database Query
    const books = await Book.find(filter).skip(skip).limit(Number(limit));

    const total = await Book.countDocuments(filter);

    return res.status(200).json({
      status: 200,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data: books,
    });
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

const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, year, category, price, description } = req.body;
    // console.log("title:",title, "Author:", author, "Year",year)

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // If new image uploaded → delete old image from Cloudinary
    if (req.files?.coverImage?.length > 0) {
      if (book.publicIdImage) {
        await cloudinary.uploader.destroy(book.publicIdImage);
      }

      //upload new one
      const newImage = await cloudinary.uploader.upload(
        req.files.coverImage[0].path,
        {
          folder: "book-images",
          resource_type: "image",
        }
      );

      book.coverImage = newImage.secure_url;
      book.publicIdImage = newImage.public_id;
    }

    // update pdf if new pdf is uploaded

    if (req.files?.pdf.length > 0) {
      if (book.publicIdPdf) {
        await cloudinary.uploader.destroy(book.publicIdPdf, {
          resource_type: "raw",
        });
      }

      //upload new pdf
      const newPdf = await cloudinary.uploader.upload(req.files.pdf[0].path, {
        folder: "book-pdfs",
        resource_type: "raw",
        format: "pdf",
      });

      book.pdfUrl = newPdf.secure_url;
      book.publicIdPdf = newPdf.public_id;
    }

    // Update fields ONLY if provided
    if (title) book.title = title;
    if (author) book.author = author;
    if (year) book.year = year;
    if (category) book.category = category;
    if (description !== null) book.description = description;

    if (price) book.price = price;

    //SAVE UPDATED Book
    await book.save();

    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: book,
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res
      .status(500)
      .json({ message: "Server Error", success: false, error: err.message });
  }
};

const deletBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      console.log("Book not found!");
      const error = new Error("book not found");
      error.statusCode = 404;
      return next(error);
    }

    //delete cloudniary image

    if(book.publicIdImage){
      await cloudinary.uploader.destroy(book.publicIdImage);

      console.log("Image Deleted", book.publicIdImage);
    }

// find and delete pdf

if(book.publicIdPdf){
  await cloudinary.uploader.destroy(book.publicIdPdf,{
    resource_type:"raw",
  });
  console.log("PDF deleted:", book.publicIdPdf);
}

    await Book.findByIdAndDelete(id);


    res.json({
      success: true,
      message: "Book + imaage deleted successfully",
    });
  } catch (error) {
    console.log("Delete Error", error);
    res.status = 500;
    error.message = "Delete failed";
    return next(error);
  }
};



const ratingBook = async(req,res,next) =>{


  try {
    
    const {id} = req.params;
   console.log(id);
  const {rating}  = req.body;
  const userId = req.user.id;

  if(!rating || rating < 1 || rating > 5){
    return res.status(400).json({
      message:"Rating must be between 1-5 only",
      success:false
    })
  }

  const book   = await Book.findById(id);

  if(!book){
    return res.status(400).json({
      message:"Book not found"
    })
  }

  // check if user have rated already for this book;
  const exisitngRating = book.ratings.find(
    (r) => r.user.toString() == userId
  );
  if(exisitngRating){

    //update rating as user try to rate over already rated by user
    exisitngRating.rating = rating;
  }else{

    //new rating 
    book.ratings.push({user:userId, rating})
  }

  //computing the average rating of a boook

  const total = book.ratings.reduce((sum,r) => sum + r.rating,0);

  book.averageRating = (total / book.ratings.length).toFixed(1);

  await book.save();

  return res.status(200).json({
    success:true,
    message:"Rating submitted successfully",
    averageRating:book.averageRating,
    ratings:book.ratings
  })
  } catch (error) {
    console.log("Rate Error:", err);
    return res.status(500).json({message:"Server error"});
  }
  
}
module.exports = {
  creatBook,
  getAllBooks,
  BooksByID,
  updateBook,
  deletBook,
  ratingBook
};
