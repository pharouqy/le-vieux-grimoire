const multer = require("multer"); // import multer

// Créer une instance de multer pour stocker les fichiers téléchargés en mémoire
const storage = multer.memoryStorage(); // j'utilise la methode memoryStorage pour stocker l'image en mémoire
exports.upload = multer({ storage: storage }); // stock l'image dans la memoire !!!
