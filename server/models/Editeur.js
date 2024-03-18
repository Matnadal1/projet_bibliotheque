const mongoose = require('mongoose');

//------------ Editeur Schema ------------//
const EditeurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  description: {
    type: String,
  }
}, { 
  timestamps: true 
})

const Editeur = mongoose.model('editeurs', EditeurSchema);

module.exports = Editeur;