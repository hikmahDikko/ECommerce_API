const User = require("../models/user-model");
const handleError = require("../errorHandlers/errors");

//Get All Users
exports.getAll = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
          results: users.length,
          data: {
            users,
          },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
}

//Get one user
exports.getOne = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json({
        data: {
          user,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error,
      });
    }
};

//Delete user account
exports.deleteUser = async (req, res) => {
    try {
        const del = await User.findByIdAndDelete(req.params.id);

        if(del) {
            return res.status(201).send({
                status : true,
                message : "Account successfully deleted"
            });
        }else{
            return res.status(404).send({
                status : false,
                message : "Account cannot be fetched"
            })
        }
    }catch (err) {
        const errors = handleError(err)
        res.status(400).json({ errors });
    }
}