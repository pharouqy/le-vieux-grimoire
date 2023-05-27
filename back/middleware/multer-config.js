const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

// Créer une instance de multer pour stocker les fichiers téléchargés
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "temp/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Middleware pour télécharger et compresser l'image
const uploadAndCompressImage = (req, res, next) => {
  // Utiliser l'instance de multer pour stocker l'image
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    // Utiliser le module sharp pour compresser l'image
    const timestamp = Date.now();
    const name = req.file
      ? `images/${timestamp}-${req.file.originalname
          .split(".")[0]
          .match(/[a-zA-Z0-9]/g)
          .join("")}.webp`
      : next();
    if (req.file) {
      sharp(req.file.path)
        .resize(800) // Redimensionner l'image à une largeur de 800 pixels
        .webp({ quality: 80 }) // Compresser l'image en WEBP avec une qualité de 80%
        .toFile(name, (err, info) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          // Supprimer l'image non compressée
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error(err);
            }
          });
          req.file.name = name;
          // Continuer la chaîne de middleware
          next();
        });
    }
  });
};

module.exports = uploadAndCompressImage;
