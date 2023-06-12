const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

// Créer une instance de multer pour stocker les fichiers téléchargés en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware pour télécharger et compresser l'image
const uploadAndCompressImage = (req, res, next) => {
  console.log(req.body);
  // Utiliser l'instance de multer pour stocker l'image en mémoire
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
      // Convertir le buffer de l'image en une chaîne de caractères base64
      const imageBuffer = req.file.buffer.toString("base64");

      sharp(Buffer.from(imageBuffer, "base64"))
        .resize(800) // Redimensionner l'image à une largeur de 800 pixels
        .webp({ quality: 80 }) // Compresser l'image en WEBP avec une qualité de 80%
        .toFile(name, (err, info) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          // Supprimer l'image non compressée
          req.file.buffer = null;
          req.file.name = name;
          // Continuer la chaîne de middleware
          next();
        });
    }
  });
};

module.exports = uploadAndCompressImage;
