define([
    'Backbone',
    'Underscore',
    'jQuery',

    'models/changeState',

    //'views/user/form',
    'views/user/list',
    //'collections/user',

    //'views/post/form',
    'views/post/list',
    //'collections/post',

    'views/register/form',
    'views/login/form',
    'views/restore/form',
    'views/chat/chat',
    'views/correspondence/correspondence',

    //'collections/friend',

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

    //UserPagesView,
    NewUserPageView,
    //UserPagesCollection,

    //PostsView,
    NewPostView,
    //PostsCollection,

    RegisterPageView,
    LoginPageView,
    RestorePageView,
    ChatView,
    CorrespondenceView,

    //FriendsPagesCollection,

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
    //cashing jQuery

    var $postList = $('#posts-list');
    var $postsBlock = $('#postsBlock');
    var $containerHeader = $('#containerHeader');
    var $signOutBut = $('#signOutBut');
    var $signBut = $('#signBut');
    var $regBut = $('#regBut');
    var $welcomeBlock = $('#welcomeBlock');
    var $registerBlock = $('#register-block');
    var $loginBlock = $('#login-block');
    var $findLock = $('#findLock');
    var $containerHeaderBlock = $('#containerHeaderBlock');
    var $butDel = $('.butDel');
    var $butKick = $('.butKick');
    var $butWrite = $('.butWrite');
    var $butAdd = $('.butAdd');

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
        main: function () {
            currModel(function (currentUserModel) {
                if (!currentUserModel) {
                    console.log('We come to WELCOME PAGE now');

                    $postList.html('');
                    $containerHeader.hide();

                    $welcomeBlock.html('').css({opacity: 0}).animate(
                        {opacity: 1},
                        2000
                    ).show().append(_.template(welcomeTemp));

                    $signBut.show();
                    $regBut.show();
                    $postsBlock.hide();
                    $registerBlock.hide().html('');
                    $loginBlock.hide().html('');
                    $signOutBut.hide();
                    $findLock.hide();

                } else {
                    console.log('cur = ', currentUserModel);
                    GLOBAL.router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
                }
            });
        },

        changeLogo: function () {
            console.log('We come to PAGE FOR CHANGE AVATAR now');
            var $postsBlock = $('#postsBlock');

            currModel(function (currentUserModel) {
                $containerHeaderBlock.html('').show().append(_.template(uploadFilePageTemp));

                $signOutBut.show();
                $postList.html('');
                $postsBlock.hide();
                $registerBlock.hide().html('');
                $loginBlock.hide().html('');
                $signBut.hide();
                $regBut.hide();
                $findLock.hide();
            });
        },

        sendEmail: function () {
            console.log('We come to WELCOME PAGE now');

            currModel(function (currentUserModel) {
                var $signForSendEmailBut = $('#signForSendEmailBut');
                var $postsBlock = $('#postsBlock');

                $containerHeaderBlock.html('').show().append(_.template(sendInvitePageTemp));

                $signForSendEmailBut.show();

                $postList.html('');
                $postsBlock.hide();
                $registerBlock.hide().html('');
                $loginBlock.hide().html('');
                $signBut.hide();
                $regBut.hide();
                $findLock.hide();
            });
        },

        showPosts: function () {
            console.log('We come to POSTS PAGE now');
            currModel(function (currentUserModel) {
                var $postBlock = $('#post-block');
                var $placeForPostBlock = $('#placeForPostBlock');

                $containerHeader.show();
                $containerHeaderBlock.html('').hide();
                $postList.html('');
                $postsBlock.show();
                $postBlock.show();

                $placeForPostBlock.html('').show().append(_.template(postBlockPageTemp));

                $registerBlock.hide().html('');
                $loginBlock.hide().html('');
                $welcomeBlock.hide();
                $signOutBut.show();
                $signBut.hide();
                $regBut.hide();
                $findLock.hide();

                GLOBAL.initUsers();
                GLOBAL.initPosts();

                $butDel.hide();
                $butWrite.hide();
                showUpdateButton();
            });
        },

        showFriends: function () {
            console.log('We come to SHOW FRIENDS PAGE now');
            currModel(function (currentUserModel) {
                var $butWrite;
                var $butKick;
                var $postsBlock = $('#postsBlock');

                $postList.html('');
                $postsBlock.hide();
                $containerHeader.show();
                $containerHeaderBlock.html('').show();
                $registerBlock.hide().html('');
                $loginBlock.hide().html('');
                $welcomeBlock.hide();
                $signOutBut.show();
                $signBut.hide();
                $regBut.hide();
                $findLock.hide();

                GLOBAL.initFriends();

                $('.butMini').hide();
                $butKick = $('.butKick');
                $butWrite = $('.butWrite');

                $butKick.show();
                $butWrite.show();
            });
        },

        showUsers: function () {
            console.log('We come to FIND USERS PAGE now');

            currModel(function (currentUserModel) {
                $postList.html('');
                $postsBlock.hide();
                $containerHeader.show();
                $containerHeaderBlock.html('').show();
                $registerBlock.hide().html('');
                $loginBlock.hide().html('');
                $welcomeBlock.hide();
                $signOutBut.show();
                $signBut.hide();
                $regBut.hide();
                $findLock.show();

                GLOBAL.initUsers();

                hideFriends(currentUserModel);

                showUpdateButton();


            });
        },

        register: function () {
            currModel(function (currentUserModel) {
                if (!currentUserModel) {
                    console.log('We come to REGISTRATION PAGE now');

                    $postList.html('');
                    $postsBlock.hide();
                    $loginBlock.hide().html('');
                    $welcomeBlock.hide();
                    $containerHeader.hide();
                    $findLock.hide();

                    $signOutBut.hide();
                    $signBut.show();
                    $regBut.show();

                    new RegisterPageView();
                } else {
                    console.log('cur = ', currentUserModel);
                    GLOBAL.router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
                }
            });
        },
        login: function () {
            currModel(function (currentUserModel) {
                if (!currentUserModel) {
                    console.log('We come to LOGIN PAGE now');

                    $postList.html('');
                    $welcomeBlock.hide();
                    $postsBlock.hide();
                    $containerHeader.hide();
                    $findLock.hide();
                    $registerBlock.hide().html('');
                    $signOutBut.hide();
                    $signBut.show();
                    $regBut.show();
                    console.log('now login');
                    new LoginPageView();
                } else {
                    console.log('cur = ', currentUserModel);
                    GLOBAL.router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
                }
            });
        },
        restore: function () {
            currModel(function (currentUserModel) {
                if (!currentUserModel) {
                    console.log('We come to RESTORE PASSWORD PAGE now');

                    $postList.html('');
                    $welcomeBlock.hide();
                    $postsBlock.hide();
                    $containerHeader.hide();
                    $registerBlock.hide().html('');
                    $loginBlock.html('').hide().append(_.template(restoreTemp)).slideDown('slow');
                    $signOutBut.hide();
                    $findLock.hide();

                    $signBut.show();
                    $regBut.show();
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

                    $postList.html('');
                    $welcomeBlock.hide();
                    $postsBlock.hide();
                    $containerHeader.hide();
                    $registerBlock.hide().html('');
                    $signOutBut.hide();
                    $findLock.hide();

                    $signBut.show();
                    $regBut.show();
                    model = new ChangeStateModel({_id: token});
                    new RestorePageView({model: model});
                } else {
                    console.log('cur = ', currentUserModel);
                    GLOBAL.router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
                }
            });
        },
        connUser: function (id) {
            console.log('We come to USER PAGE now');

            var Number;
            var $postsBlock = $('#postsBlock');
            var $postBlock = $('#post-block');

            GLOBAL.initPosts();
            //GLOBAL.initUsers();
            GLOBAL.getUserInstance().getDataToCollection ();
            GLOBAL.getFriendsInstance().getDataToCollection ();

            //show and hide buttons
            $postList.html('');
            $postBlock.show();
            $postsBlock.hide();
            $registerBlock.hide();
            $loginBlock.hide();
            $welcomeBlock.hide();
            $findLock.hide();
            $signBut.hide();
            $regBut.hide();

            $signOutBut.show();
            $('.butMini').show();
            $containerHeader.show();
            $containerHeaderBlock.show().html(_.template(userListBlockTemp));

            console.log(' i load user page ' + id);

            currModel(function (currentUserModel) {
                var $forUsersHeader = $('#forUsersHeader');
                var userViewInstance;
                var userPosts;
                var npv;
                var $butWrite;
                var $butKick;
                var $butAdd;

                //create new user page for user id
                userViewInstance = new NewUserPageView({model: currentUserModel});

                //append user page in to html page
                $forUsersHeader.hide().append(userViewInstance.render().el).slideDown('fast');

                userPosts = GLOBAL.postColInstance.where({ 'createrId': currentUserModel.get('_id')});

                for (Number in userPosts) {
                    npv = new NewPostView({model:userPosts[Number]});
                    $postList.hide().append(npv.render().el).slideDown('slow');
                }

                //show and hide buttons

                //var $butDel = $('.butDel');
                $butKick = $('.butKick');
                $butWrite = $('.butWrite');
                $butAdd = $('.butAdd');

                $butDel.hide();
                $butKick.hide();
                $butWrite.hide();
                $butAdd.hide();
            });
        },
        chat: function () {
            currModel(function (currentUserModel) {
                console.log('We come to CHAT now');
                var $postsBlock = $('#postsBlock');
                var $showMessages = $('#showMessages');
                var $signForSendEmailBut = $('#signForSendEmailBut');

                $showMessages.html('');
                $signForSendEmailBut.show();
                $findLock.hide();

                $postList.html('');
                $postsBlock.hide();
                $registerBlock.hide().html('');
                $loginBlock.hide().html('');

                GLOBAL.initChat(currentUserModel);

                $signBut.hide();
                $regBut.hide();
            });
        },
        correspondence: function (id) {

            currModel(function (currentUserModel) {
                var model = new Backbone.Model({
                    user: currentUserModel,
                    opponent: GLOBAL.friendsColInstance.where({_id: id})
                });
                var $showMessages = $('#showMessages');
                var $signForSendEmailBut = $('#signForSendEmailBut');

                console.log('We come to CORRESPONDENCE now');
                console.log('user = ', model.get('user'), 'opponent = ', model.get('opponent') );

                $showMessages.html('');
                $signForSendEmailBut.show();
                $findLock.hide();

                $postList.html('');
                $postsBlock.hide();
                $registerBlock.hide().html('');
                $loginBlock.hide().html('');

                GLOBAL.initCorrespondence(model);

                $signBut.hide();
                $regBut.hide();
            });
        },
        locationFind: function () {
            currModel(function (currentUserModel) {
                var findForDist;
                var $postsBlock = $('#postsBlock');
                var $editKm = $('#editKm');
                var nupv;

                console.log('We come to findLocate page');
                console.log('val of find = ', $editKm.val());

                $postList.html('');
                $postsBlock.hide();
                $containerHeader.show();
                $containerHeaderBlock.html('').show();
                $registerBlock.hide().html('');
                $loginBlock.hide().html('');
                $welcomeBlock.hide();
                $signOutBut.show();
                $signBut.hide();
                $regBut.hide();
                $findLock.show();

                console.log('uCI ', GLOBAL.userColInstance);

                findForDist = _.filter(GLOBAL.userColInstance.toArray(), function (model) {
                    var dist1 = parseFloat($editKm.val());
                    var dist2 = parseFloat(model.get('dist'));
                    console.log('dist1 => ',dist1);
                    console.log('dist2 => ',dist2);

                    return dist1 >=  dist2;
                });

                findForDist.forEach(function (model) {
                    nupv = new NewUserPageView({model: model});
                    $containerHeaderBlock.append(nupv.render().el);
                });

                hideFriends(currentUserModel);

                showUpdateButton();
            })
        }
    });

    return Router
});

