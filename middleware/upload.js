const multer = require("multer");
const cloudinary = require("../config/cloudniary");
const {CloudinaryStorage}  = require("multer-storage-cloudinary")


const storage = new CloudinaryStorage({
    cloudinary :cloudinary,
    params : {
        folder:"book-images",
        allowedFormats:["jpg","jpeg","png"]
    }
});

// const path = require("path");

// const storage = multer.diskStorage({
//     destination :function (req,file,cb){
//         cb(null,"uploads/");
//     },
//     filename : function (req,file,cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });




module.exports = multer({storage});