const express = require("express");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/authRoutes");
const wishlistRoutes = require("./routes/wishlist")
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandlers");

require("dotenv").config();

const app = express();
app.use(express.json());



//routes
app.use("/api", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/api",wishlistRoutes );
//Error Handler Middleware
app.use((err,req,res,next) =>{
    console.log("MULTER ERROR", err);
    next(err);
})
app.use(errorHandler);
app.use("/uploads", express.static("uploads"));

connectDB();

app.listen(3000, () => console.log("Server on 3000"));
