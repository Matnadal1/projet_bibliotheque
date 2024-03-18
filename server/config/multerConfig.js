// config/multerConfig.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/assets/img/couvertures/'); 
    },
    filename: function (req, file, cb) {
        const titreSansEspaces = req.body.titre.replace(/\s+/g, '-').toLowerCase();
        cb(null, titreSansEspaces + '-' + Date.now() + path.extname(file.originalname));    
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Seules les images sont autorisées'));
    }
    cb(null, true);
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
