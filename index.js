'use strict';
require('dotenv').config();
const mongoose=require('mongoose');
const PORT=process.env.PORT;
const DBURI = process.env.DB_STRING;
const {start}=require('./src/app');
mongoose.connect(DBURI).then(()=>{
    console.log("Successfully connected to the database!");
    start(PORT)
}).catch((error)=>{
    console.log(error);
});
