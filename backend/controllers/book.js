const Book = require("../models/book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const objectBook = JSON.parse(req.body.book);
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

exports.updateBook = (req, res, next) => {
  const objectBook = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/${req.file.name}`,
      }
    : { ...req.body };
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        res.status(500).json({ message: "Book n'existe pas !!!" });
      }
      if (req.file == null) {
        Book.updateOne({ _id: req.params.id }, { $set: { ...objectBook } })
          .then(() => {
            res.status(200).json({ message: "Book updated successfully !!!" });
          })
          .catch((error) => {
            throw new Error(error);
          });
      } else {
        Book.updateOne({ _id: req.params.id }, { $set: { ...objectBook } })
          .then(() => {
            res.status(200).json({ message: "Book updated successfully !!!" });
          })
          .catch((error) => {
            throw new Error(error);
          });
        const filename = book.imageUrl.split("/images/")[1];
        if (fs.existsSync(`images/${filename}`)) {
          fs.unlink(`images/${filename}`, (error) => {
            if (error) {
              throw new Error(error);
            }
          });
        } else {
          res.status(404).json({ message: "Photo n'existe pas !!!" });
        }
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        res.status(500).json({ message: "Book n'existe pas !!!" });
      }
      Book.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({ message: "Book deleted successfully !!!" });
          const filename = book.imageUrl.split("/images/")[1];
          if (fs.existsSync(`images/${filename}`)) {
            fs.unlink(`images/${filename}`, (error) => {
              if (error) {
                throw new Error(error);
              }
            });
          } else {
            res.status(404).json({ message: "Photo n'existe pas !!!" });
          }
        })
        .catch((error) => {
          throw new Error(error);
        });
    })
    .catch((error) => {
      throw new Error(error);
    });
};

exports.ratingBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        res.status(500).json({ message: "Book n'existe pas !!!" });
      }
      if (
        book.ratings
          .map((object) => {
            return object.userId;
          })
          .includes(req.body.userId)
      ) {
        res.status(500).json({ message: "Vous avez déjà voté !!!" });
      } else {
        Book.findOneAndUpdate(
          { _id: req.params.id },
          {
            $push: {
              ratings: {
                userId: req.body.userId,
                grade: req.body.rating,
              },
            },
          },
          {
            new: true,
            useFindAndModify: true,
          }
        )
          .then((book) => {
            const sum = book.ratings.reduce((accu, curr) => {
              return accu + curr.grade;
            }, 0);
            const average = Math.ceil(sum / book.ratings.length);
            Book.findOneAndUpdate(
              { _id: req.params.id },
              { $set: { averageRating: average } },
              {
                new: true,
                useFindAndModify: true,
              }
            )
              .then((book) => {
                res.status(200).json(book);
              })
              .catch((error) => {
                throw new Error(error);
              });
            console.log("Moyenne à jour !!!");
          })
          .catch((error) => {
            throw new Error(error);
          });
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
};
