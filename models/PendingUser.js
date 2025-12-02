const mogoose = require("mongoose");

const pendingUSersSchema = new  mogoose.Schema({
    name:{type:String, required:true},

    email:{
        type: String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:["user","admin"],
        default: "user"
    },

    otp:{type:String, 
        required: true
    },
    otpExpires:{
        type:Date,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires:86400

    }
});

module.exports = mogoose.model("PendingUser", pendingUSersSchema);