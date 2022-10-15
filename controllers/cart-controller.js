const Cart = require("../models/cart-model");
const Product = require("../models/product-model");

//Create a Cart
exports.createCart = async (req, res) => {
    const owner = req.user._id;
    const { products } = req.body;
    
    console.log(products);
    
    try {
        const cart = await Cart.findOne({owner});
        for(let i = 0; i <products.length; i++) {
            const { productid, quantity } = products[i];
            const product = await Product.findOne({_id : productid}) 

            if (!product) {
              return res.status(404).send({message : "Product not found"})
            }
            const amount = product.amount;
            const name = product.name;
            if(cart){
                const productIndex = cart.products.findIndex((product) => product.productid === productid);
               
                if (productIndex > -1) {
                    let item = cart.products[productIndex];
                    item.quantity += quantity;
                    cart.cartBill = cart.products.reduce((acc, curr) => {
                        return acc + curr.quantity * curr.amount;
                    }, 0)
                cart.products[productIndex] = product;
                await cart.save();
                
                return res.status(200).send(updatedCart);
                
                } else {
                    cart.products.push({ productid, name, quantity, amount });
                    cart.cartBill = cart.products.reduce((acc, curr) => {
                        return acc + curr.quantity + curr.amount
                    }, 0);
                    await cart.save();
                return res.status(200).send(cart);
                }
            } else {

                const cartProduct = {productid, name, amount, quantity}
                
                const newCart = await Cart.create({
                    owner,
                    products : cartProduct,
                    cartBill : quantity * amount,
                })
                return res.status(201).json({
                    status: "success",
                    data : {
                        newCart
                    }
                });
            }
        } 
    
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
}

//Update Cart
exports.updateCart = async (req, res) => {
    const owner = req.user._id;
    const { productid, quantity } = req.body;

    try {
        
        
        
    } catch (error) {
        console.log(error);
        res.status(500).send("something went wrong");
    }
        
}

//Get a Cart
exports.getCart = async (req, res) => {
    const vendor = req.user._id;
    try{
        const cart = await Cart.findOne({ vendor });

        if (cart && cart.products.length > 0) {
            res.status(200).json({
                status: "success", 
                results : products.length,
                data : {
                    cart
                }
            })
        } else {
            res.status(404).json({
                status: "fail", 
               message : "null"
            })
        }
    } catch (error) {
        res.status(500).send(null);
    }
}

exports.getCarts = async (req, res) => {
    const owner = req.user._id;
    try {
        const carts = await Cart.find({ owner : owner }).sort({ date : -1 });
        if(carts) {
            return res.status(200).json({
                message : "success",
                results : carts.length,
                data : {
                    carts
                }
            })
        }
        res.status(404).send("No cart found");
    } catch (error) {
        res.status(500).send(error);
    }
};

//Delete cart
exports.deleteCart = async (req, res) => {
    const vendor = req.user._id;
    const productid = req.params.productid;

    try {
        let cart = await Cart.findOne({ owner });

        const productIndex = cart.products.findIndex((product) => product.productid == productid);

        if(productIndex > -1) {
            let product = cart.products[productIndex];
            cart.bill -= product.quantity * product.amount;
            if(cart.bill < 0) {
                cart.bill = 0
            }
        cart.products.splice(productIndex, 1);
        cart.bill = cart.products.reduce((actaul, curent) => {
            return actual + curent.quantity * current.amount;
        }, 0)
        cart = await cart.save();
        } else {
            res.status(404).json({
                status : "fail",
                message : "product not found"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).send();
    }
}

//     const product = await Product.findById({_id : products.productid});
        
    //     if(!product) {
    //         res.status(404).json({
    //             status : "fail",
    //             message : "Product not found"
    //         })
    //     return;
    //     }
    
    // const amount = product.amount;
    // const name = product.name;

    // const cart = await Cart.findOne({userid});

    // const cartProduct = {productid, name, amount, quantity}
    // //If cart already exist for user,
    // if(!cart) {
    //     //no cart exists, create one
    //     const newCart = await Cart.create({
    //         userid,
    //         products : cartProduct,
    //         cartBill : quantity * amount,
    //     })
    //     return res.status(201).json({
    //         status: "success",
    //         data : {
    //             newCart
    //         }
    //     });
    // } 