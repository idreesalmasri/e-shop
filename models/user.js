const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  country: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  street: {
    type: String,
    default: "",
  },
  appartment: {
    type: String,
    default: "",
  },
});

// userSchema.virtual('actions').get(()=>{
//     const acl = {
//       admin: ["create", "read", "update", "delete"],
//       user:["read"]
//     };
//     return acl[this.role];
// })
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", {
  virtuals: true,
});

exports.User = mongoose.model("User", userSchema);
