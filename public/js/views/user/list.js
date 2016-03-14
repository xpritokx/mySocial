define([
    'Backbone',
    'Underscore',
    'models/friend',

    'helpers/showUpdateButton',

    'text!templates/updateUserInfoPage.html',
    'text!templates/userPage.html'
], function (
    Backbone,
    _,
    FriendModel,

    showUpdateButton,

    tempUpdateUser,
    tempUser
) {
    var NewUserPageView = Backbone.View.extend({
        tagName: "li",

        template: _.template(tempUser),

        initialize: function () {

            this.model.on('destroy', function () {
                this.remove();
                GLOBAL.getUserInstance().getDataToCollection();
                showUpdateButton();
            }, this);

            this.on('fromFriendDelete', function () {
                GLOBAL.getFriendsInstance().getDataToCollection();
                //GLOBAL.getUserInstance().getDataToCollection();

                this.remove();
            }, this);

        },

        events: {
            'click .butDel'                    : 'deleteUser',
            'click .butUpd'                    : 'showUpdateForm',
            'click .updateUserButtonForm'      : 'updateUser',
            'click .cancelUpdateUserButtonForm': 'cancelUpdateUser',
            'click .butAdd'                    : 'addUserToFriends',
            'click .butKick'                   : 'kickUserFromFriends',
            'click .butWrite'                  : 'redirectToCorrespondence'
        },

        //adding user to friends
        addUserToFriends: function () {
            var self = this;
            var modelForAddFriend = new FriendModel();

            modelForAddFriend.save({
                userId: this.model.get('_id')
            }, {
                success: function (response) {
                    console.log("Adding user is success");
                    console.log("firstUser = ", response.toJSON().firstUser);
                    console.log("secondUser = ", response.toJSON().secondUser);
                    GLOBAL.getFriendsInstance().getDataToCollection();
                    //GLOBAL.getUserInstance().getDataToCollection();
                    self.remove()
                },
                error: function () {
                    console.log("Adding user is failed!");
                }
            });
        },

        //action when user clicked on the 'WRITE' button
        redirectToCorrespondence: function () {
            GLOBAL.router.navigate('#correspondence/' + this.model.get('_id'), {trigger: true});
        },

        //showing form for update in user page
        showUpdateForm: function () {
            var $formUpdate = $('#formUpdate');

            $formUpdate.remove();
            this.$el.show().append(_.template(tempUpdateUser));
        },

        //deleting user from friends
        kickUserFromFriends: function () {
            var self = this;
            var kickModel = this.model;
            kickModel.urlRoot = function () {
                return '/friends/'
            };
            console.log('del for friends! ', this.model.get('username'));
            kickModel.save(null, {
                success: function (response) {
                    var $butMini = $('.butMini');
                    var $butWrite = $('.butWrite');
                    var $butKick = $('.butKick');

                    console.log('deleted from friends user ' + response.toJSON().response);
                    self.trigger('fromFriendDelete');
                    $butMini.hide();
                    $butWrite.show();
                    $butKick.show();
                },
                error: function () {
                    console.log('friend do not deleted from friends(((');
                }
            });
        },

        //hiding form for update in user page
        cancelUpdateUser: function () {
            var $formUpdate = $('#formUpdate');

            $formUpdate.remove();
        },

        //sending update data on server
        updateUser: function () {
            var $editUsernameUpd = $('#editUsernameUpd');
            var $editEmailUpd = $('#editEmailUpd');
            var $editBirthdayUpd = $('#editBirthdayUpd');
            var $editAddressUpd = $('#editAddressUpd');
            var $viewContentHeader = $('#viewContentHeader');

            this.model.save({
                'username' : $editUsernameUpd.val(),
                'password' : '1234567',
                'email'    : $editEmailUpd.val(),
                'birthday' : $editBirthdayUpd.val(),
                'address'  : $editAddressUpd.val()
            }, {
                success: function (response) {
                    console.log("Successfully UPDATE Data!))) with id " + response.toJSON()._id);
                },
                error: function () {
                    console.log("Failed Save data((((");
                }
            });

            $viewContentHeader.hide();
            GLOBAL.getUserInstance().getDataToCollection();
            GLOBAL.router.navigate('#main', {trigger: true});
        },

        //deleting user from db
        deleteUser: function () {
            if (confirm('you sure, that want to delete user ' + this.model.get('username'))) {

                this.model.destroy({
                    success: function (response) {
                        console.log("Successfully DELETED user with id " + response.toJSON()._id);
                    },
                    error: function () {
                        console.log("Failed to DELETE user!")
                    }
                });
            }
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON())).addClass(this.model.get('_id'));
            return this
        }
    });


    return NewUserPageView
});



