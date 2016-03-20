module.exports = function(req, res, next) {
    var err;

    //if session.user not found that generating Error status 403
    if (!req.session || !req.session.user) {
        err = new Error('Forbidden');
        err.status = 403;

        return next(err);
    } else {
        next();
    }
};