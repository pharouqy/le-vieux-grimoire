const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const booksContrlr = require("../controllers/book");

router.post("/", auth, multer, booksContrlr.createBook);
router.get("/", booksContrlr.getAllBooks);
router.get("/bestrating", booksContrlr.bestratingBook);
router.get("/:id", booksContrlr.getOneBook);
router.put("/:id", auth, multer, booksContrlr.updateBook);
router.delete("/:id", auth, booksContrlr.deleteBook);
router.post("/:id/rating", auth, booksContrlr.ratingBook);

module.exports = router;
