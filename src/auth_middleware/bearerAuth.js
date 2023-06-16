const jwt = require("jsonwebtoken");
// const {unless} = require("express-unless");
require("dotenv/config");
const secret = process.env.SECRET;
const { User } = require("../models/user");
const bearerAuth = async (req, res, next) => {
    let payload;

    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(" ").pop();
            // if the token with the secret verified jwt will return the decoded payload wich we use it to sign the token in the sign in. on of them is the user info
            // and if the token not verified it will throw an error, so i use cacth to get the error and pass it to the error handler.
            payload = jwt.verify(token, secret);
        } catch (error) {
            // error may happen here "invalid token"
            next(error);
            // to stop excute the remain code if i does not use it i will wxcute the code after else and return an error since payload does not contain any thing in this case.
            return;
        }
    } else {
        next({ name: "Unauthorized" });
        return;
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) return res.status(400).send("User not found");
    req.user = user;
    next();
};
// bearerAuth.unless = unless;

exports.bearerAuth = bearerAuth;
const adminCheck=(req,res,next)=>{
    if (!req.user.isAdmin) return next({ name: "Unauthorized User" });
    next()
}
exports.adminCheck=adminCheck;