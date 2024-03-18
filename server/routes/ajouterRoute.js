const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');
const ajouterController = require('../controllers/creerControllers/creerController');
const { ensureRole } = require('../config/checkRole')
const upload = require('../config/multerConfig');



router.get('/ajouter', ensureAuthenticated, ensureRole,(req, res) => {
    res.render('ajout');
})

router.post('/ajouterLivre', ensureAuthenticated, ensureRole, upload.single('imageLivre'), ajouterController.ajouterLivre);
router.post('/ajouterAuteur', ensureAuthenticated, ensureRole, ajouterController.ajouterAuteur);
router.post('/ajouterEditeur', ensureAuthenticated, ensureRole, ajouterController.ajouterEditeur);


module.exports = router;
