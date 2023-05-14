const express = require("express");
const router = express.Router();

const limiter = require("express-rate-limit");
const checkPassword = require("../middleware/checkPassword");

const userContrlr = require("../controllers/user");

router.post("/signup", checkPassword, userContrlr.signup);
router.post("/login", limiter, userContrlr.signin);

module.exports = router;
