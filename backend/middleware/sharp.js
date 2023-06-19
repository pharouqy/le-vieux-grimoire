const sharp = require("sharp"); // import sharp

const uploadAndCompressImage = (req, res, next) => {
  (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
  };
  // Utiliser le module sharp pour compresser l'image
  const timestamp = Date.now();
  const name = req.file
    ? `images/${timestamp}-${req.file.originalname
        .split(".")[0]
        .match(/[a-zA-Z0-9]/g)
        .join("")}.webp`
    : next();
  if (req.file) {
    sharp(req.file.buffer)
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
};

module.exports = uploadAndCompressImage;