/**
 * Created by Pritok on 16.02.2016.
 */
var User = function(username, password, email, birthday, addr, image) {
    this.username = username;
    this.password = password;
    this.eMail = email;
    this.birthday = birthday;
    this.addr = addr;
    this.image = image;
};

User.prototype.getAllInfo = function(){
    return [
        this.username,
        this.password,
        this.eMail,
        this.birthday,
        this.addr,
        this.image
    ]
};
User.prototype.login = function(user, password){};
User.prototype.searchFriends = function(username, addr){};
User.prototype.messageSend = function(username, textMessage){};
User.prototype.inviteFriends = function(email){};
User.prototype.recoverPassword = function(username, email){};
User.prototype.createPost = function(textMessage, image){};
User.prototype.changePost = function(userId, postId){};
User.prototype.changeUserInfo = function(userId){};


exports.User = User;