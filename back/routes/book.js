const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const booksContrlr = require("../controllers/book");

router.post("/", auth, multer, booksContrlr.createBook);

module.exports = router;
