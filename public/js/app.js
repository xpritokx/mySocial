var userColInstance;

var friendsColInstance;

var userViewInstance;

var friendsViewInstance;

var validModelInstance;

var refFormViewInstance;

var loginFormViewInstance;

var changeStateModelInstance;

var currentUserModel;

var router;


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
        'chat'              : 'chat'
    },
    main: function() {
            if (!currentUserModel) {
                console.log('We come to WELCOME PAGE now');

                $('#posts-list').html('');
                $('#welcomeBlock').html('').show().append(template('welcomePage'));
                $('#signBut').show();
                $('#regBut').show();
                $('#postsBlock').hide();
                $('#register-block').hide().html('');
                $('#login-block').hide().html('');
                $('#signOutBut').hide();
                $('#containerHeader').hide();
            } else {
                router.navigate('/connected_user/' + currentUserModel.get('_id'), {trigger: true});
            }
    },
    changeLogo: function () {
        console.log('We come to PAGE FOR CHANGE AVATAR now');

        $('#containerHeaderBlock').html('').show().append(template('uploadFilePage'));
        $('#signOutBut').show();
        $('#posts-list').html('');

        $('#postsBlock').hide();
        $('#register-block').hide().html('');
        $('#login-block').hide().html('');
        $('#signBut').hide();
        $('#regBut').hide();
    },
    sendEmail: function() {
        console.log('We come to WELCOME PAGE now');

        $('#containerHeaderBlock').html('').show().append(template('sendInvitePage1'));
        $('#signForSendEmailBut').show();

        $('#posts-list').html('');
        $('#postsBlock').hide();
        $('#register-block').hide().html('');
        $('#login-block').hide().html('');
        $('#signBut').hide();
        $('#regBut').hide();
    },
    showUsers: function () {
        console.log('We come to FIND USERS PAGE now');
        init();
        currModel(function () {

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
            userViewInstance.render();
            showUpdateButton();
        });
    },
    showFriends: function() {
        console.log('We come to SHOW FRIENDS PAGE now');
        init();
        currModel(function () {
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
            friendsViewInstance.render();
            $('.butMini').hide();
        });
    },
    register: function() {
        console.log('We come to REGISTRATION PAGE now');

        $('#posts-list').html('');
        $('#postsBlock').hide();
        $('#register-block').html('').show();
        $('#login-block').hide().html('');
        $('#welcomeBlock').hide();
        $('#containerHeader').hide();
        $('#signOutBut').hide();
        $('#signBut').show();
        $('#regBut').show();
        refFormViewInstance.render();
    },
    login: function() {
        console.log('We come to LOGIN PAGE now');

        $('#posts-list').html('');
        $('#welcomeBlock').hide();
        $('#postsBlock').hide();
        $('#containerHeader').hide();
        $('#register-block').hide().html('');
        $('#login-block').html('').show();
        $('#signOutBut').hide();
        $('#signBut').show();
        $('#regBut').show();
        loginFormViewInstance.render();
    },
    restore: function() {
        console.log('We come to RESTORE PASSWORD PAGE now');

        $('#posts-list').html('');
        $('#welcomeBlock').hide();
        $('#postsBlock').hide();
        $('#containerHeader').hide();
        $('#register-block').hide().html('');
        $('#login-block').html('').show().append(template('restorePasswordPage1'));
        $('#signOutBut').hide();
        $('#signBut').show();
        $('#regBut').show();
    },
    connUser: function(id){
        console.log('We come to USER PAGE now');

        init();
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
        $('#containerHeaderBlock').show().html(template('userListBlock'));
        console.log(' i load user page ' + id);

        currModel(function () {
            //create new user page for user id
            var userViewInstance = new NewUserPageView({model: currentUserModel});

            //append user page in to html page
            $('#forUsersHeader').append(userViewInstance.render().el);

            var userPosts = postColInstance.where({ creater: currentUserModel.get('username')});
            console.log('koko', postColInstance.where({ creater: currentUserModel.get('username')}));

            for (modNumber in userPosts){
                console.log('mod=',modNumber);
                var npv = new NewPostView({model:userPosts[modNumber]});
                $('#posts-list').append(npv.render().el);
            }

            //show and hide buttons
            $('.butAdd').hide();
            $('.butSendMessage').hide();
        });
    },
    showPosts: function() {
        console.log('We come to POSTS PAGE now');
        init();
        currModel(function () {
            $('#containerHeader').show();
            $('#containerHeaderBlock').html('').hide();
            $('#posts-list').html('');
            $('#postsBlock').show();
            $('#post-block').show();

            $('#register-block').hide().html('');
            $('#login-block').hide().html('');
            $('#welcomeBlock').hide();
            $('#signOutBut').show();
            $('#signBut').hide();
            $('#regBut').hide();
            postViewInstance.render();
            showUpdateButton();
        });
    },
    chat: function() {
        currModel(function () {
            console.log('We come to CHAT now');

            $('#containerHeaderBlock').html('').show().append(template('chat'));
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


//--------------------------------------------------------------------------------
//----INITIALIZE----------INITIALIZE----------INITIALIZE----------INITIALIZE------
//--------------------------------------------------------------------------------



changeStateModelInstance = new ChangeStateModel();

//initialize collection instance

postColInstance = new PostsCollection();

userColInstance = new UserPagesCollection();

friendsColInstance = new FriendsPagesCollection();

//initialize view instance

function init() {
    postViewInstance = new PostsView({collection: postColInstance});

    userViewInstance = new UserPagesView({model: userColInstance});

    friendsViewInstance = new UserPagesView({model: friendsColInstance});
}

refFormViewInstance = new RegisterPageView();

loginFormViewInstance = new LoginPageView();


router = new Router;



Backbone.history.start();

