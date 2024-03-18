const Livre = require('../../models/Livre');
const { ObjectId } = require('mongodb');

exports.getAllBooks = async (req, res) => {
  try {
      const uniqueBooksList = await Livre.aggregate([
          {
              $group: {
                    _id: {
                        titre: "$titre",
                        auteur: "$auteur",
                        editeur: "$editeur",
                    },
                    count: { $sum: { $cond: [{ $eq: ["$statut", "disponible"] }, 1, 0] } },
                    dateAdded: { $min: "$createdAt" },
                    ISBNs: { $addToSet: "$ISBN" },
                    date_parution: { $first: "$date_parution" },
                    categorie: { $first: "$categorie" },
                    sous_categorie: { $first: "$sous_categorie" },
                    tag: { $first: "$tag" },
                    description: { $first: "$description" },
                    couverture: { $first: "$couverture"}
                }
            },
            {
              $project: {
                  titre: "$_id.titre",
                  auteur: "$_id.auteur",
                  editeur: "$_id.editeur",
                  date_parution: 1,
                  categorie: 1,
                  sous_categorie: 1,
                  tag: 1,
                  description: 1,
                  exemplairesDisponibles: {$ifNull: ["$count", 0]},
                  dateAdded: 1,
                  ISBNs: 1,
                  couverture: 1
              }
          }
      ]);
      res.json(uniqueBooksList);
    } catch (err) {
      console.error(err);
      readvSync.status(500).send('Erreur lors du chargement des livres');
    }
};

exports.getAllUniqueBook = async (req, res) => {
    try {
        const livresList = await Livre.find();
        res.json(livresList);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors du chargement des livres');
    }
};

exports.getBookById = async (req, res) => {
    const idBook = req.params.id; // Supposons que l'identifiant de l'utilisateur est passé en tant que paramètre d'URL

    try {
        const uniqueBooksList = await Livre.aggregate([
            {
                $match: {
                    adherent: ObjectId(idBook) ,
                }
            },
            {
                $group: {
                      _id: {
                          titre: "$titre",
                          auteur: "$auteur",
                          editeur: "$editeur",
                      },
                      count: { $sum: { $cond: [{ $eq: ["$statut", "disponible"] }, 1, 0] } },
                      dateAdded: { $min: "$createdAt" },
                      ISBNs: { $addToSet: "$ISBN" },
                      date_parution: { $first: "$date_parution" },
                      categorie: { $first: "$categorie" },
                      sous_categorie: { $first: "$sous_categorie" },
                      tag: { $first: "$tag" },
                      description: { $first: "$description" },
                      couverture: { $first: "$couverture"}
                  }
              },
              {
                $project: {
                    titre: "$_id.titre",
                    auteur: "$_id.auteur",
                    editeur: "$_id.editeur",
                    date_parution: 1,
                    categorie: 1,
                    sous_categorie: 1,
                    tag: 1,
                    description: 1,
                    exemplairesDisponibles: {$ifNull: ["$count", 0]},
                    dateAdded: 1,
                    ISBNs: 1,
                    couverture: 1
                }
            }
        ]);
        res.json(uniqueBooksList);
      } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors du chargement des livres');
      }
  };
    