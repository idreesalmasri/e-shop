const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { Category } = require("../models/category");
const { bearerAuth, adminCheck } = require("../auth_middleware/bearerAuth");
const axios=require('axios');
router.post("/",bearerAuth, adminCheck,async (req, res, next) => {
  const cat = await Category.findById(req.body.category);
  if (!cat) return res, status(400).send("invalid category");
  try {
    const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        thumbnail: req.body.thumbnail,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        countInStock: req.body.countInStock,
        category: req.body.category,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });
    const createdProduct = await newProduct.save();
    res.status(201).send(createdProduct);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    // the string value inside the populate should be same as the column name in the product schema,it is case sensitive
    const list = await Product.find().populate("category");
    if (!list.length) return res.status(404).send("there are no products");
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
});
router.get("/categoryProducts", async (req, res, next) => {
  try {
    const slectedCatergoryId = req.query.cat;
    const category = await Category.findById(slectedCatergoryId);
    // here valid is the ehole document
    if (!category) return res.status(404).send("The category is not found");
    // here inside the finde it is like where in sql but in mongoose no need for it.
    // just inside an object put the name of the column : the value you want to filter based on.
    const productList = await Product.find({ category: category }).populate(
      "category"
    );
    if (!productList.length)
      return res.status(404).send("no products for this category");
    res
      .status(200)
      .json({ numberOfProducts: productList.length, list: productList });
  } catch (error) {
    next(error);
  }
});
router.get("/count", async (req, res, next) => {
  try {
    const productsCount = await Product.countDocuments();
    if (!productsCount) return res.status(404).send("no products");
    res.status(200).json(productsCount);
  } catch (error) {
    next(error);
  }
});
router.get("/byId/:id", async (req, res, next) => {
  try {
    const list = await Product.findById(req.params.id).populate("category");
    if (!list) return res.status(404).send("there are no products");
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
});

router.put("/update/:id", bearerAuth,adminCheck,async (req, res, next) => {
  if(req.body.category){
    const cat = await Category.findById(req.body.category);
    if (!cat) return res.status(400).send("invalid category");
  }
  try {
    const existingProduct = await Product.findById(req.params.id);
    const updated = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name || existingProduct.name,
            description: req.body.description || existingProduct.description,
            thumbnail: req.body.thumbnail || existingProduct.thumbnail,
            images: req.body.images || existingProduct.images,
            brand: req.body.brand || existingProduct.brand,
            price: req.body.price || existingProduct.price,
            countInStock: req.body.countInStock || existingProduct.countInStock,
            category: req.body.category,
            rating: req.body.rating || existingProduct.rating,
            numReviews: req.body.numReviews || existingProduct.numReviews,
            isFeatured: req.body.isFeatured || existingProduct.isFeatured,
        },
        { new: true }
    );
    if (!updated) return res.status(404).send("product not found");
    res.status(201).json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:id", bearerAuth,adminCheck,async (req, res, next) => {
  try {
    const result = await Product.findByIdAndRemove(req.params.id);
    !result ? res.status(404).send("product not found") : res.status(204).end();
  } catch (error) {
    next(error);
  }
});
// router.get('/fill',async(req,res,next)=>{
//   try{

//     const list = await axios.get("https://fakestoreapi.com/products");
//     await Promise.all(list.data.map(async(product)=>{
//       const category=await Category.find({name:product.category});
//       // console.log(category,"jjjjjjjj");
//       const categoryId = category[0]._id;
//       console.log(categoryId);
//       const newProduct = new Product({
//           name: product.title,
//           description: product.description,
//           thumbnail: product.image,
//           brand: product.brand,
//           price: product.price,
//           countInStock: Math.floor(Math.random() * (200 - 100 + 1)) + 100,
//           rating: product.rating.rate,
//           numReviews: product.rating.count,
//           category: categoryId,
//       }).save();
//     }))
//     res.status(201).send('created')
//   }catch(error){
//     next(error)
//   }
// })
module.exports = router;
