const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const {CloudinaryStorage}  = require("multer-storage-cloudinary")


const storage = new CloudinaryStorage({
    cloudinary :cloudinary,
    params : {
        folder:"book-images",
        allowed_formats:["jpg","jpeg","png"]
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



const upload = multer({storage});
module.exports = upload;