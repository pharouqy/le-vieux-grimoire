const Book = require("../models/book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const objectBook = JSON.parse(req.body.book);
  console.log(objectBook);
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

exports.getOneBook = (req, res, next) => {
  const id = req.params.id;
  Book.findOne({ _id: id })
    .then((book) => {
      if (!book) {
        res.status(500).json({ message: "Book n'existe pas !!!" });
      }
      res.status(200).json(book);
    })
    .catch((error) => {
      throw new Error(error);
    });
};

exports.bestratingBook = (req, res, next) => {
  Book.find()
    .then((books) => {
      const ratings = books
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 3);
      res.status(200).json(ratings);
    })
    .catch((error) => {
      throw new Error(error);
    });
};
