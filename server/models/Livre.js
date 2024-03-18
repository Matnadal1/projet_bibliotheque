const mongoose = require('mongoose');

const LivreSchema = new mongoose.Schema({
    titre: {
      type: String,
      required: true
    },
    couverture: {
      type: String,
    },
    auteur: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auteurs',
        required: true
    }],
    editeur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'editeurs',  
        required: true,
    },
    ISBN: {
      unique: true,
      required: true,
      type: String,
      /*validate: {
            validator: function(isbn) {
                // Supprimer les tirets et vérifier la longueur
                isbn = isbn.replace(/-/g, '');
                if (isbn.length !== 10 && isbn.length !== 13) {
                    return false;
                }

                // Vérifier si le dernier caractère est un 'X' valide pour ISBN-10
                if (isbn.length === 10 && isbn[9].toUpperCase() === 'X') {
                    return true;
                }

                // Vérifier si l'ISBN-13 est valide
                if (isbn.length === 13) {
                    let sum = 0;
                    for (let i = 0; i < 12; i++) {
                        sum += (parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3));
                    }
                    const checksum = (10 - (sum % 10)) % 10;
                    return parseInt(isbn[12]) === checksum;
                }

                // Vérifier si l'ISBN-10 est valide
                if (isbn.length === 10) {
                    let sum = 0;
                    for (let i = 0; i < 9; i++) {
                        sum += (parseInt(isbn[i]) * (10 - i));
                    }
                    let checksum = isbn[9].toUpperCase();
                    if (checksum === 'X') {
                        checksum = 10;
                    } else {
                        checksum = parseInt(checksum);
                    }
                    return (sum + checksum) % 11 === 0;
                }

                return false;
            },
            message: props => `${props.value} n'est pas un ISBN valide.`
        }*/
    },
    date_parution: {
      type: Number,
    },
    categorie: {
        type: String,  
    },
    sous_categorie: {
        type: String,
    },
    tag: {
        type: Array
    },
    description: {
        type: String
    },
    statut: {
        enum: ['disponible','réservé','emprunté','en litige'],
        type: String,
        required: true,
        default: 'disponible'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
});

LivreSchema.pre('save', function(next) {
  const currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.created_at) {
      this.created_at = currentDate;
  }
  next();
});

const Livre = mongoose.model('livres', LivreSchema);
module.exports = Livre;
