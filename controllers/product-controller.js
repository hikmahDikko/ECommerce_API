const Product = require("../models/product-model")

//handle errors
const handleError = (err) => {
    console.log(err.message);
    let errors = { owner : "", name : "", description : "", amount : "", quantity : "", productImage : ""};
    
    //validate errors
    if(err.message.includes('Product validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
        
    }

    return errors;
}

//Upload a product
exports.uploadProduct_post = async (req, res) => {
    try {
        req.body.owner = req.user._id;
        const product = await Product.create(req.body);
        return res.status(200).send({
            status : true,
            meassage : "Successfully uploaded a product",
            data : {
                product
            }
        });
          
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    } 
}

//Get all Products
exports.getAll = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            status : true,
            results : products.length,
            data : {
                products
            }
        })   
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    }
}

//Get a product
exports.getOneProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json({
            status: "success",
            data: {
                product
            }
        });
    } catch (err) {
        const errors = handleError(err)
        res.status(400).json({ errors });
    }
};

//Update a Product
exports.updateProduct = async (req, res) => {
    try {
        const vendor = await Product.findById(req.params.id);
        if (!vendor) {
          return res.status(400).json({
            status: "fail",
            message: `There is no product from the vendor with the ID ${req.params.id}`,
          });
        }
        const description = req.body.description === undefined ? product.description : req.body.description;
        const name =
          req.body.name === undefined ? product.name : req.body.name;
        const quantity =
          req.body.quantity === undefined ? product.quantity : req.body.quantity;
        const amount =
          req.body.amount === undefined ? product.amount : req.body.amount;
        const update = { name, description, amount, quantity };
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, update);
        res.status(200).json({
          status: "success",
          data: {
            product: updatedProduct,
          },
        });
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    }
}

//Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        
        const delProduct = await Product.findByIdAndDelete(req.params.id);
    
        if(delProduct) {
            return res.status(201).send({
                status : true,
                message : "Product successfully deleted"
            });
        }else{
            return res.status(404).send({
                status : false,
                message : "Product cannot be fetched"
            })
        }
        
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    }
}