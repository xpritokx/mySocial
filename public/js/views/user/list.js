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

        initialize: function(){
            this.model.on('destroy', function() {
                this.remove();
                GLOBAL.getUserInstance().getDataToCollection();
                showUpdateButton();
            }, this);
            this.on('fromFriendDelete', function () {
                GLOBAL.getFriendsInstance().getDataToCollection();
                this.remove();
            }, this);
        },

        events: {
            'click .butDel'              : 'deleteUser',
            'click .butUpd'              : 'showUpdateForm',
            'click .updateUserButtonForm': 'updateUser',
            'click .butAdd'              : 'addUserToFriends',
            'click .butKick'             : 'kickUserFromFriends',
            'click .butWrite'            : 'redirectToCorrespondence'
        },

        addUserToFriends: function() {
            var self = this;
            var modelForAddFriend = new FriendModel();
            modelForAddFriend.set({
                userId: this.model.get('_id')
            });
            modelForAddFriend.save(null, {
                success: function(response) {
                    console.log("Adding user is success");
                    console.log("firstUser = ", response.toJSON().firstUser);
                    console.log("secondUser = ", response.toJSON().secondUser);
                    GLOBAL.getFriendsInstance().getDataToCollection();
                    self.remove()
                },
                error: function() {
                    console.log("Adding user is failed!");
                }
            });
        },

        redirectToCorrespondence: function () {
            GLOBAL.router.navigate('#correspondence/' + this.model.get('_id'), {trigger: true});
        },

        showUpdateForm: function () {
            $('#formUpdate').remove();
            this.$el.show().append(_.template(tempUpdateUser));

            var username = this.$('#lab1').html();
            var email = this.$('#lab2').html();
            var birthday = this.$('#lab3').html();
            var address = this.$('#lab4').html();

            $('#editUsernameUpd').val(username);
            $('#editEmailUpd').val(email);
            $('#editBirthdayUpd').val(birthday);
            $('#editAddressUpd').val(address);
        },

        kickUserFromFriends: function () {
            var self = this;
            var kickModel = this.model;
            kickModel.urlRoot = function() {
                return '/friends/'
            };
            console.log('del for friends! ', this.model.get('username'));
            kickModel.save(null, {
                success: function (response) {
                    console.log('deleted from friends user ' + response.toJSON().response);
                    self.trigger('fromFriendDelete');
                    $('.butMini').hide();
                    $('.butKick').show();
                },
                error: function () {
                    console.log('friend do not deleted from friends(((');
                }
            });
        },

        updateUser: function() {
            this.model.save({
                'username' : $('#editUsernameUpd').val(),
                'password' : '1234567',
                'email'    : $('#editEmailUpd').val(),
                'birthday' : $('#editBirthdayUpd').val(),
                'address'  : $('#editAddressUpd').val()
            }, {
                success: function(response) {
                    console.log("Successfully UPDATE Data!))) with id " + response.toJSON()._id);
                },
                error: function(){
                    console.log("Failed Save data((((");
                }
            });

            $('#viewContentHeader').hide();
            GLOBAL.initUsers();
            GLOBAL.router.navigate('#main', {trigger: true});
        },

        deleteUser: function() {
            if (confirm('you sure, that want to delete user ' + this.model.get('username'))) {
                this.model.destroy({
                    success: function(response) {
                        console.log("Successfully DELETED user with id " + response.toJSON()._id);
                    },
                    error: function(){
                        console.log("Failed to DELETE user!")
                    }
                });
            }
        },

        render: function(){
            console.log("NU ", this.model.toJSON());
            this.$el.html(this.template(this.model.toJSON())).addClass(this.model.get('_id'));
            return this
        }
    });


    return NewUserPageView
});



