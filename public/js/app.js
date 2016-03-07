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

    'collections/friend',

    'helpers/currModel',
    'helpers/showUpdateButton',

    'text!templates/welcomePage.html',
    'text!templates/restorePasswordPage1.html',
    'text!templates/userListBlock.html',
    'text!templates/postBlockPage.html',
    'text!templates/chatPage.html',
    'text!templates/uploadFilePage.html',
    'text!templates/sendInvitePage1.html'

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

    FriendsPagesCollection,

    currModel,
    showUpdateButton,

    welcomeTemp,
    restoreTemp,
    userListBlockTemp,
    postBlockPageTemp,
    chatTemp,
    uploadFilePageTemp,
    sendInvitePageTemp
) {
    var userViewInstance;
    var postsViewInstance;
    var friendsViewInstance;
    //router;

    var userColInstance;
    var postColInstance;
    var friendsColInstance;


    function init () {
        postColInstance = new PostsCollection();

        userColInstance = new UserPagesCollection();

        friendsColInstance = new FriendsPagesCollection();



        initUsers();
        initFriends();
        initPosts();

    }

    initUsers = function () {
        return userViewInstance = new UserPagesView({collection: userColInstance});
    };

    initPosts = function () {
        return postsViewInstance = new PostsView({collection: postColInstance});
    };

    initFriends = function () {
        friendsViewInstance = new UserPagesView({collection: friendsColInstance});
    };

    Backbone.Model.prototype.idAttribute = "_id";

    Router = Backbone.Router.extend({
        routes: {
            ''                  : 'main',
            'main'              : 'main',
            'logOut'            : 'main',
            'showUsers'         : 'showUsers',
            'showFriends'       : 'showFriends',
            'showPosts'         : 'showPosts',
            'sendEmail'         : 'sendEmail',
            'register'          : 'register',
            'login'             : 'login',
            'connected_user/:id': 'connUser',
            'changeLogo'        : 'changeLogo',
            'restorePage'       : 'restore',
            'restorePass/:token': 'restorePass',
            'chat'              : 'chat'
        },
        main: function() {
            currModel(function (currentUserModel) {
                if (!currentUserModel) {
                    console.log('We come to WELCOME PAGE now');

                    $('#posts-list').html('');
                    $('#containerHeader').hide();
                    $('#welcomeBlock').html('').css({opacity: 0}).animate(
                        {opacity: 1},
                        2000
                    ).show().append(_.template(welcomeTemp));

                    $('#signBut').show();
                    $('#regBut').show();
                    $('#postsBlock').hide();
                    $('#register-block').hide().html('');
                    $('#login-block').hide().html('');
                    $('#signOutBut').hide();
                } else {
                    console.log('cur = ', currentUserModel);
                    router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
                }
            });

        },
        changeLogo: function () {
            console.log('We come to PAGE FOR CHANGE AVATAR now');

            currModel(function (currentUserModel) {
                $('#containerHeaderBlock').html('').show().append(_.template(uploadFilePageTemp));
                $('#signOutBut').show();
                $('#posts-list').html('');

                $('#postsBlock').hide();
                $('#register-block').hide().html('');
                $('#login-block').hide().html('');
                $('#signBut').hide();
                $('#regBut').hide();
            });

        },
        sendEmail: function() {
            console.log('We come to WELCOME PAGE now');

            currModel(function (currentUserModel) {
                $('#containerHeaderBlock').html('').show().append(_.template(sendInvitePageTemp));
                $('#signForSendEmailBut').show();

                $('#posts-list').html('');
                $('#postsBlock').hide();
                $('#register-block').hide().html('');
                $('#login-block').hide().html('');
                $('#signBut').hide();
                $('#regBut').hide();
            });

        },
        showPosts: function() {
            console.log('We come to POSTS PAGE now');
            currModel(function (currentUserModel) {
                $('#containerHeader').show();
                $('#containerHeaderBlock').html('').hide();
                $('#posts-list').html('');
                $('#postsBlock').show();
                $('#post-block').show();
                $('#placeForPostBlock').html('').show().append(_.template(postBlockPageTemp));

                $('#register-block').hide().html('');
                $('#login-block').hide().html('');
                $('#welcomeBlock').hide();
                $('#signOutBut').show();
                $('#signBut').hide();
                $('#regBut').hide();
                initUsers();
                initPosts();
                showUpdateButton();
            });
        },
        showFriends: function() {
            console.log('We come to SHOW FRIENDS PAGE now');
            currModel(function (currentUserModel) {
                $('#posts-list').html('');
                $('#postsBlock').hide();
                $('#containerHeader').show();
                $('#containerHeaderBlock').html('').show();
                $('#register-block').hide().html('');
                $('#login-block').hide().html('');
                $('#welcomeBlock').hide();
                $('#signOutBut').show();
                $('#signBut').hide();
                $('#regBut').hide();
                initFriends();
                $('.butMini').hide();
            });
        },
        showUsers: function () {
            console.log('We come to FIND USERS PAGE now');
            currModel(function (currentUserModel) {
                $('#posts-list').html('');
                $('#postsBlock').hide();
                $('#containerHeader').show();
                $('#containerHeaderBlock').html('').show();
                $('#register-block').hide().html('');
                $('#login-block').hide().html('');
                $('#welcomeBlock').hide();
                $('#signOutBut').show();
                $('#signBut').hide();
                $('#regBut').hide();
                initUsers();
                showUpdateButton();
            });
        },
        register: function() {
            console.log('We come to REGISTRATION PAGE now');

            $('#posts-list').html('');
            $('#postsBlock').hide();
            $('#login-block').hide().html('');
            $('#welcomeBlock').hide();
            $('#containerHeader').hide();
            //$('#register-block').html('').show();

            $('#signOutBut').hide();
            $('#signBut').show();
            $('#regBut').show();

            new RegisterPageView();

        },
        login: function() {
            console.log('We come to LOGIN PAGE now');

            $('#posts-list').html('');
            $('#welcomeBlock').hide();
            $('#postsBlock').hide();
            $('#containerHeader').hide();
            $('#register-block').hide().html('');
            //$('#login-block').html('').show();
            $('#signOutBut').hide();
            $('#signBut').show();
            $('#regBut').show();
            console.log('now login');
            new LoginPageView();
        },
        restore: function() {
            console.log('We come to RESTORE PASSWORD PAGE now');

            $('#posts-list').html('');
            $('#welcomeBlock').hide();
            $('#postsBlock').hide();
            $('#containerHeader').hide();
            $('#register-block').hide().html('');
            $('#login-block').html('').hide().append(_.template(restoreTemp)).slideDown('slow');
            $('#signOutBut').hide();
            $('#signBut').show();
            $('#regBut').show();
        },
        restorePass: function (token) {
            console.log('We come to RESTORE PASSWORD PAGE 2 now');

            $('#posts-list').html('');
            $('#welcomeBlock').hide();
            $('#postsBlock').hide();
            $('#containerHeader').hide();
            $('#register-block').hide().html('');
            $('#signOutBut').hide();
            $('#signBut').show();
            $('#regBut').show();
            console.log('token: ', token);
            model = new ChangeStateModel({_id: token});
            console.log('WTF???');
            new RestorePageView({model: model});
        },
        connUser: function(id){
            console.log('We come to USER PAGE now');

            var Number;

            initPosts();
            initUsers();
            //show and hide buttons
            $('#posts-list').html('');
            $('#post-block').show();
            $('#postsBlock').hide();
            $('#register-block').hide();
            $('#login-block').hide();
            $('#welcomeBlock').hide();

            $('#signOutBut').show();
            $('#signBut').hide();
            $('#regBut').hide();
            $('.butMini').show();

            $('#containerHeader').show();
            $('#containerHeaderBlock').show().html(_.template(userListBlockTemp));
            console.log(' i load user page ' + id);

            currModel(function (currentUserModel) {
                console.log(currentUserModel);
                //create new user page for user id
                var userViewInstance = new NewUserPageView({model: currentUserModel});

                //append user page in to html page
                $('#forUsersHeader').hide().append(userViewInstance.render().el).slideDown('fast');

                var userPosts = postColInstance.where({ 'createrId': currentUserModel.get('_id')});

                for (Number in userPosts){
                    var npv = new NewPostView({model:userPosts[Number]});
                    $('#posts-list').hide().append(npv.render().el).slideDown('slow');
                }

                //show and hide buttons
                $('.butAdd').hide();
            });
        },
        chat: function() {
            currModel(function (currentUserModel) {
                console.log('We come to CHAT now');

                $('#containerHeaderBlock').html('').show().append(_.template(chatTemp));
                $('#showMessages').html('');
                $('#signForSendEmailBut').show();

                $('#posts-list').html('');
                $('#postsBlock').hide();
                $('#register-block').hide().html('');
                $('#login-block').hide().html('');
                $('#signBut').hide();
                $('#regBut').hide();
            });
        }
    });

    router = new Router();

    return {
        init: init,
        router: router
    }
});
