const express = require("express");
const router = express.Router();

const limiter = require("express-rate-limit");
const checkPassword = require("../middleware/checkPassword");
const checkEmail = require("../middleware/checkEmail");

const userContrlr = require("../controllers/user");

router.post("/signup", checkPassword, userContrlr.signup);
router.post("/login", limiter, checkEmail, userContrlr.signin);

module.exports = router;
