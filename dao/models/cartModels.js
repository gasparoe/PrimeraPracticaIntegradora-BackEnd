const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
    unique: true,
  },
  productos: {
    type: Array,
    default: [],
  },
});

const carts = mongoose.model("carts", cartSchema);
module.exports = carts;
