const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const Livre = require('../models/Livre');
const Emprunt = require('../models/Emprunt');

//------------ Gerer_pret Route ------------//
router.get('/gererPret', ensureAuthenticated, async (req, res) => {
    try {
        
        res.render('gererPret', {
            id: req.user.id,
            nom: req.user.nom,
            prenom: req.user.prenom,
            mail: req.user.email,
            role: req.user.role
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors du chargement des livres et adhérents');
    }
}); 

//changer le statut du livre dans la base de données
router.post('/rendrePret', async (req, res) => {
    try {
        const bookId = req.body.bookId; // Supposant que vous envoyez bookId depuis votre formulaire
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

        console.log(updatedLivre);
        console.log(updatedPret);
        //res.send("Livre rendu avec succès");
        //res.redirect('/gererPret');
        req.flash('success_msg', 'Retour Confirmé !');
        res.redirect('/gererPret');
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors du rendu du livre");
    }
});


module.exports = router;