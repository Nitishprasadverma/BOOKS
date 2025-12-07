const express = require("express");
const Book = require("../models/Book");

const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin")

const route = express.Router();

const { BooksByID, getAllBooks, creatBook, updateBook, deletBook } = require("../controllers/bookControllers");
const { uploadFiles, imageUpload } = require("../middleware/upload");


route.post("/books",auth,isAdmin ,uploadFiles, creatBook);

//get all books
route.get("/books",getAllBooks);

//Get a single book by ID
route.get("/books/:id",BooksByID)


//Update
route.patch("/books/update/:id",auth,isAdmin, uploadFiles,updateBook);
//Delete book
route.delete("/books/delete/:id",auth,isAdmin, deletBook);

// route.post("/books/upload", auth,isAdmin,
//     upload.single("image"),
    
// )

module.exports = route;