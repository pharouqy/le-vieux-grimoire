const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4buf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connexion réussie à MongoDB !!!");
  })
  .catch((error) => {
    throw new Error(error);
  });

const app = express();

app.use(helmet());

app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.get("/", (req, res, next) => {
  res.send("Le vieux gromoire !!!");
});

app.use(cors());

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images"))); //pour pouvoir accéder aux images depuis le front

module.exports = app;
