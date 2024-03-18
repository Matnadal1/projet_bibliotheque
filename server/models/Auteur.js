const mongoose = require('mongoose');

const Livre = require('./Livre')
//------------ Auteur Schema ------------//
const AuteurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  description: {
    type: String,
  }
}, { 
  timestamps: true 
})

const Auteur = mongoose.model('auteurs', AuteurSchema);

module.exports = Auteur;