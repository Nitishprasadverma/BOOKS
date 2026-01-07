const express = require("express");
const auth = require("../middleware/authMiddleware");

const {addComment,getBookComments, updateComment, deleteComment, addReply} = require("../controllers/commentControllers");

const router = express.Router();

router.post("/books/:id/comments", auth,addComment); 
router.get("/books/:id/comments", getBookComments)

router.put("/comments/:commentId",auth,updateComment);

router.delete("/comments/:commentId",auth,deleteComment);

router.post("/comments/:commentId/reply", auth, addReply);


module.exports = router;