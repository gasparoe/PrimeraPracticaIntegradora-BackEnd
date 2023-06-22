const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
  },
  mensaje: {
    type: String,
    required: true,
  },
});

const messages = mongoose.model("messages", messageSchema);
module.exports = messages;
