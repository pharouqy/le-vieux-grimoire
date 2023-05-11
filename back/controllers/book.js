const Book = require("../models/book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  res.status(200).json({ message: "Ok !!!" });
};
