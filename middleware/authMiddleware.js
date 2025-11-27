const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next) =>{
    const token  = req.headers.authorization?.trim();
    // console.log("token:",req.params)
console.log("Authorization: ", token)
    if(!token) {
        return res.status(401).json({message: "No token, access denied"});
    }
 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded", decoded)
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Error in auth middleware",error);
        return res.status(401).json({message:"Invalid Token",
            error: error
        });
    }
}

module.exports = authMiddleware;