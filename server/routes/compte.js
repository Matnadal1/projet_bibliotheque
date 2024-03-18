const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');
const { exportEmpruntsToExcel } = require('../controllers/excel');
const { ensureRole } = require('../config/checkRole')
const modfierUserController = require('../controllers/modifierControllers/modifierUserController')
const modifierReservationController = require('../controllers/modifierControllers/modifierReservationController')



// Fonction pour afficher la page de modification de l'utilisateur
async function renderModifyUserPage(req, res) {
    res.render('modifUser', {
        id: req.user.id,
        nom: req.user.nom,
        prenom: req.user.prenom,
        email: req.user.email,
        adresse: req.user.adresse,
    });
}

// Fonction pour afficher la page de compte de l'utilisateur
async function renderUserPage(req, res) {
    let template = 'user';
    if (req.user.role === 'libraire') {
        template = 'libraire';
    }
    res.render(template, {
        id: req.user.id,
        nom: req.user.nom,
        prenom: req.user.prenom,
        email: req.user.email,
        adresse: req.user.adresse.numero + ' ' + req.user.adresse.rue,
    });
}

// Routes

router.get('/modifUser', ensureAuthenticated, (req, res) => renderModifyUserPage(req, res));

router.get('/monCompte', ensureAuthenticated, (req, res) => renderUserPage(req, res));

router.get('/empruntsXLSX',ensureAuthenticated, ensureRole, exportEmpruntsToExcel);

router.post('/modifUser', ensureAuthenticated, modfierUserController.modifierUser);

router.post('/annulerReservation', ensureAuthenticated, modifierReservationController.annulerReservation);


module.exports = router;