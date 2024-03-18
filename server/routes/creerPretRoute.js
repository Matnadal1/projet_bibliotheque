const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const { ensureRole } = require('../config/checkRole')

const creerPretController = require('../controllers/creerControllers/creerPretController');

//------------ Creer_pret Route ------------//
router.get('/creerPret', ensureAuthenticated, ensureRole,async (req, res) => {
    try {
        res.render('creerPret', {
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

//------------ Creer_pret POST ------------//
router.post('/creerPret', ensureAuthenticated ,ensureRole, creerPretController.creerPretH);

module.exports = router;
