const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');
const { ensureRole } = require('../config/checkRole');

const trouverLivreController = require('../controllers/trouverControllers/trouverLivreController');
const trouverAuteurController = require('../controllers/trouverControllers/trouverAuteurController');
const trouverEditeurController = require('../controllers/trouverControllers/trouverEditeurController');
const trouverUserController = require('../controllers/trouverControllers/trouverUserController');
const trouverEmpruntController = require('../controllers/trouverControllers/trouverEmpruntController');
const trouverReservationController = require('../controllers/trouverControllers/trouverReservationController');

router.get('/api/data/livres', trouverLivreController.getAllBooks);
router.get('/api/data/uniqueBook', trouverLivreController.getAllUniqueBook);
router.get('/api/data/livreById/:id', trouverLivreController.getBookById);


router.get('/api/data/auteurs', trouverAuteurController.getAllAuteurs);

router.get('/api/data/editeurs', trouverEditeurController.getAllEditeurs);
router.get('/api/data/editeurById/:id', trouverEditeurController.getEditeurById);


router.get('/api/data/users', ensureAuthenticated, ensureRole, trouverUserController.getAllUsers);

router.get('/api/data/reservations', ensureAuthenticated, ensureRole, trouverReservationController.getAllReserve);
router.get('/api/data/reservationsUser/:id', ensureAuthenticated, trouverReservationController.getReservationByUser);

router.get('/api/data/emprunts', ensureAuthenticated, ensureRole, trouverEmpruntController.getAllEmprunts);
router.get('/api/data/empruntsDetails', ensureAuthenticated, ensureRole, trouverEmpruntController.getEmpruntsDetails);
router.get('/api/data/empruntsDetailsUser', ensureAuthenticated, ensureRole, trouverEmpruntController.getEmpruntsDetailsUser);
router.get('/api/data/empruntsUser/:id', ensureAuthenticated, trouverEmpruntController.getEmpruntsByUser);

module.exports = router;