const mongoose = require('mongoose');

//------------ Reserve Schema ------------//
const ReserveSchema = new mongoose.Schema({
  livre: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'livres',
     required: true,
  },
  adherent:   {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
}, {
  timestamps: true
})

const Reserve = mongoose.model('reserves', ReserveSchema);

module.exports = Reserve;