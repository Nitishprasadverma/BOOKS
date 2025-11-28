const express = require("express");
const auth = require("../middleware/authMiddleware")
const { signup, login, refreshToken, logout, changePassword } = require("../controllers/authControllers");
const {  } = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", signup);
router.post("/login",login);
router.post("/refresh", refreshToken);
router.post("/logout",logout )
router.patch("/change-password",auth,changePassword)

module.exports = router;