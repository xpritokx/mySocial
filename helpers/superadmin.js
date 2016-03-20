module.exports = function(req, res, next) {
    var err;

    if (req.session || req.session.user) {
        if (req.session.user.username === 'admin') {
            next();
        } else {
            if (req.params.id === req.session.user.userId) {
                next();
            } else {
                err = new Error('Forbidden');
                err.status = 403;

                return next(err);
            }
        }
    }
};