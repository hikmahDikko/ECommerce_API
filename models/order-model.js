const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema({
    cart : [{
        type : ObjectID,
        ref : "Cart"
        //required : [true, "Please input the cart ID"]
    }],
    userid : {
        type : ObjectID,
        ref : "User",
        //required : [true, "Please input your unique ID"]
    },
    address : {
        type : String,
        required : [true, "Please enter your address"]
    },
    totalBill : {
        type : Number,
        default : 0
    }
});

orderSchema.pre("save", function (next) {
    this.populate({
      path: "cart",
      select: "products",
    });
    next();
  });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;