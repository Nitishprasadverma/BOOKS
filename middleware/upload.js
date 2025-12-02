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



module.exports = multer({storage});