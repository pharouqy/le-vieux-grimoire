const Book = require("../models/book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const objectBook = req.body;
  const book = new Book({
    ...objectBook,
    imageUrl: `${req.protocol}://${req.get("host")}/${req.file.name}`,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Book crée avec succés !!!" });
    })
    .catch((error) => {
      throw new Error(error);
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(201).json(books);
    })
    .catch((error) => {
      throw new Error(error);
    });
};
