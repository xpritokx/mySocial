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

    this.restorePass = function (req,res, next) {

        var form = new multiparty.Form();

        form.parse(req, function (err, fields, files) {

            UserDb.findOne({email: fields.email}, function (err, user) {

                if (!user) {
                    console.log('user with this email is not found!');
                    res.redirect('/#main');
                } else {

                    console.log(user.get('username'));
                    sendEmail(fields.email[0], user.get('username') + ' you password is here!', 'Hello ' + user.get('username') + ' your password from Public House is ' + user.get('password'));

                    res.redirect('/#main');
                }
            });
        });


    };

    this.changeState = function (req, res, next) {
        UserDb.update({_id: req.body.userId}, {applied: true}, function () {
            console.log("state is updated!");
            res.status(200).send();
        })
    }
};