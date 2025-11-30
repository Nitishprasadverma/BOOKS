const express = require("express");
const auth = require("../middleware/authMiddleware")
const { signup, login, refreshToken, logout, changePassword, getProfile, updateProfile, forgotPassword, resetPassword } = require("../controllers/authControllers");
const {  } = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", signup);
router.post("/login",login);
router.post("/refresh", refreshToken);
router.post("/logout",logout )
router.patch("/change-password",auth,changePassword);

//profile route
router.get("/profile", auth, getProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

//
router.put("/profile", auth, updateProfile );
module.exports = router;