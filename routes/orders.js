const mongoose = require("mongoose");
const { Order } = require("../models/order");
const { OrderItem } = require("../models/orderItems");
const express = require("express");
const { bearerAuth, adminCheck } = require("../auth_middleware/bearerAuth");
const { Category } = require("../models/category");
const { populate } = require("../models/product");
const Product = require("../models/product");
const router = express.Router();
router.get("/", bearerAuth, async (req, res, next) => {
    try {
        const ordersList = await Order.find().populate("user", "name");
        if (!ordersList.length) return res.status(404).send("No Orders Found");
        res.status(200).json(ordersList);
    } catch (error) {
        next(error);
    }
});

router.get("/byId/:id", bearerAuth, async (req, res, next) => {
    try {
        // Populating across multiple levels mongoose
        // populate({path:"1st level prop",select:'1st l props params" ,populate:{path:2nd level props , populate{path:2rd level props}}})
        // populate take object have 2 properties :
        // 1- path: the property you want to populate
        // 2- select : if the populated property have multiple properties yo can choose from them using select
        // populate : if the populated property have insid it property need to be populated
        const order = await Order.findById(req.params.id)
            .populate("user", "name ")
            .populate({
                path: "orderItems",
                populate: {
                    path: "product",
                    select: "name price",
                    populate: { path: "category", select: "name" },
                },
            });
        if (!order) return res.status(404).send("order not found");
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
});
router.post("/", bearerAuth, async (req, res, next) => {
    //Promise.all() is a method that takes an iterable (such as an array) of promises as input and returns a new promise.
    // This new promise resolves when all the input promises have resolved, or rejects immediately if any of the input promises reject.
    try {
        let totalPrice = 0;
        const orderItemsIdsPromises = req.body.orderItems.map(async (item) => {
            const newItem = new OrderItem({
                quantity: item.quantity,
                product: item.product,
            });
            const createdItem = await newItem.save();
            let product=await Product.findById(item.product).select('countInStock price');
            product.countInStock-=item.quantity;
            await product.save();
            totalPrice += product.price * item.quantity;
            return createdItem.id;
        });
        const orderItemsArr = await Promise.all(orderItemsIdsPromises);
        const order = await new Order({
            orderItems: orderItemsArr,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            totalPrice: totalPrice,
            user: req.body.user,
        }).save();
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
});
router.get("/specificUserOrders/:id", bearerAuth, async (req, res, next) => {
    try {
        const ordersList = await Order.find({ user: req.params.id }).populate({
            path: "orderItems",
            populate: {
                path: "product",
                populate: { path: "category", select: "name" },
            },
        });

        if (!ordersList.length) return res.status(404).send("No orders found");
        res.status(200).json({
            ordersNum: ordersList.length,
            ordersList: ordersList,
        });
    } catch (error) {
        next(error);
    }
});
router.get("/number", bearerAuth, async (req, res, next) => {
    try {
        const count = await Order.countDocuments();
        if (!count) return res.status(404).send("No orders found");
        res.status(200).json(count);
    } catch (error) {
        next(error);
    }
});
router.put("/update/:id", async (req, res, next) => {
    try {
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status,
            },
            { new: true }
        );
        if (!updated) return res.status(400).send("can not be updated");
        res.status(200).json(updated);
    } catch (error) {
        console.log(error);
    }
});

router.delete("/byId/:id", bearerAuth, async (req, res, next) => {
    try {
        const order = await Order.findByIdAndRemove({ _id: req.params.id });
        if (!order) return res.status(400).send("pad request");
        let orderItems = order.orderItems;
        const deletedItems = await OrderItem.deleteMany({
            _id: { $in: orderItems },
        });
        res.status(200).json({
            message: "the order deleted",
            deletedOrder: order,
            deletedItems: deletedItems,
        });
    } catch (error) {
        next(error);
    }
});
module.exports = router;
