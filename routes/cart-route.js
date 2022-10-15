const express = require("express");
const cartController = require("../controllers/cart-controller");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { createCart, getCarts, updateCart, deleteCart} = cartController;

router
    .route("/:id")
    .patch(auth, updateCart)
    .delete(auth, checkUser("vendor", "user"), deleteCart)
    

router
    .route("/")
    .post(auth, createCart)
    .get(auth, getCarts);

module.exports = router;
