/**
 * Created by Pritok on 03.03.2016.
 */
var sendEmail = require('../helpers/sendEmail');
var multiparty = require('multiparty');
var mongoose = require('mongoose');
var UserDb = require('../models/user').User;
var crypto = require('crypto');

var token;

//description environment variable
var env = process.env.NODE_ENV;
console.log('project in ', env);
require('../config/' + env);

var DB_HOST = process.env.DB_HOST;
var PORT = process.env.PORT;

module.exports = function() {
    this.changePass = function (req,res, next) {
        var sessionToken = req.session.restore.token;
        var sessionUserId = req.session.restore.userId;
        console.log('i restore fan');
        console.log(sessionToken);
        console.log(sessionUserId);
        console.log(req.body);
        console.log(req.body.pass);

        if (req.params.token === sessionToken) {
            UserDb.findById(sessionUserId, function(err, user){
                if (err) {
                    return next(err)
                }

                console.log('password updated!');
                console.log(user.get('password'));
                console.log(req.body.pass);
                user.set('password', req.body.pass);
                user.save();

                console.log(user);
                req.session.destroy();

                res.redirect('/#main')
            });
        } else {
            res.redirect('/#main')
        }
    };


    this.redirectToRestore = function (req,res, next) {
        var emailToken = req.params.token;
        var sessionToken = req.session.restore.token;

        if (emailToken === sessionToken) {
            res.redirect('/#restorePass/' + emailToken)
        } else {
            res.redirect('/#main')
        }
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
                    token = crypto.createHash('sha1').digest('hex');
                    console.log('hex ', token);

                    req.session.restore = {
                        userId: user._id,
                        token: token
                    };

                    console.log(req.session.restore);


                    sendEmail(fields.email[0], user.get('username') + ' you password is here!', 'Hello ' + user.get('username') + ' your password from Public House is ' + DB_HOST + ':' + PORT + '/sendRestore/' + token);

                    res.redirect('/#main');
                }
            });
        });
    };
};


