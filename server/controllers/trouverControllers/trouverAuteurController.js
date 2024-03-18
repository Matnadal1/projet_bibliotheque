const Auteur = require('../../models/Auteur');

// Fonction pour récupérer tous les livres
exports.getAllAuteurs = async (req, res) => {
    try {
      const auteursList = await Auteur.find();
      res.json(auteursList);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors du chargement des auteurs');
    }
};

