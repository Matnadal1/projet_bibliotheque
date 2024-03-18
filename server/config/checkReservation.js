const Reserve = require('../models/Reservation');
const Livre = require('../models/Livre')
exports.suppReserve = async () => {
    const reserveList = await Reserve.find();
    reserveList.forEach(async reservation => {
        try {
            if ((new Date() - reservation.createdAt) / (1000 * 60 * 60 * 24) >= 5) {
                const livre = await Livre.findById(reservation.livre);
                console.log(livre)
                livre.status = 'disponible';
                livre.save();
                await Reserve.deleteOne({_id: reservation._id});
            }
        } catch (err) {
            console.error("Erreur lors de la suppression :", error);
        }
    });
}