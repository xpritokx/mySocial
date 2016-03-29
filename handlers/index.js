var UserDb = require('../models/user').User;
var CountDb = require('../models/count_messages').Count;

var fs = require('fs');
var sendEmail = require('../helpers/sendEmail');
var multiparty = require('multiparty');
var mongoose = require('mongoose');

//description environment variable
//var env = process.env.NODE_ENV;
require('../config/' + process.env.NODE_ENV);

var DB_HOST = process.env.DB_HOST;
var PORT = process.env.PORT;


module.exports = function () {

    this.getCountMessages = function (req, res, next) {
        var id = req.params.id;

        console.log('id getting count user = > ', id);

        CountDb.findOne({username: id}, function(err, counter) {
            if (err) {
                next(err)
            }

            if (counter) {
                res.status(200).send(counter);
            } else {
                res.status(200).send({});
            }
        })
    };

    this.updateCountMessages = function (req, res, next) {
        var id = req.params.id;
        var body = req.body;


        console.log('id updating count user = > ', id);
        console.log('body updating count user = > ', body);

        //find counter messages for current user
        CountDb.findOne({username: id}, function (err, counter) {
            if (err) {
                return next(err)
            }
            var newCount;
            var count;

            console.log('counter for updating => ', counter);

            if (counter) {

                //if counter is it then updating data for counter Messages for user
                CountDb.update({username: id}, {data: body.data}, function(err, result) {
                    console.log('update for self');
                    if (err) {
                       return next(err);
                    }

                    var strg = '{"$inc": {"data.' + id + '": 1}}';

                    // for current user is not incrementing counter
                    if (id === body.opponent) {
                        res.status(200).send(result);
                    } else {
                        CountDb.update({username: body.opponent}, JSON.parse(strg), function (err, result) {
                            if (err) {
                                return next(err);
                            }

                            console.log('updating opponent user =>', result);

                            //if counter opponent is none then creating new counter for opponent
                            if (result.nModified) {
                                console.log('update for opponent');

                                res.status(200).send(result);
                            } else {
                                console.log('create new, and update for opponent');

                                count = {
                                    username: body.opponent,
                                    data: {}
                                };

                                count.data[id] = 1;

                                newCount = new mongoose.models.Count(count);
                                console.log('new opponent saved');

                                newCount.save(function(err, count) {
                                    if (err) {
                                        return next(err)
                                    }

                                    res.status(200).send(count);
                                });
                            }
                        });
                    }
                });
            } else {
                //creating new counter for user

                count = {
                    username: id,
                    data: body.data
                };

                newCount = new mongoose.models.Count(count);
                console.log('new user saved');

                newCount.save(function(err, count) {
                    if (err) {
                       return next(err)
                    }

                    res.status(200).send(count);
                });
            }
        });
    };

    this.sendEmail = function (req, res, next) {

        //parsing html form
        var form = new multiparty.Form();

        form.parse(req, function (err, fields, files) {
            UserDb.findById(req.session.user.userId, function (err, user) {
                if (err) {
                    return next(err);
                }

                var sender = user.username;

                //sending email-message for invite to our social network
                sendEmail(fields.email[0],'hello ' + sender + ' welcomes you!', 'Hello i your friend ' + req.session.user.username + ' and want to invite you in amazing social network the VRakashI! Just click in this link http://' + DB_HOST + ":" + PORT + '/#register/' + fields.email[0]);

                res.redirect('/#showAll');
            });
        });
    };

    this.exitUser = function (req, res, next) {

        //destroying current user session
        req.session.destroy(function(err) {
            if (err) {
                console.log('i can not delete session')
            }
        });

        console.log('Session Destroyed!!!');

        res.redirect('/#main');
    };

    this.upData = function (req, res, next) {

        //parsing html form
        var form = new multiparty.Form();

        form.parse(req, function (err, fields, files) {

            var img = files.images[0];

            //reading data for network by specified path
            fs.readFile(img.path, function (err, data) {
                var path = './public/images/' + img.originalFilename;

                //writing data by specified path in our directory
                fs.writeFile(path, data, function (err) {
                    if (err) {
                        return next(err);
                    }
                });

                //updating info of image for user by id
                UserDb.update({_id: req.session.user.userId}, {img: (path).slice(9)}, function () {
                    console.log('Img Updated!');
                });

                res.redirect('/#showAll');
            });
        });
    };
};