const mongoose=require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    richDiecription: {
        type: String,
        dafault: "",
    },
    thumbnail: {
        type: String,
        dafault: "",
    },
    images: [
        {
            type: String,
        },
    ],
    brand: {
        type: String,
        dafault: "",
    },
    price: {
        type: Number,
        dafault: 0,
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 1000,
    },
    // we will use this name inside the populate as it is,it is case sensitive
    category: {
        type: mongoose.Schema.Types.ObjectId,
        // the ref value should be like the model name which is the the first argument inside model(name,schema), it is case sensitive
        ref: "Category",
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

// we used this to define a virtual property called "id" to save th id without _id which is the fefault naming by mongoose
// so we can use the id property because some times the underscore before the _id maybe cause some errors
// the virtual property does not persist in the database but can be accessed like regular model properties.
productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
// The "toJSON" option is used to control the behavior of the schema when it's converted to JSON. 
// By setting virtuals: true, you are instructing Mongoose to include virtual properties in the JSON representation of the schema.
productSchema.set("toJSON", {
  virtuals: true,
});

const Product = mongoose.model("Product", productSchema);
module.exports=Product;