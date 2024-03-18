const Editeur = require('../../models/Editeur');
const { ObjectId } = require('mongodb');

// Fonction pour récupérer tous les livres
exports.getAllEditeurs = async (req, res) => {
    try {
      const editeursList = await Editeur.find();
      res.json(editeursList);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors du chargement des éditeurs');
    }
};

exports.getEditeurById = async (req, res) => {
  const editeurId = req.params.id;
  try {
    console.log(req.params.id);
    const editeur = await Editeur.findById(editeurId);
    console.log(editeur);
    res.json(editeur);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors du chargement de l\'éditeurs');
  }
};


