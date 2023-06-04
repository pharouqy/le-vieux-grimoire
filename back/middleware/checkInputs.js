module.exports = (req, res, next) => {
  const regexAlpha = /^[a-zA-Z, àâäéèêëîïôöùûüÿçÂÊÎÔÛÄËÏÖÜÀÆÇÉÈŒÙ&]+$/;
  const regexNumber = /^[0-9]{4}$/;
  // si la requête est une requête POST ou PUT et qu'il y a un fichier
  const book = JSON.parse(req.body.book);
  console.log(req.body.book);
  const { title, author, year, genre } = book; // ES6 destructuration
  checkInput(res, next, title, author, year, genre);
  function checkInput(res, next, title, author, year, genre) {
    if (
      title.length == null ||
      author.length == null ||
      year.length == null ||
      genre.length == null ||
      (title.length >= 3 &&
        author.length >= 3 &&
        year.length == 4 &&
        genre.length >= 3 &&
        regexAlpha.test(title) &&
        regexAlpha.test(author) &&
        regexNumber.test(year) &&
        regexAlpha.test(genre))
    ) {
      next();
    } else {
      res.status(400).json({
        message:
          "vous devez remplir tous les champs avec au moins 3 caractéres sans utiliser de symbole spéciale !!!",
      });
    }
  }
};
