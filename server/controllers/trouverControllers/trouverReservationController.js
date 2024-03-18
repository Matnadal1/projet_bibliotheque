const Reservation = require('../../models/Reservation');
const { ObjectId } = require('mongodb');

// Fonction pour récupérer tous les livres
exports.getAllReserve = async (req, res) => {
    try {
      const reservationList = await Reservation.find();
      res.json(reservationList);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors du chargement des reservations');
    }
};

exports.getReserveByUser = async (req, res) => {
  const userId = req.params.userId; 
  try {
      const reservation = await Reservation.find({ adherent: userId }); 
      res.json(reservation);
  } catch (error) {
      console.error('Erreur lors de la récupération des reservations de l\'utilisateur :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des reservations de l\'utilisateur' });
  }
};

exports.getReservationByUser = async (req, res) => {
  const idUser = req.params.id; 
  try {
      const reservationsByUser = await Reservation.aggregate([
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
      res.json(reservationsByUser);
  } catch (error) {
      console.error('Erreur lors de la récupération des reservations de l\'utilisateur :', error);
      res.status(500).json({ message: 'Erreur lors de la reservations des emprunts de l\'utilisateur' });
  }
};