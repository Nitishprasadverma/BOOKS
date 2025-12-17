const express = require("express");
const auth = require("../middleware/authMiddleware");

const {addComment,getBookComments} = require("../controllers/commentControllers");

const router = express.Router();

router.post("/books/:id/comments", auth,addComment); 
router.get("/books/:id/comments", getBookComments)



module.exports = router;