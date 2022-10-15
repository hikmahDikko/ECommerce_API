const express = require("express");
const productController = require("../controllers/product-controller");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { uploadProduct_post, getOneProduct, updateProduct, deleteProduct, getAll } =   productController;

router
    .route("/:id")
    .get(getOneProduct)
    .put(auth, checkUser("vendor"), updateProduct)
    .delete(auth, checkUser("vendor", "admin"), deleteProduct)

router.route("/").get(getAll).post(auth, checkUser("vendor"), uploadProduct_post);

module.exports = router;
