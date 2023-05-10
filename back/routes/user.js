const express = require("express");
const router = express.Router();

const userContrlr = require("../controllers/user");

router.post("/signup", userContrlr.signup);
router.post("/login", userContrlr.signin);

module.exports = router;
