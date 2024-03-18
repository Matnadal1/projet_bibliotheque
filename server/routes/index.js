const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');
const bookFindController = require('../controllers/trouverControllers/trouverLivreController');
const auteurFindController = require('../controllers/trouverControllers/trouverAuteurController');
const editeurFindController = require('../controllers/trouverControllers/trouverEditeurController')
//------------ Welcome Route ------------//
router.get('/', (req, res) => {
    res.render('welcome');
});

//------------ Dashboard Route ------------//
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dash', {
    name: req.user.name
}));

// Route pour afficher la pageCatalogue

//------------ pageCatalogue Route ------------//
router.get('/pageCatalogue', ensureAuthenticated, async (req, res) => {
    try {

        res.render('pageCatalogue', {
            id: req.user.id,
            nom: req.user.nom,
            prenom: req.user.prenom,
            mail: req.user.email,
            role: req.user.role
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors du chargement des livres');
    }
});

module.exports = router;