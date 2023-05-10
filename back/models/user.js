const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");

const userShema = mongoose.Schema({
  email: { type: String, required: true, unqiue: true },
  password: { type: String, required: true },
});

userShema.plugin(validator);

module.exports = mongoose.model("User", userShema);
