
const multer = require("multer");
const cloudinary = require("../config/cloudniary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: (req, file) => {
//         if (file.fieldname === "coverImage") {
//             return {
//                 folder: "book-images",
//                 allowed_formats: ["jpg", "jpeg", "png"]
//             };
//         } else if (file.fieldname === "pdf") {
//             return {
//                 folder: "book-pdfs",
//                 resource_type: "raw",
//                 allowed_formats: ["pdf"]
//             };
//         }
//     }
// });

const uploadFiles = multer({
    storage: multer.diskStorage({})  // store temp files locally
}).fields([
    { name: "coverImage", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
]);

module.exports = { uploadFiles };
