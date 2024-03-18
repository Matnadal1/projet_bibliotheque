const ExcelJS = require('exceljs');
const fs = require('fs');
const Emprunt = require('../models/Emprunt');
const User = require('../models/User');
const Livre = require('../models/Livre');

exports.exportEmpruntsToExcel = async (req, res) => {
  try {
    const emprunts = await Emprunt.find().populate('adherent').populate('livre');
    console.log(emprunts);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Emprunts');

    // Définir la largeur des colonnes (en caractères)
    worksheet.columns = [
      { header: 'Livre', key: 'livre', width: 20 },
      { header: 'Emprunteur', key: 'emprunteur', width: 20 },
      { header: 'État', key: 'etat', width: 10 },
      { header: 'Date d\'emprunt', key: 'creation', width: 20 },
      { header: 'Date de retour', key: 'retour', width: 20 }
    ];

    emprunts.forEach(emprunt => {
      const livres = `${emprunt.livre.titre}`;
      const emprunteur = `${emprunt.adherent.prenom} ${emprunt.adherent.nom}`;
      const creation = new Date(`${emprunt.createdAt}`);
      const retour = new Date(`${emprunt.createdAt}`);
      retour.setDate(retour.getDate() + 30);
      worksheet.addRow({ livre: livres, emprunteur: emprunteur, etat: emprunt.etat, creation: creation, retour: retour });
    });

    const filePath = './emprunts.xlsx';

    try {
      await workbook.xlsx.writeFile(filePath);
      console.log('Fichier Excel créé avec succès :', filePath);

      const titresLivres = emprunts.map(emprunt => emprunt.livre.titre);

      // Envoi du fichier en tant que réponse avec res.download
      res.download(filePath, 'emprunts.xlsx', (err) => {
        if (err) {
          console.error('Erreur lors de l\'envoi du fichier Excel :', err);
          req.flash('error_msg', 'Erreur lors de l\'envoi du fichier Excel');
          res.redirect(`/monCompte`);
        }
      });
    } catch (err) {
      console.error('Erreur lors de la création du fichier Excel :', err);
      req.flash('error_msg', 'Erreur lors de la création du fichier Excel');
      res.redirect(`/monCompte`);
    }
  } catch (err) {
    console.error('Erreur lors de la récupération des données :', err);
    req.flash('error_msg', 'Erreur lors de la récupération du fichier');
    res.redirect(`/monCompte`);
  }
};
