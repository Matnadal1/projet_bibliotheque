const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const creerReservationController = require('../controllers/creerControllers/creerReservationController')


router.get('/livre/:id', ensureAuthenticated, async (req, res) => {
    try {
        res.render('infosLivre', {
            id: req.user.id,
            nom: req.user.nom,
            prenom: req.user.prenom,
            mail: req.user.email,
            role: req.user.role
        })
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors du chargement des infos du livre');
    }
});

router.post('/reserver/:titre/:auteur/:editeur', ensureAuthenticated, creerReservationController.creerReservation);


module.exports = router;