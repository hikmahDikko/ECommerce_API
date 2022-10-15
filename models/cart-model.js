const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema({
    owner : {
        type : ObjectID,
        ref : "User",
        required : [true, "Please input the product vendor ID"]
    },
    products : [{
        productid : {
            type : ObjectID,
            ref : "Product",
            required : [true, "Please enter the product ID"]
        },
        name : String,
        quantity : {
            type : Number,
            required : [true, "Please enter the quantity number"],
            min : 1,
            default : 1
        },
        amount : Number,
    }],
    cartBill : {
        type : Number,
        default : 0
    },
}, {
    timestamps : true
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;