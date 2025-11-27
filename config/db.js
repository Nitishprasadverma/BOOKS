const mongoose = require("mongoose");
require("dotenv").config();


const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("MongoDB Connected");
    }catch(err){
        console.log("DB Error", err);
    }
}

module.exports = connectDB;