module.exports = function(req, res, next){
    var err;

    if(!req.session || !req.session.user){
        err = new Error('Forbidden');
        err.status = 403;

        return next(err);
    }

    next();
};