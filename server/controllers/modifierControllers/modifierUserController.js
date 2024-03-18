const User = require('../../models/User');
const authController = require('../authController')


exports.modifierUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const updatedUser = await User.findOne({ _id: userId });

        updatedUser.nom = req.body.nom || updatedUser.nom;
        updatedUser.prenom = req.body.prenom || updatedUser.prenom;
        updatedUser.adresse.rue = req.body.rue || updatedUser.adresse.rue;
        updatedUser.adresse.numero = req.body.numero || updatedUser.adresse.numero;

        if (req.body.email && req.body.email !== req.user.email) {
            // Vérifier si le nouvel e-mail est déjà enregistré
            const isEmailUnique = await User.findOne({ email: req.body.email });
            if (isEmailUnique) {
                req.flash('error_msg', 'This email is already registered.');
                return res.redirect('/modifUser');
            }
            authController.changeMail(req, res, updatedUser.nom, updatedUser.prenom, req.body.email, updatedUser.email, updatedUser.password)
            req.flash('success_msg', 'Un email de confirmation a été envoyer a votre adresse');
        } else {
            req.flash('success_msg', 'Profile updated successfully.');
        }

        // Sauvegarder les modifications dans la base de données
        await updatedUser.save();

        console.log(updatedUser);
        res.redirect('/monCompte');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error updating profile.');
        res.redirect('/monCompte');
    }
};