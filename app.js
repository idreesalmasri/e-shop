const express = require("express");
const app = express();
const mongoose = require("mongoose");
// require('dotenv').config();
// or we can use this way
require("dotenv/config");
const categories=require('./routes/categories')
const products=require('./routes/products')
const users=require('./routes/users')
const orders=require('./routes/orders');
const internalError=require('./errorHandlers/errorHandler');
const notFound=require('./errorHandlers/404');
const DB = process.env.DB_STRING;
const PORT = process.env.PORT||3005;

app.use(express.json());

// category router middleware this will mount just on the routes that contain "/category"
app.use("/category", categories);
app.use("/products",products);
app.use("/users",users);
app.use('/orders',orders);

app.use(internalError);
app.use('*',notFound);
mongoose.connect(DB).then(()=>{
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT} and the db connected successfully`);
    });
}).catch((err)=>{
    console.log(err);
});

