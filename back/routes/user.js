const express = require("express");
const router = express.Router();

const limiter = require("express-rate-limit");

const userContrlr = require("../controllers/user");

router.post("/signup", userContrlr.signup);
router.post("/login", limiter, userContrlr.signin);

module.exports = router;
