const express = require("express");
const Book = require("../models/Book");
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin")

const route = express.Router();

const { BooksByID, getAllBooks, creatBook, updateBook, deletBook } = require("../controllers/bookControllers")


route.post("/books",auth,isAdmin , upload.single("image"), creatBook);

//get all books
route.get("/books",getAllBooks);

//Get a single book by ID
route.get("/books/:id",BooksByID)


//Update
route.patch("/books/update/:id",updateBook)
//Delete book
route.delete("/books/delete/:id", deletBook)

// route.post("/books/upload", auth,isAdmin,
//     upload.single("image"),
    
// )

module.exports = route;