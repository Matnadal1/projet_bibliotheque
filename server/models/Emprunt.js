const mongoose = require('mongoose');

//------------ Emprunt Schema ------------//
const EmpruntSchema = new mongoose.Schema({
  livre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'livres',  
    required: true,
  },
  adherent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', 
    required: true,
  },
  etat: {
    type: String,
    enum: ['en cours','archivé','en retard'],
    required: true,
    default: 'en cours'
  }
}, { 
  timestamps: true 
})

const Emprunt = mongoose.model('emprunts', EmpruntSchema);

module.exports = Emprunt;
