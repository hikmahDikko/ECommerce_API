const express = require("express")
const Flutterwave = require("flutterwave-node-v3");
const Order = require("../models/order-model");
const Cart = require("../models/cart-model");
const User = require("../models/user-model");

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

exports.checkoutOrder = async (req, res) => {
    try {
        const userid = req.user._id;
        let payload = req.body;

        let cart = await Cart.findOne({userid});
        let user = req.user;
        
        if(cart) {
            payload = {...payload, amount : cart.cartBill, email : user.email,};
            const response = await flw.Charge.card(payload);
            if (response.meta.authorization.mode === 'pin') {
                let payload2 = payload
                payload2.authorization = {
                    "mode": "pin",
                    "fields": [
                        "pin"
                    ],
                    "pin": 3310
                }
                const reCallCharge = await flw.Charge.card(payload2)

                // Add the OTP to authorize the transaction
                const callValidate = await flw.Charge.validate({
                    "otp": "12345",
                    "flw_ref": reCallCharge.data.flw_ref
                })
                
                if(callValidate.status === 'success') {
                    const order = await Order.create({
                        userid,
                        address: req.body.address,
                        cart : cart._id,
                        totalBill : cart.cartBill, 
                })
                    
                const data = await Cart.findByIdAndDelete({_id : cart._id});
                return res.status(201).send({
                    status : "Payment successfully made",
                    order
                })
                } if(callValidate.status === 'error') {
                    res.status(400).send("please try again");
                }
                else {
                    res.status(400).send("payment failed");
                }
            }

            
            if (response.meta.authorization.mode === 'redirect') {
    
                var url = response.meta.authorization.redirect
                open(url)
            }
        } else {
            res.status(400).send("Cart not found");
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}

exports.getOrders = async (req, res) => {
    const owner = req.user._id;
    try {
        const orders = await Order.find({ owner : owner }).sort({ date : -1 });
        if(orders) {
            return res.status(200).json({
                message : "success",
                results : order.length,
                data : {
                    orders
                }
            })
        }
        res.status(404).send("No orders found");
    } catch (error) {
        res.status(500).send(error);
    }
};