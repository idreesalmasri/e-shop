const express = require("express");
const app = express();
// require('dotenv').config();
// or we can use this way
require("dotenv/config");
const cors=require('cors');
app.use(cors());
app.use(express.json());
const categories=require('./routes/categories');
const products=require('./routes/products');
const users=require('./routes/users');
const orders=require('./routes/orders');
const internalError=require('./errorHandlers/errorHandler');
const notFound=require('./errorHandlers/404');

// category router middleware this will mount just on the routes that contain "/category"
app.use("/category", categories);
app.use("/products",products);
app.use("/users",users);
app.use('/orders',orders);

app.use(internalError);
app.use('*',notFound);

const start=(port)=>{
  app.listen(port,()=>{
    console.log(
        `server is running on port ${port}`
    );
  });
};

module.exports={
  start,
  app
}

