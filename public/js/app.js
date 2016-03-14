define([
    'Backbone',
    'Underscore',
    'jQuery',

    'models/changeState',

    'views/user/form',
    'views/user/list',
    'collections/user',

    'views/post/form',
    'views/post/list',
    'collections/post',

    'views/register/form',
    'views/login/form',
    'views/restore/form',
    'views/chat/chat',
    'views/correspondence/correspondence',

    'collections/friend',

    'helpers/currModel',
    'helpers/hideFriends',
    'helpers/showUpdateButton',

    'text!templates/welcomePage.html',
    'text!templates/restorePasswordPage1.html',
    'text!templates/userListBlock.html',
    'text!templates/postBlockPage.html',
    'text!templates/chatPage.html',
    'text!templates/uploadFilePage.html',
    'text!templates/sendInvitePage1.html',

    'router'
], function (
    Backbone,
    _,
    $,

    ChangeStateModel,

    UserPagesView,
    NewUserPageView,
    UserPagesCollection,

    PostsView,
    NewPostView,
    PostsCollection,

    RegisterPageView,
    LoginPageView,
    RestorePageView,
    ChatView,
    CorrespondenceView,

    FriendsPagesCollection,

    currModel,
    hideFriends,
    showUpdateButton,

    welcomeTemp,
    restoreTemp,
    userListBlockTemp,
    postBlockPageTemp,
    chatTemp,
    uploadFilePageTemp,
    sendInvitePageTemp,

    Router
) {
    var userViewInstance;
    var postsViewInstance;
    var friendsViewInstance;
    var chatViewInstance;
    var correspondenceViewInstance;

    var userColInstance;
    var postColInstance;
    var friendsColInstance;
    var chatColInstance;

    Date.prototype.getMonthName = function() {
        var month = ['Jan','Feb','Mar','Apr','May','Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'];
        return month[this.getMonth()];
    };

    Date.prototype.adecvatFormat = function() {
        var monthMas = ['Jan','Feb','Mar','Apr','May','Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'];

        var day = this.getDate().toString();
        var month = this.getMonth();
        var year = this.getFullYear().toString();

        var hours = this.getHours();
        var minutes = this.getMinutes();
        var seconds = this.getSeconds();

        return monthMas[month] + "-" + day + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
    };

    GLOBAL = {};

    function init () {
        GLOBAL.postColInstance = new PostsCollection();

        GLOBAL.userColInstance = new UserPagesCollection();

        GLOBAL.friendsColInstance = new FriendsPagesCollection();


        GLOBAL.initUsers();
        GLOBAL.initFriends();
        GLOBAL.initPosts();

    }

    GLOBAL.getUserInstance = function () {
        return userViewInstance
    };

    GLOBAL.getFriendsInstance = function () {
        return friendsViewInstance
    };

    GLOBAL.getPostsInstance = function () {
        return postsViewInstance
    };

    GLOBAL.initUsers = function () {
        return userViewInstance = new UserPagesView({collection: GLOBAL.userColInstance});
    };

    GLOBAL.initPosts = function () {
        return postsViewInstance = new PostsView({collection: GLOBAL.postColInstance});
    };

    GLOBAL.initFriends = function () {
        return friendsViewInstance = new UserPagesView({collection: GLOBAL.friendsColInstance});
    };

    GLOBAL.initChat = function (currentUserModel) {
        if (!chatViewInstance) {
            chatViewInstance = new ChatView({model: currentUserModel});
        } else {
            chatViewInstance.model = currentUserModel;
            chatViewInstance.render();
        }
    };

    GLOBAL.initCorrespondence = function (model) {
        if (!correspondenceViewInstance) {
            correspondenceViewInstance = new CorrespondenceView({model: model});
        } else {
            correspondenceViewInstance.model = model;
            correspondenceViewInstance.render();
        }
    };

    Backbone.Model.prototype.idAttribute = "_id";



    GLOBAL.router = new Router();

    return {
        init: init
    }
});
