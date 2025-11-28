const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


//Singup

const signup = async (req,res,next) =>{
    try {
        const {name,email,password,role} = req.body;

        //check existing user
        const exists = await User.findOne({email});
        if(exists){
            return res.status(400).json({message: "Email already registered"});
        }

        const hashedPass = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            role,
            password:hashedPass
        })

        res.status(201).json({
            message: "User created successfully",
            user :{
                id: user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })
    } catch (error) {
        next(error);
    }
}


//LOGIN

const login = async (req,res,next) =>{
    try {
        const {email,password} = req.body;

        //find user
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid email"});

        //compare password
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid password"});
        }
        const accessToken = jwt.sign(
            {id:user._id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn: "10min"}
        );

        const refreshToken = jwt.sign(
            {id:user._id,role:user.role},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn:"7d"}
        )
       user.refreshToken = refreshToken;
       await user.save();
        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user :{
                id:user._id,
                name:user.name,
                email:user.email
            }
        })
    } catch (error) {
        next(error);
    }
}


const refreshToken = async (req,res) =>{

    try {
        const {refreshToken} = req.body;

        console.log("REFRESH TOKEN", refreshToken)
    
    if(!refreshToken){
        return res.status(401).json({message:"Refresh token missing"});
    }

    const user = await User.findOne({refreshToken});
    if(!user){
        return res.status(403).json({message: "Invalid refresh token"});
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    
    const newAccessToken = jwt.sign(
        {id:user._id, role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:"2min"}
    );

    return res.json({
        message:"New access token",
        accessToken :newAccessToken.trim()
    })
    } catch (error) {
        return res.status(403).json({message:"Invalid refresh token"})
    }
    
        
}


const logout = async (req,res,next) => {
try {
    const {refreshToken} = req.body;

    if(!refreshToken){
        return res.status(400).json({message: "Refresh token required"})
    }

    //checking with the user this refresh token
    const user = await User.findOne({refreshToken});

    if(!user){
        return res.status(400).json({message:"Invalid refresh token"})
    }
    //Remove refresh token

    user.refreshToken = null;
    await user.save();

    return res.json({message:"Logged out successfully"});
} catch (error) {
    console.log("Error inside logout", error);
    return res.status(500).json({message:"Server error",
        error:error
    })
}
}

const changePassword = async (req, res, next) => {
  try {
    // Logged-in user's ID coming from auth middleware
    const userId = req.user.id;

    // Extract passwords from body
    const { oldPassword, newPassword } = req.body;

    // Validate required fields
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old & new password required" });
    }

    // Fetch user including the hidden password field
    const user = await User.findById(userId).select("+password");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare old password with hashed password in DB
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    // If old password is wrong
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    // Hash and update new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Save user with updated password
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = {
    signup,
    login,
    refreshToken,
    logout,
    changePassword
}