const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

// Créer une instance de multer pour stocker les fichiers téléchargés
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
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
    console.log(req.file);
    // Utiliser le module sharp pour compresser l'image
    const timestamp = Date.now();
    sharp(req.file.path)
      .resize(800) // Redimensionner l'image à une largeur de 800 pixels
      .jpeg({ quality: 80 }) // Compresser l'image en JPEG avec une qualité de 80%
      .toFile(
        `images/compressed/${timestamp}-${req.file.originalname.split(".")[0]}.webp`,
        (err, info) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          // Supprimer l'image non compressée
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error(err);
            }
          });

          // Continuer la chaîne de middleware
          next();
        }
      );
  });
};

module.exports = uploadAndCompressImage;
