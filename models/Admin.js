/**
 * Created by Pritok on 16.02.2016.
 */
//var util = require('util');
var User = require('./User');
var Admin = function(){
    User.User.apply(this,arguments)
};
var inherits = require('../utilites/inherits');

Admin.prototype.deletePosts = function(postId){};
Admin.prototype.deleteUsers = function(userId){};

inherits(Admin, User.User);

//adm = new Admin("Igor", 6, 5, 4, 3, 2);
//console.log(adm);

//adm = new User.User("Roma", 1, 2, 3, 4, 5);
//console.log(adm);


exports.Admin = Admin;