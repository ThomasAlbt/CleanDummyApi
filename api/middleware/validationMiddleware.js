const { body } = require(express-validator);

const urlValidation = () => [
  body('url') // cible le champ url
    .isURL() // valide si c'est un url
      .withMessage('URL invalide') // message d'erreur
    .notEmpty() // Verifie si le champ est vide
      .withMessage('URL requise') // Message si vide
    .trim()
    .escape() // Supprime balise html/js (xss)
];

const timeValidation = () => [
  body('time')
    .isFloat({ 
      gt: 0,               // > 0
      lt: 86400            // < 86400
    })
    .withMessage('Le temps doit être un nombre entre 0.01 et 86400 secondes')
    .notEmpty()
    .withMessage('Le temps est requis')
];

module.exports = { urlValidation, timeValidation }