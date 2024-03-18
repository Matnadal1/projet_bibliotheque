const User = require('../../models/User');

// Fonction pour récupérer les users
exports.getAllUsers = async (req, res) => {
    try {
      const uniqueUsersList = await User.aggregate([
        {
          $lookup: {
            from: "emprunts", // Nom de la collection d'emprunts
            localField: "_id",
            foreignField: "adherent",
            as: "emprunts"
          }
        },
        {
          $project: {
            _id: 1,
            nom: 1,
            prenom: 1,
            email: 1,
            nombreLivresEmpruntes: {
              $size: {
                $filter: {
                  input: "$emprunts",
                  cond: { $ne: ["$$this.etat", "archivé"] }
                }
              }
            }
          }
        }
      ]);; 
      res.json(uniqueUsersList);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors du chargement des adhérents');
    }
};


