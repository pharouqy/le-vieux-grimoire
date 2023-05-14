const passwordSchema = require("../models/checkPassword");

module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res
      .status(400)
      .json({
        message:
          "Le mot de passe ne remplis pas le minimum requis de sécurisation",
      });
  } else {
    next();
  }
};
