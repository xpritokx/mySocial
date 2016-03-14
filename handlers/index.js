var UserDb = require('../models/user').User;
var fs = require('fs');
var sendEmail = require('../helpers/sendEmail');
var multiparty = require('multiparty');
var mongoose = require('mongoose');


module.exports = function () {
    this.sendEmail = function (req, res, next) {
        //parsing html form
        var form = new multiparty.Form();

        form.parse(req, function (err, fields, files) {
            UserDb.findById(req.session.user.userId, function (err, user) {
                if (err) {
                    next(err);
                }

                var sender = user.username;

                //send email-message for invite to our social network
                sendEmail(fields.email[0], sender + ' welcomes you!', 'Hello i want to invite you in the Public House! Just click in this link www.publichouse.com.ua');

                res.redirect('/#showUsers');
            });
        });
    };

    this.exitUser = function (req, res, next) {
        req.session.destroy();
        console.log('Session Destroyed!!!');
        res.redirect('/#main');
    };

    this.upData = function (req, res, next) {
        //parsing html form
        var form = new multiparty.Form();

        form.parse(req, function (err, fields, files) {

            var img = files.images[0];

            fs.readFile(img.path, function (err, data) {
                var path = './public/images/' + img.originalFilename;

                fs.writeFile(path, data, function (err) {
                    if (err) {
                        next(err);
                    }
                });

                UserDb.update({_id: req.session.user.userId}, {img: (path).slice(9)}, function () {
                    console.log('Img Updated!');
                });


                res.redirect('/#showUsers');
            });
        });
    };
};