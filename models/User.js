const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role :{
        type :String,
        enum:["user", "admin"],
        default:"user"
    },
    password:{
        type:String,
        required: true
    },
    refreshToken :{type:String},
    bio :{type : String, default :""},
    avatar : {type: String, default : ""},
    resetPasswordToken : String,
    resetPasswordExpire :Date,

},{timestamps:true});



module.exports = mongoose.model("User", userSchema);
