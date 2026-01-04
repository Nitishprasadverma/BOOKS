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


const updateComment = async (req,res) =>{
  try {
    const {commentId} = req.params;
    const {text} = req.body;

    if(!text){
      return res.status(400).json({
        message:"Comment text required"
      });
    }

    const comment = await Comment.findById(commentId);

    if(!comment){
      return res.status(404).json({message:"Comment not found"});
    }

    //Ownership check
    if(comment.user.toString() !== req.user.id && req.user.role !== "admin"){
      return res.status(403).json({message:"Not allowed"});
    }

    comment.text = text;
    await comment.save();

    res.status(200).json({
      success:true,
      message:"Comment updated",
      data:comment
    })

    
  } catch (error) {
    res.status(500).json({message:error.message});
  }
}


const deleteComment = async (req,res) =>{
  try {
    const {commentId} = req.params;
    const comment = await Comment.findById(commentId);

    if(!comment){
      return res.status(404).json({
        message:"Comment not found"
      })
    }

    if(comment.user.toString() !== req.user.id && req.user.role !== "admin"){
      return res.status(403).json({message:"Not allowed"});
    }

    await comment.deleteOne();

    res.status(200).json({
      success:true,
      message:"Comment deleted"
    })
  } catch (error) {
    res.status(500).json({
      message:error.message
    });
  }
}

module.exports = {
  addComment,
  getBookComments,
  updateComment,
  deleteComment
};
