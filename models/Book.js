const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title : String,
    author: String,
    year : Number,
    image :{
        type: String,
        require :false
    }
});

module.exports = mongoose.model("Book",BookSchema)