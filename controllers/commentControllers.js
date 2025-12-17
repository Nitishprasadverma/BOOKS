const Comment = require("../models/Comment");

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const bookId = req.params.id;

    if (!text) {
      return res.status(400).json({
        message: "Comment text are required",
      });
    }

    const comment = await Comment.create({
      book: bookId,
      user: req.user.id,
      text,
    });

    res.status(201).json({
      success: true,
      size: comment.length,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getBookComments = async (req,res) =>{

    try {
         const page = Number(req.query.page) || 1;
         const limit = Number(req.query.limit) || 5;
         const skip = (page - 1) * limit;

         const comments = await Comment.find({book: req.params.id}).populate("user", "name avatar").sort({createdAt: -1}).skip(skip).limit(limit);
   console.log("comments in getcomment", comments)
         const total = await Comment.countDocuments({book: req.params.id});

         res.json({
            success:true,
            page,
            total,
            data:comments
         })


    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}

module.exports = {
  addComment,
  getBookComments,
  // updateComment,
  // deleteComment
};
