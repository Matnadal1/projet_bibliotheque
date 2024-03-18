const { ObjectId } = require('mongodb');
const Livre = require('../../models/Livre');
const Reserve = require('../../models/Reservation')
const User = require('../../models/User')


exports.creerReservation = async (req, res) => {
    const user = await User.findById(req.user.id);
    const titre = req.params.titre;
    const auteurs = req.params.auteur;
    const editeur = req.params.editeur;
    const auteurList = auteurs.split(";").map(auteur => ObjectId(auteur.trim()));
    let livreId = titre.toString() + '_' + auteurs.toString() + '_' + editeur.toString();
    console.log(livreId)
    livreId = livreId.replace(/ /g, "#");
    const critereRecherche = {
        titre: titre.toString(),
        auteur: auteurList,
        editeur: ObjectId(editeur),
        statut: "disponible"
    }; 

    if (!user) {
        req.flash('error_msg', 'Utilisateur introuvable.');
        return res.redirect(`/livre/${livreId}`);
    }

    const nombreReservations = await Reserve.countDocuments({ adherent: req.user.id });

    if (nombreReservations >= 5) {
        req.flash('error_msg', 'Vous avez déjà réservé 5 livres. Vous ne pouvez pas faire de nouvelles réservations.');
        return res.redirect(`/livre/${livreId}`);
    } 

    const livre = await Livre.findOne(critereRecherche);
    
    if (!livre) {
        req.flash('error_msg', 'Le livre est introuvable ou n\'est plus disponible');
        return res.redirect(`/livre/${livreId}`);
    }

    try {
        const newReservation = new Reserve({
            adherent: req.user.id,
            livre: livre._id,
        });
        newReservation.save();
        livre.statut = 'réservé';
        await livre.save();
        req.flash('success_msg', 'Réservation Confirmée !');
        res.redirect('/pageCatalogue');
    } catch (err) {
        req.flash('error_msg', 'Il y a eu un problème lors de la réservation');
        return res.redirect(`/livre/${livreId}`);
    }
};



