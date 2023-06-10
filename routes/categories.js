const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");
const { bearerAuth, adminCheck } = require("../auth_middleware/bearerAuth");
// since we use this router middleware on just "/category" routes as we write in the middleware first parameter, all of these routes paths will be considered as /category/routePath.

router.get("/", async (req, res, next) => {
    try {
        const categoriesList = await Category.find();
        console.log(categoriesList);
        // find return empty array in case there is no values
        !categoriesList.length
            ? res.status(404).send("there are no categories")
            : res.status(200).json(categoriesList);
    } catch (error) {
        next(error);
    }
});

router.get("/catById/:id",bearerAuth ,async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        console.log(category.id);
        // findById return null in case the id not found
        !category
            ? res.status(404).send("category not found")
            : res.status(200).json(category);
    } catch (error) {
        next(error);
    }
});

router.post("/", bearerAuth,adminCheck,(req, res, next) => {
    const newCategory = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    });

    newCategory
        .save()
        .then((result) => {
            res.status(201).json(result);
        })
        .catch((error) => {
            next(error);
        });
});

router.put("/update/:id",bearerAuth, adminCheck,async (req, res, next) => {
    try {
        const updated = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                icon: req.body.icon || Category.icon,
                color: req.body.color,
            },
            // this line to return the updated value if i does not use it the old valuse(before update) will return
            { new: true }
        );
        !updated
            ? res.status(404).json({ message: "category not fuond" })
            : res.status(201).json(updated);
    } catch (error) {
        next(error);
    }
});

router.delete("/delete/:id",bearerAuth, adminCheck,(req, res, next) => {
    Category.findByIdAndRemove(req.params.id)
        .then((result) => {
            if (result) {
                res.status(204).end();
            } else {
                res.status(404).send("category not found");
            }
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;
