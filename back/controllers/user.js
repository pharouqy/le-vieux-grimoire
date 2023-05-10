const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const User = require("../models/user");

exports.signup = (req, res, next) => {
  console.log(req.body);
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: CryptoJS.EvpKDF(
          req.body.email,
          process.env.SECRET_TOKEN
        ).toString(CryptoJS.enc.Base64),
        password: hash,
      });
      user
        .save()
        .then(() =>
          res.status(201).json({ message: "Utilisateur crée avec succés !!!" })
        )
        .catch((error) => {
          throw new Error(error);
        });
    })
    .catch((error) => {
      throw new Error(error);
    });
};

exports.signin = (req, res, next) => {
  const emailCrypt = CryptoJS.EvpKDF(
    req.body.email,
    process.env.SECRET_TOKEN
  ).toString(CryptoJS.enc.Base64);
  User.findOne({ email: emailCrypt })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouver !!!" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Mot de passe incorect !!!" });
          }
          const token = jwt.sign(
            {
              email: emailCrypt,
              id: user._id,
            },
            process.env.SECRET_TOKEN,
            { expiresIn: "24h" }
          );
          res.status(200).json({ userId: user._id, token: token });
        })
        .catch((error) => {
          throw new Error(error);
        });
    })
    .catch((error) => {
      throw new Error(error);
    });
};
