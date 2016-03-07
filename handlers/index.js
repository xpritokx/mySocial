var UserDb = require('../models/user').User;
var fs = require('fs');
var sendEmail = require('../helpers/sendEmail');
var multiparty = require('multiparty');
var mongoose = require('mongoose');


module.exports = function() {
    this.sendEmail = function(req, res, next){
        console.log('Receive a POST request, EMAIL');

        var form = new multiparty.Form();

        form.parse(req, function (err, fields, files){
            UserDb.findById(req.session.user.userId, function (err, user) {
                if (err) {
                    next(err);
                }

                var sender = user.username;

                sendEmail(fields.email[0], sender + ' welcomes you!', 'Hello i want to invite you in the Public House! Just click in this link www.publichouse.com.ua');

                res.redirect('/#showUsers');
            });
        });
    };

    this.exitUser = function (req, res, next) {
        req.session.destroy();
        process.env.ID_USER = null;
        console.log('Session Destroyed!!!');
        res.redirect('/#main');
    };

    this.upData = function (req, res, next) {
        console.log('i am here in upload file!');

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
                UserDb.find(function(err, users) {
                    users.forEach(function(item) {
                        console.log('Is here a POST request for _id ' + item._id);
                        console.log('Is here a POST request for img ' + item.img);
                    });
                });

                res.redirect('/#showUsers');
            });
        });
    };


};