const isAdmin = (req,res,next) =>{
    if(req.user.role !== "admin"){
        return res.status(403).json({message:"Access is denied. Admin only"});
    }
    next();
}

 module.exports = isAdmin