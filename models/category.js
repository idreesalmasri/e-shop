const mongoose=require('mongoose');

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    icon:{
        type:String
    },
    color:{
        type:String
    }
});
// we used this to define a virtual property called "id" to save th id without _id which is the fefault naming by mongoose
// so we can use the id property because some times the underscore before the _id maybe cause some errors
// the virtual property does not persist in the database but can be accessed like regular model properties.
// "categorySchema.virtual("id")" This line defines a virtual property named 'id' on the 'categorySchema'.
// '.get' will execute the function inside it once we try to access the virtual property
// the function inside .get return the value for the virtual property
categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});
// The "toJSON" option is used to control the behavior of the schema when it's converted to JSON. 
// By setting virtuals: true, you are instructing Mongoose to include virtual properties in the JSON representation of the schema.
categorySchema.set("toJSON", {
  virtuals: true,
});

// another way to expoert directly
// this is how we can create model from a schema 
// the first argument is the model name and the second one is the schema
// we will use the first argument as ref value in case we needed to reference another document to this model
exports.Category = mongoose.model("Category", categorySchema);


// Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document. Models are responsible for creating and reading documents from the underlying MongoDB database.

// A Mongoose Schema defines structure of the document, default values, validators of the document in the MongoDB collection. This Schema is a way to define expected properties and values along with the constraints and indexes.
