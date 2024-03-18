const { ObjectId } = require('mongodb');
const Emprunt = require('../../models/Emprunt');
const Livre = require('../../models/Livre');
const User = require('../../models/User')

exports.creerPretH = async (req, res) => {
    let errors = [];
    const liste_livre = Array.isArray(req.body.livre) ? req.body.livre : [req.body.livre];
    const email = req.body.user;
    const user = await User.findOne({email: email});
    // on vérifie que l'utilisateur existe
    if (!user) {
        req.flash('error_msg', 'Utilisateur introuvable.');
        res.redirect(`/creerPret`);
    }
    // on vérifie qu'il ne dépasse pas la limite de livre emprunté
    const nombreReservations = await Emprunt.countDocuments({ adherent: user._id, etat: { $ne: 'archivé' } })
    if (nombreReservations >= 5) {
        req.flash('error_msg', 'Vous avez déjà emprunté 5 livres. Vous ne pouvez pas faire de nouveaux emprunts.');
        res.redirect(`/creerPret`);
    }
    // on démarre une session mongoose pour s'assurer que toutes les requetes sont bien réalisé avant de les confirmés
    try {
        // boucle pour créer UN ou PLUSIEURS pret(s) si le client emprunte plusieurs livres
        for (const livreBrut of liste_livre) {
            const error = await creerPretIndiv(livreBrut, user)
            console.log(error)
            if (error) {
                errors.push(error);
            }
        }
        // si il y a une erreur, le pret est abandonné
        if (errors.length > 0) {
            res.render('creerPret', { errors }); 
        } else {
            req.flash('success_msg', 'Réservations Confirmées !');
            res.redirect('/creerPret');
        }
    } catch (err) {
        req.flash('error_msg', 'Il y a eu un problème lors de l\'emprunt');
        console.log(err)
        res.redirect('/creerPret');
    }
};

// permet de créer UN pret
async function creerPretIndiv(livreBrut, user) {
    const critereRecherche = critere(livreBrut);
    const livre = await Livre.findOne(critereRecherche);
    if (!livre) {
        return {msg: 'Erreur lors de la recherche du livre : ' + livre.titre};
    } else {
        try {
            const newEmprunt = new Emprunt({
                adherent: user._id,
                livre: livre._id,
            });
            await newEmprunt.save();
            livre.statut = 'emprunté';
            await livre.save();
        } catch (err) {
            return {msg: err};
        }
    }
    return null;
};

// récupère les infos du livre et les transforme en données que mongoose comprend
function critere(livre) {
    objetId = livre.replace(/#/g, " ");
    const { 0: titre, 1: auteur, 2: editeur } = objetId.split("_");
    const auteurList = auteur.split(",").map(auteur => ObjectId(auteur.trim()));
    const critereRecherche = {
        titre: titre.toString(),
        auteur: auteurList,
        editeur: ObjectId(editeur),
        statut: "disponible"
    }; 
    return critereRecherche
};

