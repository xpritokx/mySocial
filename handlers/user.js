var sendEmail = require('../helpers/sendEmail');
var UserDb = require('../models/user').User;
var geoLock = require('../helpers/findLocation');


module.exports = function () {
    this.getOneUser = function (req, res, next) {
        var id = req.params.id;

        //console.log('im get model');

        if (id === 'id_for_URL/:id') {
            id = req.session.user.userId;
        }

        UserDb.findById(id, {hashedPassword: 0}, function (err, user) {
            if (err) {
                return next(err);
            }

            if (user) {
                //computing distance for one user
                user.set({dist: geoLock(req.session.user.coords.latitude, user.coords.latitude, req.session.user.coords.longitude, user.coords.longitude)});

                //console.log(user);
                res.status(200).send(user);

            } else {
                res.status(200).send();
            }
        });
    };

    this.getAllUser = function (req, res, next) {
        var i;

        UserDb.find({}, {hashedPassword: 0}, function (err, users) {
            if (err) {
                return next(err);
            }

            //computing distance for each user
            if (req.session.user) {
                for (i = 0; i < users.length; i++) {
                    users[i].set({dist: geoLock(req.session.user.coords.latitude, users[i].coords.latitude, req.session.user.coords.longitude, users[i].coords.longitude)});
                }
            } else {
                for (i = 0; i < users.length; i++) {
                    users[i].set({dist: geoLock(0, users[i].coords.latitude, 0, users[i].coords.longitude)});
                }
            }

            res.status(200).send(users);
        });

    };



    this.updateUser = function (req, res, next) {
        var id = req.params.id;
        var body = req.body;

        UserDb.findByIdAndUpdate(id, {$set: body}, {new: true}, function (err, user) {
            if (err) {
                return next(err);
            }

            delete user.hashedPassword;

            res.status(200).send(user);
        })
    };

    this.deleteUser = function (req, res, next) {
        var id = req.params.id;

        UserDb.findById(id, function (err, user) {

            //admin can delete each user
            if (!req.session.user.admin) {

                console.log('usId = >', user._id, "reqSessionId = >", req.session.user.userId);
                //if user delete self that destroying session
               if (user._id == req.session.user.userId) {

                   UserDb.findByIdAndRemove(id, function (err, user) {
                       if (err) {
                           return next(err);
                       }
                       console.log('user ', user._id, 'is deleted...')
                       req.session.destroy();

                       res.redirect('/#main');
                   });
               } else {
                   res.status(401).send();
               }
            } else {
                UserDb.findByIdAndRemove(id, function (err, user) {
                    if (err) {
                        return next(err);
                    }

                    delete user.hashedPassword;

                    res.status(200).send(user);
                });
            }
        });
    };
};