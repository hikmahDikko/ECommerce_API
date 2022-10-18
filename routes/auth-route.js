const authController = require("../controllers/auth-controller");
const express = require("express");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

const { signIn, signUp, resetPasswordRequestController, resetPasswordController,  logout } = authController;


router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/logout/:id", auth, logout);

router.route("/").patch(resetPasswordRequestController).post(resetPasswordController);

module.exports = router;



