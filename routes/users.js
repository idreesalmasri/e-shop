const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const SECRET = process.env.SECRET;
const { bearerAuth, adminCheck } = require("../auth_middleware/bearerAuth");
// router.use(
// bearerAuth.unless({
// In the unless function, you can directly use an object with url and methods properties instead of using the path keyword.
// you can put array of routes as url value if these routes have same method to be excluded.
// { url: ["/signin",'/signup'], method: ["OPTIONS", "POST"] }
// path: [
// "/users/secretStuff", //here the route will be excluded from the middleware for all kind of requests
// { url: "/users/signin", methods: ["OPTIONS", "POST"] }, // if we want to specify a specific kind of requests we should use this structure.
// { url: "/users/signup", methods: ["OPTIONS", "POST"] },
// ],
//   })
// );
router.get("/", bearerAuth,adminCheck, async (req, res, next) => {
    try {
        const usersList = await User.find().select("-hashedPassword");
        if (!usersList.length) return res.status(404).json("no users found");
        res.status(200).json(usersList);
    } catch (error) {
        next(error);
    }
});
// router.get("/secretStuff", bearerAuth,adminCheck, (req, res, next) => {
//     res.status(200).send("Authorized");
// });

router.get("/byId/:id",bearerAuth,adminCheck, async (req, res, next) => {
    try {
        let id = req.params.id;
        const user = await User.findById(id).select("-hashedPassword");
        if (!user) return res.status(400).send("invalid user id, not found");
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

router.post("/signup", async (req, res, next) => {
    try {
        const user = req.body;
        //The bcrypt.hash() function returns a promise
        const hashedPassword1 = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            hashedPassword: hashedPassword1,
            isAdmin: user.isAdmin,
            country: user.country,
            city: user.city,
            street: user.street,
            appartment: user.appartment,
        });
        const created = await newUser.save();
        console.log(created);
        // const{hashedPassword,...restUserInfo}=created;
        res.status(201).json(restUserInfo);
    } catch (error) {
        next(error);
    }
});

router.post("/signin", async (req, res, next) => {
    const input = req.body;
    try {
        // findOne first param is the property name and the second param is the desired value
        const user = await User.findOne({ email: input.email });
        // By default, virtual properties are not displayed in the console log because they are not actually present as physical properties in the document.
        // mean if i console the user, the virtual props will not appear but i still can access it and use it.
        // console.log(user);
        if (!user) return res.status(403).send("Invalid Email");
        // The bcrypt.compare() function returns a promise
        // If the plain text value matches the hashed value, bcrypt.compare() will return true. If they do not match, it will return false.
        // bcrypt.compare() first param is the inserted password and the second one is the saved hashed password
        const valid = await bcrypt.compare(input.password, user.hashedPassword);
        if (valid) {
            // The jwt.sign payload(first param) needs to be an object or a JSON-compatible value. i cant use the value directly like jwt.sign(input.email,secret), that is wrong.
            // i can name the key like(email) any name i want.
            let token = jwt.sign(
                { email: input.email },
                SECRET,
                {
                    expiresIn: "1d",
                }
            );
            // To access the plain JavaScript object representing the document, you can use the .toObject() or .toJSON() methods on the document.
            // mean here i want to use the document as normal js object the i want to modify it like add the token and ignore the hashedPassword, i should convert it to a plain JavaScript object.
            // When you use the .toObject() method on a Mongoose document, by default, virtual properties are not included in the resulting plain JavaScript object. so i used {virtuals:true} inside the toObject, to get the virtuals properties.

            const { hashedPassword, ...rest } = user.toObject({
                virtuals: true,
            });
            // console.log(rest.id);
            // here i used use object destructuring and the rest parameter to exclude the desired property.
            res.status(200).json({ ...rest, token: token });
        } else {
            return res.status(403).send("Invalid Password");
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
