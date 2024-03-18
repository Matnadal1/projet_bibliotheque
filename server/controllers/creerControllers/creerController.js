const Livre = require('../../models/Livre');
const Auteur = require('../../models/Auteur');
const Editeur = require('../../models/Editeur');
const fs = require('fs');
const csv = require('csv-parser');



// Fonction pour afficher le formulaire d'ajout de livre
async function ajouterLivre(req, res) {
    try {
        console.log(req.body)
        const imageUrl = req.file ? req.protocol + '://' + req.get('host') + '/assets/img/couvertures/' + req.file.filename : req.protocol + '://' + req.get('host') + '/assets/img/couvertures/no_image.png';
        console.log(imageUrl);
        const isbnList = req.body.ISBN.split(',').map(isbn => isbn.trim()); // Divise la chaîne de caractères en une liste d'ISBN
        for (const isbn of isbnList) {
            const book = await Livre.findOne({ ISBN: isbn });
            if (!book) {
                const livre = new Livre({
                    titre: req.body.titre,
                    auteur: req.body.auteur,
                    editeur: req.body.editeur,
                    date_parution: req.body.date_parution,
                    categorie: req.body.categorie,
                    sous_categorie: req.body.categorieFilter,
                    tag: req.body['input-tags'],
                    description: req.body.description,
                    ISBN: isbn,
                    couverture: imageUrl
                })
                await livre.save();
                console.log(livre);
            } else {
                req.flash('error_msg', 'L\'ISBN est déja entré')
                res.redirect('/ajouter');
            }
        }
        req.flash('success_msg', 'Le/Les Livres ont été entrer avec succés')
        res.redirect('/ajouter');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Erreur d\'ajout du livre');
        res.redirect('/ajouter');
    }
};
async function ajouterAuteur(req, res) {
    try {
        const { prenomAuteur, nomAuteur, description } = req.body;
        const auteur = await Auteur.findOne({ prenom: prenomAuteur, nom: nomAuteur});
        if (!auteur) {
            const nouveauAuteur = new Auteur({ nom: nomAuteur, prenom: prenomAuteur, description: description });
            await nouveauAuteur.save()
            console.log(nouveauAuteur);
            req.flash('success_msg', 'L\'auteur a été entrer avec succés')
            res.redirect('/ajouter');
        } else {
            req.flash('error_msg', 'L\'auteur est déja entré')
            res.redirect('/ajouter');
        }
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Erreur d\'ajout de l\'auteur');
        res.redirect('/ajouter');
    }
}

async function ajouterEditeur(req, res) {
    try {
        const { nomEditeur, description } = req.body;
        const editeur = await Editeur.findOne({ nom: nomEditeur });
        if (!editeur) {
            const nouveauEditeur = new Editeur({ nom: nomEditeur, description: description });
            await nouveauEditeur.save()
            console.log(nouveauEditeur);
            req.flash('success_msg', 'L\'éditeur a été entrer avec succés')
            res.redirect('/ajouter');
        } else {
            req.flash('error_msg', 'L\'éditeur est déja entré')
            res.redirect('/ajouter');
        }
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Erreur d\'ajout de l\'éditeur');
        res.redirect('/ajouter');
    }
}

module.exports = {
    ajouterLivre,
    ajouterAuteur,
    ajouterEditeur,
};




