var UserDb = require('../models/user').User;
var PostDb = require('../models/post').Post;
var mongoose = require('mongoose');
var fs = require('fs');
var multiparty = require('multiparty');


module.exports = function () {
    this.getAllPosts = function (req, res, next) {

        PostDb.find({}, function (err, posts) {
            if (err) {
                return next(err);
            }

            posts.forEach(function (item) {
                console.log('Received a GET request for _id for /posts ' + item._id);
            });

            res.status(200).send(posts);
        });
    };

    this.createPost = function (req, res, next) {
        console.log('i am here in upload image for post!!!');

        var form = new multiparty.Form();

        form.parse(req, function (err, fields, files) {
            var img = files.postImage[0];

            fs.readFile(img.path, function (err, data) {
                if (err) {
                    return next(err);
                }

                var path = './public/images/' + img.originalFilename;

                fs.writeFile(path, data, function (err) {
                    if (err) {
                        next(err);
                    }
                });

                UserDb.findOne({_id: req.session.user.userId}, function (err, user) {
                    if (err) {
                        return next(err);
                    }

                    var post = {
                        'title'      : fields.postTitle[0],
                        'content'    : fields.postContent[0],
                        'img'        : (path).slice(9),
                        'createrId'  : user._id,
                        'createrInfo': {
                            'createrUsername' : user.username,
                            'createrImg'      : user.img
                        }

                    };

                    var postModel = new mongoose.models.Post(post);

                    postModel.save();

                    PostDb.find({}, function (err, posts) {
                        posts.forEach(function (item) {
                            console.log('Is created POST for _id ' + item._id);
                        });
                    });

                    res.redirect('/#showPosts');
                });
            });
        });
    };

    this.deletePost = function (req, res, next) {
        var id = req.params.id;

        console.log('Receive a DELETE request for _id: ' + id);

        PostDb.findByIdAndRemove(id, function (err, post) {
            if(err) {
                return next(err);
            }

            res.status(200).send(post);
        });
    };

};