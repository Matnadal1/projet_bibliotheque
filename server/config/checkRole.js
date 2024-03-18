module.exports = {
    ensureRole: function (req, res, next) {
        if (req.user.role === "libraire") {
            return next();
        }
        req.flash('error_msg', 'Vous devez être libraire !');
        res.redirect('/pageCatalogue');
    },
};