const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");

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

app.use(helmet({ crossOriginResourcePolicy: false })); // En désactivant cette option avec la valeur false, nous permettons aux ressources d'être chargées à partir de différents domaines et origines.

// Configurer les options CORS
const corsOptions = {
  origin: "*", // Remplacer par l'origine de votre application
  optionsSuccessStatus: 200, // Certains navigateurs renvoient un code d'état 204, ce qui peut causer des problèmes, donc nous forçons un code 200 ici.
};

// Activer CORS pour toutes les routes
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content, Accept, Content-Type"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images"))); //pour pouvoir accéder aux images depuis le front

app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);

module.exports = app;
