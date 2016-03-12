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
    sendInvitePageTemp
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

    //router;

    GLOBAL = {};




    function init () {
        postColInstance = new PostsCollection();

        userColInstance = new UserPagesCollection();

        friendsColInstance = new FriendsPagesCollection();



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

    GLOBAL.initUsers = function () {
        return userViewInstance = new UserPagesView({collection: userColInstance});
    };

    GLOBAL.initPosts = function () {
        return postsViewInstance = new PostsView({collection: postColInstance});
    };

    GLOBAL.initFriends = function () {
        friendsViewInstance = new UserPagesView({collection: friendsColInstance});
        return friendsViewInstance
    };

    GLOBAL.initChat = function (currentUserModel) {
        if (!chatViewInstance) {
            chatViewInstance = new ChatView({model: currentUserModel});
        } else {
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
            'chat'              : 'chat',
            'findLoc'           : 'locationFind',
            'correspondence/:id': 'correspondence'
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
                    $('#findLock').hide();

                } else {
                    console.log('cur = ', currentUserModel);
                    GLOBAL.router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
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
                $('#findLock').hide();
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
                $('#findLock').hide();
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
                $('#findLock').hide();

                GLOBAL.initUsers();
                GLOBAL.initPosts();

                $('.butKick').hide();
                $('.butWrite').hide();
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
                $('#findLock').hide();

                GLOBAL.initFriends();

                $('.butMini').hide();
                $('.butKick').show();
                $('.butWrite').show();
            });
        },

        showUsers: function () {
            var masFriends;
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
                $('#findLock').show();

                GLOBAL.initUsers();

                hideFriends(currentUserModel);

                showUpdateButton();


            });
        },

        register: function() {
            currModel(function (currentUserModel) {
                if (!currentUserModel) {
                    console.log('We come to REGISTRATION PAGE now');

                    $('#posts-list').html('');
                    $('#postsBlock').hide();
                    $('#login-block').hide().html('');
                    $('#welcomeBlock').hide();
                    $('#containerHeader').hide();
                    $('#findLock').hide();

                    $('#signOutBut').hide();
                    $('#signBut').show();
                    $('#regBut').show();

                    new RegisterPageView();
                } else {
                    console.log('cur = ', currentUserModel);
                    GLOBAL.router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
                }
            });
        },
        login: function() {
            currModel(function (currentUserModel) {
                if (!currentUserModel) {
                    console.log('We come to LOGIN PAGE now');

                    $('#posts-list').html('');
                    $('#welcomeBlock').hide();
                    $('#postsBlock').hide();
                    $('#containerHeader').hide();
                    $('#findLock').hide();
                    $('#register-block').hide().html('');
                    $('#signOutBut').hide();
                    $('#signBut').show();
                    $('#regBut').show();
                    console.log('now login');
                    new LoginPageView();
                } else {
                    console.log('cur = ', currentUserModel);
                    GLOBAL.router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
                }
            });
        },
        restore: function() {
            currModel(function (currentUserModel) {
                if (!currentUserModel) {
                    console.log('We come to RESTORE PASSWORD PAGE now');

                    $('#posts-list').html('');
                    $('#welcomeBlock').hide();
                    $('#postsBlock').hide();
                    $('#containerHeader').hide();
                    $('#register-block').hide().html('');
                    $('#login-block').html('').hide().append(_.template(restoreTemp)).slideDown('slow');
                    $('#signOutBut').hide();
                    $('#findLock').hide();

                    $('#signBut').show();
                    $('#regBut').show();
                } else {
                    console.log('cur = ', currentUserModel);
                    GLOBAL.router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
                }
            });
        },
        restorePass: function (token) {
            currModel(function (currentUserModel) {
                if (!currentUserModel) {
                    console.log('We come to RESTORE PASSWORD PAGE 2 now');

                    $('#posts-list').html('');
                    $('#welcomeBlock').hide();
                    $('#postsBlock').hide();
                    $('#containerHeader').hide();
                    $('#register-block').hide().html('');
                    $('#signOutBut').hide();
                    $('#findLock').hide();

                    $('#signBut').show();
                    $('#regBut').show();
                    console.log('token: ', token);
                    model = new ChangeStateModel({_id: token});
                    console.log('WTF???');
                    new RestorePageView({model: model});
                } else {
                    console.log('cur = ', currentUserModel);
                    GLOBAL.router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
                }
            });
        },
        connUser: function(id){
            console.log('We come to USER PAGE now');

            var Number;

            GLOBAL.initPosts();
            GLOBAL.initUsers();
            GLOBAL.getFriendsInstance().getDataToCollection();
            //show and hide buttons
            $('#posts-list').html('');
            $('#post-block').show();
            $('#postsBlock').hide();
            $('#register-block').hide();
            $('#login-block').hide();
            $('#welcomeBlock').hide();
            $('#findLock').hide();
            $('#signBut').hide();
            $('#regBut').hide();


            $('#signOutBut').show();
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
                $('.butDel').hide();
                $('.butKick').hide();
                $('.butWrite').hide();
                $('.butAdd').hide();
            });
        },
        chat: function() {
            currModel(function (currentUserModel) {
                console.log('We come to CHAT now');

                $('#showMessages').html('');
                $('#signForSendEmailBut').show();
                $('#findLock').hide();

                $('#posts-list').html('');
                $('#postsBlock').hide();
                $('#register-block').hide().html('');
                $('#login-block').hide().html('');
                GLOBAL.initChat(currentUserModel);

                $('#signBut').hide();
                $('#regBut').hide();
            });
        },
        correspondence: function(id) {

            currModel(function (currentUserModel) {
                //console.log(friendsColInstance);
                var model = new Backbone.Model({
                    user: currentUserModel,
                    opponent: friendsColInstance.where({_id: id})
                });

                console.log('We come to CORRESPONDENCE now');
                console.log('user = ', model.get('user'), 'opponent = ', model.get('opponent') );

                $('#showMessages').html('');
                $('#signForSendEmailBut').show();
                $('#findLock').hide();

                $('#posts-list').html('');
                $('#postsBlock').hide();
                $('#register-block').hide().html('');
                $('#login-block').hide().html('');

                GLOBAL.initCorrespondence(model);

                $('#signBut').hide();
                $('#regBut').hide();
            });
        },
        locationFind: function() {
            currModel(function (currentUserModel) {
                var findForDist;

                console.log('We come to findLocate page');
                console.log('val of find = ', $('#editKm').val());

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
                $('#findLock').show();

                console.log('uCI ',userColInstance);

                findForDist = _.filter(userColInstance.toArray(), function(model) {
                    var dist1 = parseFloat($('#editKm').val());
                    var dist2 = parseFloat(model.get('dist'));
                    console.log('dist1 => ',dist1);
                    console.log('dist2 => ',dist2);

                    return dist1 >=  dist2;
                });

                findForDist.forEach(function(model) {
                    var nupv = new NewUserPageView({model: model});
                    $('#containerHeaderBlock').append(nupv.render().el);
                });

                hideFriends(currentUserModel);

                showUpdateButton();
            })
        }
    });

    GLOBAL.router = new Router();

    return {
        init: init
    }
});
