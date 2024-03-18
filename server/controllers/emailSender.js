const nodemailer = require('nodemailer');
const Emprunt = require('../models/Emprunt');
require('dotenv').config();

const dateLimite = new Date();
dateLimite.setDate(dateLimite.getDate() - 30);

const getEmpruntRetard = async () => {
  try {
    // Mettez à jour les emprunts "En cours" qui ont dépassé la date limite à "En retard"
    await Emprunt.updateMany(
      {
        etat: 'En cours',
        createdAt: { $lt: dateLimite },
      },
      { $set: { etat: 'en retard' } }
    );

    // Récupérez la liste des emprunts "En retard"
    const empruntsRetardList = await Emprunt.aggregate([
      {
        $match: {
            etat: 'en retard',  // Sélectionne les emprunts "En retard"
            createdAt: { $lt: dateLimite },
        },
      },
      {
        $lookup: {
          from: 'users', // Nom de la collection des utilisateurs
          localField: 'adherent',
          foreignField: '_id',
          as: 'utilisateur',
        },
      },
      {
        $unwind: '$utilisateur',
      },
      {
        $project: {
          _id: '$utilisateur._id',
          nom: '$utilisateur.nom',
          email: '$utilisateur.email',
          etat: 1,
          createdAt: 1,
        },
      },
    ]);

    return empruntsRetardList;
  } catch (err) {
    console.error(err);
    throw new Error('Erreur lors du chargement des adhérents');
  }
};

// Paramètres du compte Outlook utilisé pour l'envoi du courriel
const config = {
  email: process.env.EMAIL_ADRESS,
  password: process.env.EMAIL_PASSWORD,
};

// Créez un objet transporter réutilisable
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: config.email,
    pass: config.password,
  },
  port: 587,
});

let amende = 5; // Initialisez l'amende à zéro

// Fonction pour envoyer un e-mail
const envoyerMail = async () => {
  try {
    const dateActuelle = new Date();
    const optionsDate = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const empruntsRetardList = await getEmpruntRetard();
    for (const empruntRetard of empruntsRetardList) {
      const dateRetour = new Date(empruntRetard.createdAt);
      const joursRetard = Math.max(Math.ceil((dateActuelle - dateRetour) / (1000 * 60 * 60 * 24)) - 30, 0);
      const amende = joursRetard * 5;
      const mailOptions = {
        from: config.email,
        to: empruntRetard.email,
        subject: 'Retard de rendu',
        text: `
          Bonjour, \n Si vous recevez ce mail, c'est qu'il y a un retard sur le rendu du livre que vous avez emprunté. \n Nous vous invitons à retourner le livre au plus vite, votre amande s'élève actuellement à ${amende}€. \n En vous souhaitant une bonne journée.

          Date : ${dateActuelle.toLocaleDateString('fr-FR', optionsDate)}
        `,
      };

      await transporter.sendMail(mailOptions);
    }
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = envoyerMail;