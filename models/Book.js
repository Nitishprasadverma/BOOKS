const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title : {
        type:String,
        required:true,
        trim:true
    },
    author:{
        type:String,
        required:true,
        trim:true
    } ,
    description:{
        type:String,
        default :""
    },
    category:{
        type:String,
        enum: [
             "Fiction",
      "Non-Fiction",
      "Technology",
      "Programming",
      "Finance",
      "Self-Help",
      "Biography",
      "Education",
      "Other"
        ],
        required:true
    },
    price:{
        type:Number,
        default:0
    },
    
    year : {
        type:Number,
        
        required:true
    
    },
    coverImage:{
        type:String,
        required:true
    },
    pdfUrl :{
        type:String,
        required:true,
    },
    publicIdImage:{
        type:String
    },
    publicIdPdf :{
        type:String
    },

    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    ratings:[
        {
            user:{type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            rating:{type:Number,min:1,max:5}
        }
    ],
    averageRating:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    }
});

module.exports = mongoose.model("Book",BookSchema)