const Livre = require('../../models/Livre');
const Emprunt = require('../../models/Emprunt');

exports.rendreLivre = async (req, res) => {
    try {
        const bookId = req.body.bookId; 
        const updatedLivre = await Livre.findOne({ ISBN: bookId });
        const updatedPret = await Emprunt.findOne({livre: updatedLivre._id});

        if (!updatedLivre) {
            return res.status(404).send("Livre non trouvé");
        }

        if (!updatedPret) {
            return res.status(404).send("Pret non trouvé");
        }

        updatedLivre.statut = 'disponible';
        updatedPret.etat = 'archivé';

        // Sauvegarder les modifications dans la base de données
        await updatedLivre.save();
        await updatedPret.save();


        req.flash('success_msg', 'Retour Confirmé !');
        res.redirect('/gererPret');
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors du rendu du livre");
    }
};