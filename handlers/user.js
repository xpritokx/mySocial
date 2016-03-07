var sendEmail = require('../helpers/sendEmail');
var UserDb = require('../models/user').User;
var geoLock = require('../helpers/findLocation');


module.exports = function () {
    this.getOneUser = function (req, res, next) {
        var id = req.session.user.userId;
        console.log('i get one user');

        UserDb.findById(id, {hashedPassword: 0}, function (err, user) {
            if (err) {
                return next(err);
            }
            user.set({dist: geoLock(req.session.user.coords.latitude, user.coords.latitude, req.session.user.coords.longitude, user.coords.longitude)});


            res.status(200).send(user);
        });
    };

    this.getAllUser = function (req, res, next) {
        var i;

        UserDb.find({}, {hashedPassword: 0}, function (err, users) {
            if (err) {
                return next(err);
            }

            if (req.session.user) {
                for (i = 0; i < users.length; i++) {
                    users[i].set({dist: geoLock(req.session.user.coords.latitude, users[i].coords.latitude, req.session.user.coords.longitude, users[i].coords.longitude)});
                    console.log('geolockation for ', users[i].username, users[i].dist);
                }
            } else {
                for (i = 0; i < users.length; i++) {
                    users[i].set({dist: geoLock(0, users[i].coords.latitude, 0, users[i].coords.longitude)});
                    console.log('geolockation for ', users[i].username, users[i].dist);
                }
            }

            res.status(200).send(users);
        });

    };



    this.updateUser = function (req, res, next) {
        var id = req.params.id;
        var body = req.body;

        console.log('Receive an UPDATE request for _id: ' + req.params.id);

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

        console.log('Receive a DELETE request for _id: ' + id);

        UserDb.findByIdAndRemove(id, function (err, user) {
            if(err) {
                return next(err);
            }

            res.status(200).send(user);
        });
    };
};