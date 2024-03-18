const mongoose = require('mongoose');


//------------ User Schema ------------//
const UserSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  adresse: {
    rue: {
      type: String,
      default: ''
    },
    numero: {
      type: Number,
      default: ''
    },
  },
  role: {
    type: String,
    enum: [
      'libraire',
      'client',
      'adhérent',
    ],
    default: 'adhérent',
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  resetLink: {
    type: String,
    default: ''
  },

}, { timestamps: true });

const User = mongoose.model('users', UserSchema);

module.exports = User;