const Emprunt = require('../../models/Emprunt');
const { ObjectId } = require('mongodb');


// Fonction pour récupérer tous les livres
exports.getAllEmprunts = async (req, res) => {
    try {
      const empruntList = await Emprunt.find();
      res.json(empruntList);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors du chargement des reservations');
    }
};

exports.getEmpruntsByUser = async (req, res) => {
  const idUser = req.params.id; // Supposons que l'identifiant de l'utilisateur est passé en tant que paramètre d'URL
  try {
      const empruntsByUser = await Emprunt.aggregate([
        {
            $match: {
                adherent: ObjectId(idUser) ,
                etat: { $ne: "archivé" }
            }
        },
        {
          $lookup: {
            from: "livres",
            localField: "livre",
            foreignField: "_id",
            as: "livre"
          }
        },
        { $unwind: "$livre" },
        {
          $lookup: {
            from: "auteurs",
            localField: "livre.auteur",
            foreignField: "_id",
            as: "auteurs"
          }
        },
        {
          $lookup: {
            from: "editeurs",
            localField: "livre.editeur",
            foreignField: "_id",
            as: "editeur"
          }
        },
      ]); // Filtrer les emprunts par identifiant d'utilisateur
      res.json(empruntsByUser);
  } catch (error) {
      console.error('Erreur lors de la récupération des emprunts de l\'utilisateur :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des emprunts de l\'utilisateur' });
  }
};

exports.getEmpruntsDetails = async (req, res) => {
    try {
        const empruntsDetails = await 
        Emprunt.find({})
        .populate({
            path: 'adherent',
            select: 'nom prenom email'
        })
        .populate({
            path: 'livre',
            select: 'titre ISBN auteur editeur', 
            populate: [{
                path: 'editeur',
                select: 'nom'
            },{
                path: 'auteur',
                select: 'nom prenom'
            }
            ]
        })

        res.json(empruntsDetails);
    } catch (error) {
        console.error('Erreur lors de la récupération des emprunts avec détails :', error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des emprunts.' });
    }
};

exports.getEmpruntsDetailsUser = async (req, res) => {
    const userId = req.params.userId; // Supposons que l'identifiant de l'utilisateur est passé en tant que paramètre d'URL
    try {
        const emprunts = await Emprunt.aggregate([
            {
              $lookup: {
                from: "users",
                localField: "adherent",
                foreignField: "_id",
                as: "user"
              }
            },
            { $unwind: "$user" },
            {
              $lookup: {
                from: "livres",
                localField: "livre",
                foreignField: "_id",
                as: "livre"
              }
            },
            { $unwind: "$livre" },
            {
              $lookup: {
                from: "auteurs",
                localField: "livre.auteur",
                foreignField: "_id",
                as: "auteurs"
              }
            },
            {
              $lookup: {
                from: "editeurs",
                localField: "livre.editeur",
                foreignField: "_id",
                as: "editeur"
              }
            },
            {
              $group: {
                _id: "$adherent",
                user: { $first: "$user" },
                emprunts: {
                  $push: {
                    etat: "$etat",
                    titre: "$livre.titre",
                    isbn: "$livre.ISBN",
                    auteurs: "$auteurs._id",
                    editeur: "$editeur.nom",
                    createdAt: "$createdAt"
                  },
                  

                }
              }
            },
            {
              $project: {
                _id: 0,
                "user.nom": 1,
                "user.prenom": 1,
                "user.email": 1,
                emprunts: 1,
                createdAt: 1
              }
            }
          ])
        res.json(emprunts);
    } catch (error) {
        console.error('Erreur lors de la récupération des emprunts de l\'utilisateur :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des emprunts de l\'utilisateur' });
    }
  };