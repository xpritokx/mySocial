var UserDb = require('../models/user').User;
var PostDb = require('../models/post').Post;
var mongoose = require('mongoose');
var fs = require('fs');
var multiparty = require('multiparty');


module.exports = function () {
    this.getAllPosts = function (req, res, next) {
        var newPostColl = [];
        var masFriends = [];

        PostDb.find({}, function (err, posts) {
            if (err) {
                return next(err);
            }

            UserDb.findById(req.session.user.userId, function (err, user) {
                if (err) {
                    return next(err);
                }
                var i;

                masFriends = user.friends;
                console.log('userFriends ', masFriends);

                for (i = 0; i < posts.length; i++) {
                    if ((masFriends.indexOf(posts[i].createrId) >= 0) || (posts[i].createrId === req.session.user.userId)) {
                        newPostColl.push(posts[i]);
                    }
                }

                res.status(200).send(newPostColl);
            });
        });
    };

    this.createPost = function (req, res, next) {
        console.log('i am here in upload image for post!!!');

        //parsing Form
        var form = new multiparty.Form();

        form.parse(req, function (err, fields, files) {
            var img = files.postImage[0];
            console.log('size post img => ', img.size);

            if (img.size) {
                fs.readFile(img.path, function (err, data) {
                    if (err) {
                        return next(err);
                    }

                    var path = './public/images/' + img.originalFilename;

                    //writing file
                    fs.writeFile(path, data, function (err) {
                        if (err) {
                            next(err);
                        }
                    });

                    UserDb.findOne({_id: req.session.user.userId}, function (err, user) {
                        if (err) {
                            return next(err);
                        }

                        //creating new post
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

                        res.redirect('/#showPosts');
                    });
                });
            } else {
                res.redirect('/#showPosts');
            }
        });
    };

    this.deletePost = function (req, res, next) {
        var id = req.params.id;

        //function which find post by id and delete
        function delPost() {
            PostDb.findByIdAndRemove(id, function (err, post) {
                if (err) {
                    return next(err);
                }
                console.log('im here!');
                res.status(200).send(post);
            });
        }

        PostDb.findById(id, function (err, post) {
            if (err) {
                return next(err);
            }

            //post deleting has order only owner or admin
            if (!req.session.user.admin) {

                if (req.session.user.userId !== post.createrId){
                    console.log('im not!');
                    res.status(401).send();
                } else {
                    delPost();
                }
            } else {
                delPost();
            }
        });
    };

};