const express = require("express");
const productController = require("../controllers/product-controller");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { uploadProduct, getOneProduct, updateProduct, deleteProduct, getAll } =   productController;

router
    .route("/:id")
    .get(auth, getOneProduct)
    .put(auth, checkUser("vendor"), updateProduct)
    .delete(auth, checkUser("vendor", "admin"), deleteProduct)

router.route("/").get(auth, getAll).post(auth, checkUser("vendor"), uploadProduct);

module.exports = router;
