(function(){
    //namespace

    window.App = {
        Models: {},
        Views: {},
        Collections: {},
        Router: {},
        Functions: {},
        Properties: {}
    };

    //template helper

    window.template = function(id) {
        return _.template($('#' + id).html());
    };

    //--------------------------------------------------------------------------
    //-----FUNCTIONS-----------FUNCTIONS-----------FUNCTIONS-----------FUNCTIONS
    //--------------------------------------------------------------------------

    App.Functions.init = function() {
        App.Properties.userCol = new App.Collections.UserPages();

        App.Properties.friendsCol = new App.Collections.FriendsPages();

        App.Properties.userView = new App.Views.UserPages({model: App.Properties.userCol});

        App.Properties.friendsView = new App.Views.UserPages({model: App.Properties.friendsCol});

        App.Properties.valid = new App.Models.UserLogValid();

        regForm = new App.Views.RegisterPage({model: App.Properties.userCol});

        sendEmailForm = new App.Views.SendEmailPage();

        App.Properties.sendRestoreForm = new App.Views.SendRestorePage();

        loginForm = new App.Views.LoginPage();

        router = new App.Router;

        App.Properties.changeState = new App.Models.ChangeState();
    };


    App.Functions.sendEmail = function() {
        if (App.Properties.valid.get('userIsAuthorised')) {
            $('#containerHeaderBlock').html('').show();
            $('#signForSendEmailBut').show();

            $('#postsBlock').hide();
            $('#register-block').hide().html('');
            $('#login-block').hide().html('');
            $('#signBut').hide();
            $('#regBut').hide();
            sendEmailForm.render();
        } else {
            router.navigate('/connected_user/' + App.Properties.valid.get('userId'), {trigger: true});
        }
    };

    App.Functions.showPosts = function(){
        if (App.Properties.valid.get('userIsAuthorised')) {
            $('#containerHeader').show();
            $('#containerHeaderBlock').html('').hide();
            $('#postsBlock').show();
            $('#register-block').hide().html('');
            $('#login-block').hide().html('');
            $('#welcomeBlock').hide();
            $('#signOutBut').show();
            $('#signBut').hide();
            $('#regBut').hide();
        } else {
            router.navigate('/connected_user/' + App.Properties.valid.get('userId'), {trigger: true});
            //router.navigate('#main');
        }
    };

    App.Functions.showedUpdateButtons = function() {
        if(App.Properties.valid.get('username') !== 'admin') {
            $('.butMini').hide();
            $('.butAdd').show();
        } else {
            $('.butMini').show();
            $('.butSendMessage').hide();
            $('.butUpd').hide();
        }
    };

    App.Functions.changeLogo = function() {
        if (App.Properties.valid.get('userIsAuthorised')) {
            $('#containerHeaderBlock').html('').show().append(template('uploadFile2'));
            $('#signOutBut').show();

            $('#postsBlock').hide();
            $('#register-block').hide().html('');
            $('#login-block').hide().html('');
            $('#signBut').hide();
            $('#regBut').hide();
        } else {
            router.navigate('/connected_user/' + App.Properties.valid.get('userId'), {trigger: true});
        }
    };

    App.Functions.showFriends = function() {
        if (App.Properties.valid.get('userIsAuthorised')) {
            $('#postsBlock').hide();
            $('#containerHeader').show();
            $('#containerHeaderBlock').html('').show();
            $('#register-block').hide().html('');
            $('#login-block').hide().html('');
            $('#welcomeBlock').hide();
            $('#signOutBut').show();
            $('#signBut').hide();
            $('#regBut').hide();

            console.log("Show users logname ", App.Properties.valid.get('username'));
            //App.Properties.friendsView.initialize();
            App.Properties.friendsView.render();
            $('.butMini').hide();
        } else {
            router.navigate('/connected_user/' + App.Properties.valid.get('userId'), {trigger: true});
        }
    };

    App.Functions.showUsers = function() {
            if (App.Properties.valid.get('userIsAuthorised')) {
                $('#postsBlock').hide();
                $('#containerHeader').show();
                $('#containerHeaderBlock').html('').show();
                $('#register-block').hide().html('');
                $('#login-block').hide().html('');
                $('#welcomeBlock').hide();
                $('#signOutBut').show();
                $('#signBut').hide();
                $('#regBut').hide();
                console.log("Show users logname ", App.Properties.valid.get('username'));
                //App.Properties.friendsView.initialize();
                App.Properties.userView.render();
                App.Functions.showedUpdateButtons();
            } else {
                router.navigate('/connected_user/' + App.Properties.valid.get('userId'), {trigger: true});
                //router.navigate('#main');
            }
    };


    App.Functions.userIsValid = function(){
            App.Properties.valid.fetch({
                success: function(response) {
                    var userId = response.toJSON().userId;
                    setTimeout(function(){
                        console.log("JSON Valid val = ", response.toJSON().val);
                        console.log("JSON Verify val = ", response.toJSON().verify);

                        App.Properties.valid.set('userIsAuthorised', response.toJSON().val);
                        App.Properties.valid.set('verify', response.toJSON().verify);

                        if (App.Properties.thisUser) {
                            App.Properties.valid.set('username', App.Properties.thisUser.get('username'));
                        }
                        App.Properties.valid.set('userId', userId);
                    }, 100);
                }
            });
    };

    App.Functions.loadModels = function(id) {
        if (!App.Properties.newUserCol || (!App.Properties.newUserCol.where({_id: id})[0])) {
            App.Properties.newUserCol = new App.Collections.UserPages();
            App.Properties.newUserCol.fetch({
                success: function(){
                    console.log('Successfully load with db!');
                    console.log(App.Properties.newUserCol);
                    return App.Properties.newUserCol;
                },
                error: function(){
                    console.log('Failed to get blog');
                }
            });
        } else {
            return App.Properties.newUserCol;
        }

    };

    App.Functions.showOneUser = function(id) {
        App.Functions.userIsValid();
        $('#postsBlock').hide();
        $('#register-block').hide();
        $('#login-block').hide();
        $('#welcomeBlock').hide();
        $('#signOutBut').show();
        $('#signBut').hide();
        $('#regBut').hide();
        $('.butMini').show();
        $('#containerHeaderBlock').show();

        console.log("user Is Verify?" , App.Properties.valid.get('verify'));
        if (!App.Properties.valid.get('verified')){
            App.Properties.changeState.set({userId: id});
            App.Properties.changeState.save({
                success: function() {
                    console.log('user is changed');
                }
            });
        }


        App.Functions.loadModels(id);
        setTimeout(function(){
            var loadColl = App.Functions.loadModels(id);
            if (loadColl) {
                var model = loadColl.where({_id: id})[0];
                App.Properties.thisUser = model;
                App.Properties.friendsView.initialize();
                App.Properties.valid.set('userId', model);
                App.Properties.valid.set('userIsAuthorised', true);
                App.Functions.userIsValid();
                var userView = new App.Views.NewUserPage({model: model});
                $('#containerHeader').show();
                $('#containerHeaderBlock').show().html(template('mainHeader'));
                $('#forUsersHeader').append(userView.render().el);
                $('.butAdd').hide();
                $('.butSendMessage').hide();
            } else {
                console.log("User else not load")
            }
        }, 60);



    };

    App.Functions.clearRegForm = function() {
        $('#editUsernameReg').val('');
        $('#editPasswordReg').val('');
        $('#editConfirmPasswordReg').val('');
        $('#editEmailReg').val('');
        $('#editBirthdayReg').val('1990-01-01');
        $('#editAddressReg').val('');
    };

    App.Functions.clearLogForm = function() {
        $('#editUsernameLog').val('');
        $('#editPasswordLog').val('');
    };


    //-------------------------------------------------------------------------------
    //-------MODELS--------------MODELS--------------MODELS-------------MODELS-------
    //-------------------------------------------------------------------------------


    Backbone.Model.prototype.idAttribute = "_id";

    App.Models.Post = Backbone.Model.extend({
        defaults: {
            title: "new Post",
            content: "empty",
            image: ""
        }
    });

    App.Models.ChangeState = Backbone.Model.extend({
        url: "http://localhost:3060/changeState"
    });

    App.Models.AddFriends = Backbone.Model.extend({
        url: "http://localhost:3060/addFriends"
    });

    App.Models.SendMessage = Backbone.Model.extend({
        url: "http://localhost:3060/sendEmail"
    });

    App.Models.SendRestore = Backbone.Model.extend({
        url: "http://localhost:3060/sendRestore"
    });

    App.Models.UserLogValid = Backbone.Model.extend({
        defaults:{
            userIsAuthorised: false
        },
        url: "http://localhost:3060/userIsValid"
    });

    App.Models.UserLog = Backbone.Model.extend({
        url: "http://localhost:3060/userLog",
        validate: function(attr) {
            if ((!attr.username) || (attr.username.length < 3)) {
                return "Length username must be more at 3 symbols"
            }
        }
    });
    App.Models.UserPage = Backbone.Model.extend({
        defaults: {
            img: 'images/question.png'
        },
        validate: function(attr){
            if ((!attr.username) || (attr.username.length < 3)) {
                return "Length username must be more at 3 symbols"
            }
           if ((!attr.email) || (attr.email.length <= 5) || (attr.email.search("@") == -1) || (attr.email.search('.') == -1)){
                return "Invalid Email!"
            }
        }
    });


    //--------------------------------------------------------------------------------
    //----COLLECTIONS---------COLLECTIONS---------COLLECTIONS---------COLLECTIONS-----
    //--------------------------------------------------------------------------------

    App.Collections.UserPages = Backbone.Collection.extend({
        url: "http://localhost:3060/users",
        model: App.Models.UserPage
    });

    App.Collections.FriendsPages = Backbone.Collection.extend({
        url: "http://localhost:3060/friends",
        model: App.Models.UserPage
    });

    App.Collections.Posts = Backbone.Collection.extend({
        url: "http://localhost:3060/posts",
        model: App.Models.Post
    });

    //--------------------------------------------------------------------------------
    //-------VIEWS---------------VIEWS---------------VIEWS---------------VIEWS--------
    //------RESTORE-------------RESTORE-------------RESTORE-------------RESTORE-------
    //--------------------------------------------------------------------------------
    App.Views.NewSendRestore = Backbone.View.extend({
        model: new App.Models.SendRestore,
        template: template("restorePassword"),
        events: {
            'click #restorePasswordButton': 'sendRestore'
        },
        initialize: function(){
            console.log("i restoring");
            this.render();
        },
        render: function(){
            this.$el.html(this.template());
            return this
        },
        sendRestore: function() {
            console.log('send restore');
            user = new App.Models.SendRestore();
            user.set('email', $('#editEmailForRestore').val());
            user.save(null, {
                success: function (response) {
                    console.log('mess for email = ' + response.toJSON().message);
                    $('#errorLabRestore').html(response.toJSON().message);
                    router.navigate('#main', {trigger: true});
                },
                error: function () {
                    console.log("Failed Save data((((")
                }
            });
        }
    });




    App.Views.SendRestorePage = Backbone.View.extend({
        //el: '#global',
        el: $('#login-block'),

        initialize: function(){
            //console.log(this.el);
        },
        render: function() {
            var userView = new App.Views.NewSendRestore();
            this.$el.append(userView.render().el);
        }

    });


    //--------------------------------------------------------------------------------
    //-------VIEWS---------------VIEWS---------------VIEWS---------------VIEWS--------
    //-------SEND@---------------SEND@---------------SEND@---------------SEND@--------
    //--------------------------------------------------------------------------------
    App.Views.NewSendEmail = Backbone.View.extend({
        model: new App.Models.SendMessage,
        template: template("sendEmail"),
        events: {
            'click #sendEmailButton': 'sendEmail'
        },
        initialize: function(){
            this.render();
        },
        render: function(){
            this.$el.html(this.template());
            return this
        },
        sendEmail: function() {
            console.log('send email');
            user = new App.Models.SendMessage();
            user.set('email', $('#sendEmailEdit').val());
            user.save(null, {
                success: function (response) {
                    console.log("Successfully Save Data!))) with id " + response.toJSON()._id);
                    console.log("username this user is " + response.toJSON().username);
                    router.navigate('/connected_user/' + response.toJSON()._id, {trigger: true});
                },
                error: function () {
                    console.log("Failed Save data((((")
                }
            });
        }
    });




    App.Views.SendEmailPage = Backbone.View.extend({
        el: '#global',
        //el: $('#login-block'),

        initialize: function(){
            //console.log(this.el);
        },
        events: {
            'click #signBut': 'showForm'
        },
        render: function() {
            var userView = new App.Views.NewSendEmail();
            $('#containerHeaderBlock').append(userView.render().el);
        }

    });


    //--------------------------------------------------------------------------------
    //-------VIEWS---------------VIEWS---------------VIEWS---------------VIEWS--------
    //-------LOGIN---------------LOGIN---------------LOGIN---------------LOGIN--------
    //--------------------------------------------------------------------------------
    App.Views.NewLogin = Backbone.View.extend({
        model: new App.Collections.UserPages,
        template: template("login"),
        events: {
            'click #signInButton': 'sendFormLog'
        },
        initialize: function(){
            this.render();
        },
        render: function(){
            this.$el.html(this.template());
            return this
        },
        sendFormLog: function() {
            console.log('send form login');
            var compResult = 1;
            user = new App.Models.UserLog();
            user.set('username', $('#editUsernameLog').val());
            console.log('inputUsername => ', $('#editUsernameLog').val());
            if ($('#editPasswordLog').val().length > 6) {
                console.log("passwordTrue => ", $('#editPasswordLog').val());
                user.set('password', $('#editPasswordLog').val(), {validate: true});
            } else {
                compResult = 0;
            }
            console.log('inputPassword => ', $('#editPasswordLog').val());
            if (user.isValid() && compResult){
                user.save(null, {
                    success: function(response) {
                        console.log('Successfully Save Data!))) with id ' + response.toJSON()._id);
                        console.log("username this user is " + response.toJSON().username);
                        router.navigate('/connected_user/' + response.toJSON()._id, {trigger: true});
                    },
                    error: function(){
                        console.log("Failed Save data((((")
                    }
                });
            } else if(!compResult) {
                $('#errorLabLog').html("password must be more at 6 symbols!");
            } else {
                $('#errorLabLog').html(user.validationError);
            }
            App.Functions.clearLogForm();
            compResult = 1;
        }


    });

    App.Views.LoginPage = Backbone.View.extend({
        //el: '#global',
        el: $('#login-block'),
        initialize: function(){
            //console.log(this.el);
        },
        events: {
            'click #signBut': 'showForm'
        },
        render: function() {
            var userView = new App.Views.NewLogin();
            this.$el.append(userView.render().el);
        }

    });

    //--------------------------------------------------------------------------------
    //-------VIEWS---------------VIEWS---------------VIEWS---------------VIEWS--------
    //------REGISTER------------REGISTER------------REGISTER------------REGISTER------
    //--------------------------------------------------------------------------------
    App.Views.NewRegister = Backbone.View.extend({
        //model: userCol,
        template: template("register"),
        initialize: function(){
            this.render();
        },
        events: {
            'click #registerButton': 'sendFormReg'
        },
        render: function(){
            //console.log(this.$el);
            this.$el.html(this.template());
            return this
        },

        sendFormReg: function() {
            var compResult = 1;
            console.log("sendForm");
            user = new App.Models.UserPage();
            user.set('username', $('#editUsernameReg').val());
            if (($('#editPasswordReg').val()) == ($('#editConfirmPasswordReg').val()) && ($('#editPasswordReg').val().length > 6)) {
                console.log("passwordTrue => ", $('#editPasswordReg').val());
                user.set('password', $('#editPasswordReg').val());
            } else {
                compResult = 0;
                console.log("passwordFalse => ", $('#editPasswordReg').val());
                user.set('password', $('#editPasswordReg').val());
            }
            user.set('email', $('#editEmailReg').val(),{validate: true});
            console.log("email => ", $('#editEmailReg').val());
            user.set('birthday', $('#editBirthdayReg').val(), {validate: true});
            console.log("birthday => ", $('#editBirthdayReg').val());
            user.set('address', $('#editAddressReg').val(), {validate: true});
            console.log("address => ", $('#editAddressReg').val());


            console.log(user.validationError);
            console.log("isValid?? " ,user.isValid());
            console.log(user.toJSON());
            if (user.isValid() && compResult){
                this.collection.add(user);
                user.save(null, {
                    success: function(response) {
                        router.navigate('#main', {trigger: true});
                        console.log("Successfully Save Data!))) with id " + response.toJSON()._id);
                        compResult = 1;
                    },
                    error: function(){
                        console.log("Failed Save data((((")
                        compResult = 1;
                    }
                });
            } else if(!compResult) {
                console.log("passwords is not comfirm!");
                compResult = 1;
                $('#errorLab').html("password must be confirm and more at 6 symbols!");
            } else {
                console.log(user.validationError);
                $('#errorLab').html(user.validationError);
                compResult = 1;
            }
            App.Functions.clearRegForm();

        }
    });



    App.Views.RegisterPage = Backbone.View.extend({
        //model: usersCol,
        el: '#global',
        //el: $('#login-block'),
        initialize: function(){
            //console.log(this.el);
        },
        events: {
            'click #regBut': 'showForm'
        },
        render: function() {
            var registerView = new App.Views.NewRegister({collection: this.model});
            $('#register-block').append(registerView.render().el);
        }
    });


    //--------------------------------------------------------------------------------
    //-------VIEWS---------------VIEWS---------------VIEWS---------------VIEWS--------
    //-------USER----------------USER----------------USER----------------USER---------
    //--------------------------------------------------------------------------------

    App.Views.NewUserPage = Backbone.View.extend({
        tagName: "li",
        template: template("user"),
        initialize: function(){
            this.on('delete', this.remove, this);
            this.render();
        },
        events: {
            'click #deleteUserButton': 'deleteUser',
            'click #updateUserButton': 'showUpdateForm',
            'click #updateUserButtonForm': 'updateUser',
            'click #addUserButton': 'addUserToFriends'
        },
        addUserToFriends: function() {
            var modelForAddUser = new App.Models.AddFriends();
            modelForAddUser.set({userId:
                this.model.get('_id')
            });
            modelForAddUser.save(null, {
                success: function(response) {
                    console.log("Adding user is success");
                    console.log("firstUser = ", response.toJSON().firstUser);
                    console.log("secondUser = ", response.toJSON().secondUser);
                    App.Properties.friendsView.initialize();
                },
                error: function() {
                    console.log("Adding user is failed!");
                }
            });
        },
        showUpdateForm: function() {
            this.$el.show().append(template('update'));
            var username = this.$('#lab1').html();
            var email = this.$('#lab2').html();
            var birthday = this.$('#lab3').html();
            var address = this.$('#lab4').html();

            $('#editUsernameUpd').val(username);
            $('#editEmailUpd').val(email);
            $('#editBirthdayUpd').val(birthday);
            $('#editAddressUpd').val(address);
        },
        updateUser: function() {
            var compResult = 1;
            //var myCol = App.Functions.loadModels();
            this.model.set('username', $('#editUsernameUpd').val());
            if (($('#editPasswordUpd').val()) == ($('#editConfirmPasswordUpd').val()) && ($('#editPasswordUpd').val().length > 6)) {
                console.log("passwordTrue => ", $('#editPasswordUpd').val());
                this.model.set('password', $('#editPasswordUpd').val());
            } else {
                compResult = 0;
                console.log("passwordFalse => ", $('#editPasswordUpd').val());
                this.model.set('password', $('#editPasswordUpd').val());
            }
            this.model.set('email', $('#editEmailUpd').val(),{validate: true});
            console.log("email => ", $('#editEmailUpd').val());
            this.model.set('birthday', $('#editBirthdayUpd').val(), {validate: true});
            console.log("birthday => ", $('#editBirthdayUpd').val());
            this.model.set('address', $('#editAddressUpd').val(), {validate: true});
            console.log("address => ", $('#editAddressUpd').val());


            console.log(this.model.validationError);
            console.log("isValid?? " ,this.model.isValid());
            console.log(this.model.toJSON());
            if (this.model.isValid() && compResult){
                //this.collection.add(user);
                this.model.save(null, {
                    success: function(response) {
                        console.log("Successfully UPDATE Data!))) with id " + response.toJSON()._id);

                        compResult = 1;
                    },
                    error: function(){
                        console.log("Failed Save data((((")
                        compResult = 1;
                    }
                });
            } else if(!compResult) {
                console.log("passwords is not confirm!");
                compResult = 1;
                $('#errorLab').html("password must be confirm and more at 6 symbols!");
            } else {
                console.log(this.model.validationError);
                $('#updateLab').html(this.model.validationError);
                compResult = 1;
            }
            $('#viewContentHeader').hide();
            router.navigate('#showUsers', {trigger: true});
        },
        deleteUser: function() {
            this.model.destroy({
                success: function(response) {
                    console.log("Successfully DELETED user with id " + response.toJSON()._id);
                    if (App.Properties.valid.get('username') !== 'admin') {
                        App.Properties.valid.set('userIsAuthorised', false);
                        router.navigate('#showUsers',{trigger: true});
                    }
                    App.Functions.userIsValid();
                    $('#containerHeaderBlock').html('');
                    App.Properties.userView.render();
                },
                error: function(){
                    console.log("Failed to delete user!")
                }
            })
        },
        render: function(){
            //console.log("el = ", this.$el);
            this.$el.html(this.template(this.model.toJSON()));
            return this
        }
    });

    App.Views.UserPages = Backbone.View.extend({
        el: $('#containerHeaderBlock'),
        initialize: function() {
            console.log("App.Views.UserPages this.collection = ", this.collection);
            this.model.fetch({
                success: function(response){
                    _.each(response.toJSON(),
                        function(item){
                            console.log('"User Page" Successfully GET blog with id ' + item._id);
                            //$('#containerHeaderBlock').html("");
                            //App.Properties.userView.render();
                            //App.Properties.friendsView.render();
                        });
                },
                error: function(){
                    console.log('Failed to get blogs');
                }
            });
            console.log("mod = ", this.model.toJSON())
        },
        render: function() {
            console.log("i in UserPages ready to render!");
            console.log(this.model);
            this.model.each(function(myModel) {
                var userView = new App.Views.NewUserPage({model:myModel});
                this.$el.append(userView.render().el);
            }, this);
        }
    });

    //--------------------------------------------------------------------------------
    //-------VIEWS---------------VIEWS---------------VIEWS---------------VIEWS--------
    //-------POST----------------POST----------------POST----------------POST---------
    //--------------------------------------------------------------------------------

    App.Views.NewPost = Backbone.View.extend({
        tagName: "li",
        template: template("post"),
        initialize: function(){
            this.render();
        },
        render: function(){
            //console.log("el = ", this.$el);
            this.$el.html(this.template(this.model.toJSON()));
            return this
        }
    });

    App.Views.Posts = Backbone.View.extend({
        el: '#posts',
        initialize: function() {
            console.log(this.collection);
            this.render();
        },
        render: function() {
            this.collection.each(function(myModel) {
                var postView = new App.Views.NewPost({model:myModel});
                this.$el.append(postView.render().el);
            }, this);
        }
    });


    //--------------------------------------------------------------------------------
    //------ROUTERS-------------ROUTERS-------------ROUTERS-------------ROUTERS-------
    //--------------------------------------------------------------------------------

    App.Router = Backbone.Router.extend({
        routes: {
            '': 'main',
            'main': 'main',
            'logOut': 'main',
            'showUsers': 'showUsers',
            'showFriends': 'showFriends',
            'showPosts': 'showPosts',
            'sendEmail': 'sendEmail',
            'register': 'register',
            'login': 'login',
            'connected_user/:id': 'connUser',
            'changeLogo': 'changeLogo',
            'restorePage' : 'restore'
        },
        main: function() {
            App.Functions.userIsValid();
            if (!App.Properties.valid.get('userIsAuthorised')) {
                $('#welcomeBlock').html('').show().append(template('welcome'));
                $('#signBut').show();
                $('#regBut').show();
                $('#postsBlock').hide();
                $('#register-block').hide().html('');
                $('#login-block').hide().html('');
                $('#signOutBut').hide();
                $('#containerHeader').hide();
            } else {
                router.navigate('/connected_user/' + App.Properties.valid.get('userId'), {trigger: true});
            }
        },
        changeLogo: function() {
            App.Functions.userIsValid();
            setTimeout(App.Functions.changeLogo, 100);
        },
        sendEmail: function() {
            App.Functions.userIsValid();
            setTimeout(App.Functions.sendEmail, 100);
        },
        showUsers: function() {
            App.Functions.userIsValid();
            console.log("i am get!", App.Properties.valid.get('userIsAuthorised'));
            console.log("i username!", App.Properties.valid.get('username'));
            setTimeout(App.Functions.showUsers, 500);
        },
        showFriends: function() {
            App.Functions.userIsValid();
            console.log("i am get!", App.Properties.valid.get('userIsAuthorised'));
            console.log("i username!", App.Properties.valid.get('username'));
            setTimeout(App.Functions.showFriends, 500);
        },
        register: function() {
            App.Functions.userIsValid();
            if (!App.Properties.valid.get('userIsAuthorised')) {
                $('#postsBlock').hide();
                $('#register-block').html('').show();
                $('#login-block').hide().html('');
                $('#welcomeBlock').hide();
                $('#containerHeader').hide();
                $('#signOutBut').hide();
                $('#signBut').show();
                $('#regBut').show();
                regForm.render();
            } else {
                router.navigate('#main');
            }
        },
        login: function() {
            App.Functions.userIsValid();
            if (!App.Properties.valid.get('userIsAuthorised')) {
                $('#welcomeBlock').hide();
                $('#postsBlock').hide();
                $('#containerHeader').hide();
                $('#register-block').hide().html('');
                $('#login-block').html('').show();
                $('#signOutBut').hide();
                $('#signBut').show();
                $('#regBut').show();
                loginForm.render();
            } else {
                router.navigate('#main');
            }
        },
        restore: function() {
            App.Functions.userIsValid();
            if (!App.Properties.valid.get('userIsAuthorised')) {
                $('#welcomeBlock').hide();
                $('#postsBlock').hide();
                $('#containerHeader').hide();
                $('#register-block').hide().html('');
                $('#login-block').html('').show();
                $('#signOutBut').hide();
                $('#signBut').show();
                $('#regBut').show();
                App.Properties.sendRestoreForm.render();
            } else {
                router.navigate('#main');
            }
        },
        connUser: function(id){
            App.Functions.showOneUser(id);
        },
        showPosts: function() {
            App.Functions.userIsValid();
            setTimeout(App.Functions.showPosts, 100);
        }
    });

    //--------------------------------------------------------------------------------
    //----INITIALIZE----------INITIALIZE----------INITIALIZE----------INITIALIZE------
    //--------------------------------------------------------------------------------

    App.Functions.init();
    Backbone.history.start();

})();
