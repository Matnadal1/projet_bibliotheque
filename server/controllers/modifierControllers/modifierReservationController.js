const Livre = require('../../models/Livre');
const Reservation = require('../../models/Reservation');

exports.annulerReservation = async (req, res) => {
    try {
        const bookId = req.body.bookId; 
        const updatedLivre = await Livre.findOne({ ISBN: bookId });
        await Reservation.deleteOne({livre: updatedLivre._id});

        if (!updatedLivre) {
            return res.status(404).send("Livre non trouvé");
        }

        updatedLivre.statut = 'disponible';

        await updatedLivre.save();

        req.flash('success_msg', 'Reservation annulée !');
        res.redirect('/monCompte');
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors du rendu du livre");
    }
};