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

    'views/friends/form',
    'collections/friend',

    'views/invite/form',
    'collections/invites',

    'helpers/currModel',
    'helpers/hideFriends',
    'helpers/showUpdateButton',
    'helpers/counterMessages',

    'text!templates/welcomePage.html',
    'text!templates/restorePasswordPage1.html',
    'text!templates/userListBlock.html',
    'text!templates/postBlockPage.html',
    'text!templates/chatPage.html',
    'text!templates/uploadFilePage.html',
    'text!templates/sendInvitePage1.html',
    'text!templates/menu.html',
    'text!templates/buttonFind.html',
    'text!templates/inviteToFriends.html',
    'text!templates/friendPage.html'
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

    FriendsPageView,
    FriendsPagesCollection,

    InvitesView,
    InvitesToFriendsColl,

    currModel,
    hideFriends,
    showUpdateButton,
    counterMessages,

    welcomeTemp,
    restoreTemp,
    userListBlockTemp,
    postBlockPageTemp,
    chatTemp,
    uploadFilePageTemp,
    sendInvitePageTemp,
    menuPageTemp,
    findButtonTemp,
    inviteToFriendsTemp,
    friendPageTemp
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
    var $menuBlock = $('#menuHeader');


    Router = Backbone.Router.extend({
        routes: {
            ''                  : 'main',
            'main'              : 'main',
            'logOut'            : 'main',
            'showAll'           : 'showUsers',
            'showFind'          : 'showFind',
            'showFriends'       : 'showFriends',
            'showPosts'         : 'showPosts',
            'sendEmail'         : 'sendEmail',
            'register/:email'   : 'register',
            'register'          : 'register',
            'login'             : 'login',
            'invitesToFriends'  : 'inviteToFriends',
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

                    $menuBlock.html('');
                    $containerHeader.hide();

                    $welcomeBlock.html('').css({opacity: 0}).animate(
                        {opacity: 1},
                        2000
                    ).show().append(_.template(welcomeTemp));

                    $signBut.show();
                    $regBut.show();

                    $registerBlock.hide().html('');
                    $loginBlock.hide().html('');
                    $signOutBut.hide();

                    $findLock.hide();

                } else {
                    GLOBAL.router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
                }
            });
        },

        inviteToFriends: function () {
            console.log('We come to INVITE TO FRIENDS PAGE now');
            var $postsBlock = $('#postsBlock');
            var inviteToFriendsColInstance;

            currModel(function(currentUserModel) {
                if (currentUserModel) {
                    $menuBlock.html('').append(_.template(menuPageTemp));

                    $postList.html('');
                    $postsBlock.hide();

                    $containerHeaderBlock.html('').show();

                    $signBut.hide();
                    $regBut.hide();

                    $findLock.hide();

                    inviteToFriendsColInstance = new InvitesToFriendsColl();
                    new InvitesView({collection: inviteToFriendsColInstance});
                }
            })
        },

        changeLogo: function () {
            console.log('We come to PAGE FOR CHANGE AVATAR now');
            var $postsBlock = $('#postsBlock');

            currModel(function (currentUserModel) {
                if (currentUserModel) {
                    $menuBlock.html('').append(_.template(menuPageTemp));
                    $containerHeaderBlock.hide().html('').append(_.template(uploadFilePageTemp)).slideDown();

                    $postList.html('');
                    $postsBlock.hide();

                    $signBut.hide();
                    $regBut.hide();

                    $findLock.hide();
                } else {
                    GLOBAL.router.navigate('/#main', {trigger: true});
                }
            });
        },

        sendEmail: function () {
            console.log('We come to WELCOME PAGE now');

            currModel(function (currentUserModel) {
                if (currentUserModel) {
                    var $postsBlock = $('#postsBlock');

                    $menuBlock.html('').append(_.template(menuPageTemp));
                    $containerHeaderBlock.html('').hide().append(_.template(sendInvitePageTemp)).slideDown('slow');

                    $postList.html('');
                    $postsBlock.hide();

                    $signBut.hide();
                    $regBut.hide();

                    $findLock.hide();
                } else {
                    GLOBAL.router.navigate('/#main', {trigger: true});
                }
            });
        },

        showPosts: function () {
            console.log('We come to POSTS PAGE now');
            currModel(function (currentUserModel) {
                if (currentUserModel) {
                    var postColInstance;
                    var $postBlock = $('#post-block');
                    var $placeForPostBlock = $('#placeForPostBlock');

                    $menuBlock.html('').append(_.template(menuPageTemp));
                    $containerHeader.show();
                    $containerHeaderBlock.html('').hide();
                    $postList.html('');
                    $postsBlock.show();
                    $postBlock.show();
                    $placeForPostBlock.html('').show().append(_.template(postBlockPageTemp));

                    $signOutBut.show();
                    $signBut.hide();
                    $regBut.hide();

                    $findLock.hide();

                    postColInstance = new PostsCollection();
                    new PostsView({collection: postColInstance});

                    showUpdateButton();
                } else {
                    GLOBAL.router.navigate('/#main', {trigger: true});
                }
            });
        },

        showFriends: function () {
            console.log('We come to SHOW FRIENDS PAGE now');
            currModel(function (currentUserModel) {
                if (currentUserModel) {
                    var $butWrite;
                    var $butKick;
                    var $butMini;
                    var $postsBlock = $('#postsBlock');
                    var friendsColInstance;

                    $menuBlock.html('').append(_.template(menuPageTemp));

                    $postList.html('');
                    $postsBlock.hide();

                    $containerHeaderBlock.html('').show();

                    $signBut.hide();
                    $regBut.hide();
                    $findLock.hide();

                    friendsColInstance = new FriendsPagesCollection();
                    new FriendsPageView({collection: friendsColInstance});

                    $butKick = $('.butKick');
                    $butWrite = $('.butWrite');

                    $butKick.show();
                    $butWrite.show();
                } else {
                    GLOBAL.router.navigate('/#main', {trigger: true});
                }
            });
        },

        showFind: function () {
            console.log('We come to FIND USERS PAGE now');
            var $postsBlock = $('#postsBlock');

            currModel(function (currentUserModel) {
                if (currentUserModel) {
                    $menuBlock.html('').append(_.template(menuPageTemp));
                    $findLock.html('').append(_.template(findButtonTemp));

                    $postList.html('');
                    $postsBlock.hide();

                    $containerHeaderBlock.html('').show();

                    $signBut.hide();
                    $regBut.hide();

                    $findLock.show();

                 } else {
                    GLOBAL.router.navigate('/#main', {trigger: true});
                }
            });
        },

        showUsers: function () {
            console.log('We come to FIND USERS PAGE now');
            var $postsBlock = $('#postsBlock');
            var userColInstance;

            currModel(function (currentUserModel) {
                if (currentUserModel) {
                    $menuBlock.html('').append(_.template(menuPageTemp));

                    $postList.html('');
                    $postsBlock.hide();

                    $containerHeaderBlock.html('').show();

                    $signBut.hide();
                    $regBut.hide();

                    $findLock.hide();

                    userColInstance = new UserPagesCollection();
                    new UserPagesView({ model: currentUserModel, collection: userColInstance});

                    //hideFriends({model: currentUserModel});
                    showUpdateButton();
                } else {
                    GLOBAL.router.navigate('/#main', {trigger: true});
                }
            });
        },

        register: function (email) {
            currModel(function (currentUserModel) {
                if (!currentUserModel) {
                    console.log('We come to REGISTRATION PAGE now');

                    $loginBlock.hide().html('');
                    $welcomeBlock.hide();
                    $containerHeader.hide();

                    $signOutBut.hide();

                    if (email) {
                        new RegisterPageView({model: email});
                    } else {
                        new RegisterPageView();
                    }
                } else {
                    GLOBAL.router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
                }
            });
        },

        login: function () {
            currModel(function (currentUserModel) {
                if (!currentUserModel) {
                    console.log('We come to LOGIN PAGE now');

                    $welcomeBlock.hide();
                    $containerHeader.hide();

                    $registerBlock.hide().html('');
                    $signOutBut.hide();

                    new LoginPageView();
                } else {
                    GLOBAL.router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
                }
            });
        },

        restore: function () {
            currModel(function (currentUserModel) {
                if (!currentUserModel) {
                    console.log('We come to RESTORE PASSWORD PAGE now');

                    $welcomeBlock.hide();
                    $containerHeader.hide();
                    $registerBlock.hide().html('');

                    $signOutBut.hide();

                    $loginBlock.html('').hide().append(_.template(restoreTemp)).slideDown('slow');

                } else {
                    GLOBAL.router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
                }
            });
        },

        restorePass: function (token) {
            currModel(function (currentUserModel) {
                if (!currentUserModel) {
                    console.log('We come to RESTORE PASSWORD PAGE 2 now');

                    $welcomeBlock.hide();
                    $containerHeader.hide();
                    $registerBlock.hide().html('');
                    $signOutBut.hide();

                    $findLock.hide();

                    $signBut.show();
                    $regBut.show();

                    //creating new model for checking tokens
                    model = new ChangeStateModel({_id: token});

                    //if token checking is true than rendering page
                    new RestorePageView({model: model});
                } else {
                    GLOBAL.router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
                }
            });
        },

        connUser: function (id) {
            console.log('We come to USER PAGE now');

            var $postsBlock = $('#postsBlock');
            var $postBlock = $('#post-block');
            var $butMini = $('.butMini');

            //show and hide buttons
            $menuBlock.html('').append(_.template(menuPageTemp));
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
            $butMini.show();
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
                var userPostColl;
                var i;

                //adding menu Block
                $menuBlock.html('').append(_.template(menuPageTemp));

                //create new user page for user id
                userViewInstance = new NewUserPageView({model: currentUserModel});

                userViewInstance.template = _.template(friendPageTemp);

                //append user page in to html page
                $forUsersHeader.hide().append(userViewInstance.render().el).slideDown('fast');

                //creating new PostCollection and fetching and filtering and rendering users posts
                userPostColl = new PostsCollection();
                userPostColl.fetch({
                    success: function (coll) {
                        userPosts = coll.where({ 'createrId': currentUserModel.get('_id')});

                        for (i = 0; i < userPosts.length; i++) {
                            npv = new NewPostView({model: userPosts[i]});
                            $postList.hide().append(npv.render().el).slideDown('slow');
                        }

                        //show and hide buttons
                        $butKick = $('.butKick');
                        $butWrite = $('.butWrite');
                        $butAdd = $('.butAdd');
                        //$butDel = $('.butDel');

                        //$butDel.hide();
                        $butKick.hide();
                        $butWrite.hide();
                        $butAdd.hide();
                    }
                });
            });
        },

        chat: function () {
            currModel(function (currentUserModel) {
                console.log('We come to CHAT now');
                if (currentUserModel) {
                    var $postsBlock = $('#postsBlock');
                    var $showMessages = $('#showMessages');

                    $menuBlock.html('').append(_.template(menuPageTemp));
                    $showMessages.html('');

                    $findLock.hide();

                    $postList.html('');
                    $postsBlock.hide();

                    GLOBAL.initChat(currentUserModel);
                    //new ChatView({model: currentUserModel});

                    $signBut.hide();
                    $regBut.hide();
                } else {
                    GLOBAL.router.navigate('/#main', {trigger: true});
                }
            });
        },

        correspondence: function (id) {

            currModel(function (currentUserModel) {
                if (currentUserModel) {

                    //creating model for correspondence two users
                    var $showMessages = $('#showMessages');
                    var model = new Backbone.Model({
                        user: currentUserModel,
                        opponent: id
                    });

                    console.log('We come to CORRESPONDENCE now');
                    console.log('user = ', model.get('user').get('_id'), 'opponent = ', model.get('opponent') );

                    $menuBlock.html('').append(_.template(menuPageTemp));
                    $showMessages.html('');

                    $findLock.hide();

                    $postList.html('');
                    $postsBlock.hide();

                    //new CorrespondenceView({model: model});
                    GLOBAL.initCorrespondence(model);

                    $signBut.hide();
                    $regBut.hide();
                } else {
                    GLOBAL.router.navigate('/#main', {trigger: true});
                }
            });
        },

        locationFind: function () {
            currModel(function (currentUserModel) {
                if (currentUserModel) {
                    var findForDistInstance;
                    var $postsBlock = $('#postsBlock');
                    var $editKm = $('#editKm');
                    var nupv;

                    console.log('We come to findLocate page');
                    console.log('val of find = ', $editKm.val());

                    $menuBlock.html('').append(_.template(menuPageTemp));

                    $postList.html('');
                    $postsBlock.hide();

                    $containerHeaderBlock.html('').show();

                    $signBut.hide();
                    $regBut.hide();

                    findForDistInstance = new UserPagesCollection();

                    findForDistInstance.on('reset', function(newFindForDistInctance){
                        var newFindForDist;

                        //filtering users on specific distance
                        newFindForDist = _.filter(newFindForDistInctance.toArray(), function (model) {
                            var dist1 = parseFloat($editKm.val());
                            var dist2 = parseFloat(model.get('dist'));
                            console.log('dist1 => ',dist1);
                            console.log('dist2 => ',dist2);

                            return dist1 >=  dist2;
                        });

                        //render filtered users
                        newFindForDist.forEach(function (model) {
                            nupv = new NewUserPageView({model: model});
                            $containerHeaderBlock.append(nupv.render().el);
                        });

                        hideFriends({model: currentUserModel});
                        showUpdateButton();
                    }, this);

                    findForDistInstance.fetch({reset: true});
                } else {
                    GLOBAL.router.navigate('/#main', {trigger: true});
                }
            })
        }
    });

    return Router
});

