const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const Token = require("../models/token-model");
const { createToken } = require("../middleware/authMiddleware");
const handleError = require("../errorHandlers/errors");
const crypto = require("crypto");
const cookie = require("cookie-parser");

//cookie-parser expiry date
const maxAge = 3 * 24 * 60 * 60;

//Creat account for user
exports.signUp = async (req, res) => {
    try{
        const {fullname, password, confirmPassword, email, role} = req.body;
        if(password !== confirmPassword){
            res.status(400).json({message : "Wrong Password Confirmation input"})
        }
        const salt = await bcrypt.genSalt(10);

        if(password === confirmPassword && password.length > 5){
            const hash = await bcrypt.hash(password, salt);
            const user = await User.create({
                fullname, 
                password : hash,
                confirmPassword : hash, 
                email,
                role
            });
             
            const token = createToken(user._id);
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000 })
            await new Token({
                userId: user._id,
                token: token,
                createdAt: Date.now(),
            }).save();
            return res.status(201).json({
                status : "success",
                token,
                data : {
                    user
                }
            });
        }
        return res.status(400).json({message : "Password is less than 6 characters"})
    }catch (error) {
        const errors = handleError(error)
        res.status(404).json({ errors });
    }
}

//Log user in
exports.signIn = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if(!user) {
            res.status(401).json({
                status: "fail",
                message: "Invalid email or password",
            });
        }

        if(user) {
            const auth = await bcrypt.compare(password, user.password);
            if(auth) {
                const token = await createToken(user._id);
                res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000 })
                res.status(200).json({
                  status: "success",
                  token,
                  data: {
                    user,
                  },
                });    
        }else {
            res.status(401).json({
                status: "fail",
                message: "Invalid email or password",
                });
            }
        }
    }catch (err) {
        const errors = handleError(err)
        res.status(400).json({
            status: "fail",
            message: errors,
        });
    } 
}

//Logout
exports.logout = async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();
        res.status(200).json({"message" : "You've successfully logged out"});
    } catch (error) {
        res.status(404).json({"message" : "Account not logged out"});
    }
};

const requestPasswordReset = async (email) => {
    try{
        const user = await User.findOne({email});
    
        if (!user) return ({message : "User does not exist"});
        let token = await Token.findOne({ userId: user._id });
        if (token) await token.deleteOne();
        let resetToken = crypto.randomBytes(32).toString("hex");
    
        const tokenReset = await new Token({
            userId: user._id,
            token: resetToken,
            createdAt: Date.now(),
        }).save();
        
        return tokenReset
    }catch (error) {
        res.status(400).json({message : error});
    }
}

const resetPassword = async (userId, token, password) => {
    try{
        const passwordResetToken = await Token.findOne({ userId });
        if (!passwordResetToken) {
            return res.status(400).json({"message" : "Invalid or expired password reset token"});
        }
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
            await User.updateOne(
                { _id: userId },
                { $set: { password: hash } },
                { new: true }
            );
    
        return res.status(200).json({"message" : "You have successfully updated your Password."});
    } catch (error) {
        res.status(400).json({message : error});
    }
};

  
  
exports.resetPasswordRequestController = async (req, res, next) => {
    try{
        const requestPasswordResetService = await requestPasswordReset(
            req.body.email
        );
        return res.status(200).json(requestPasswordResetService);
    } catch (error) {
        res.status(400).json({message : error});
    }

};
  
exports.resetPasswordController = async (req, res, next) => {
    try{
        const resetPasswordService = await resetPassword(
            req.body.userId,
            req.body.token,
            req.body.password
        );
        return res.status(200).json(resetPasswordService);
    } catch (error) {
        res.status(400).json({message : error});
    }
};
