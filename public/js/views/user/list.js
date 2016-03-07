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
            this.on('destroy', this.remove, this);
        },

        events: {
            'click .butDel': 'deleteUser',
            'click .butUpd': 'showUpdateForm',
            'click .updateUserButtonForm': 'updateUser',
            'click .butAdd': 'addUserToFriends'
        },

        addUserToFriends: function() {
            var modelForAddFriend = new FriendModel();
            modelForAddFriend.set({userId:
                this.model.get('_id')
            });
            modelForAddFriend.save(null, {
                success: function(response) {
                    console.log("Adding user is success");
                    console.log("firstUser = ", response.toJSON().firstUser);
                    console.log("secondUser = ", response.toJSON().secondUser);

                    //friendsViewInstance.initialize();
                },
                error: function() {
                    console.log("Adding user is failed!");
                }
            });
        },

        showUpdateForm: function() {
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

        updateUser: function() {
            if (($('#editPasswordUpd').val()) == ($('#editConfirmPasswordUpd').val()) && ($('#editPasswordUpd').val().length > 6)) {
                this.model.save({
                    'username' : $('#editUsernameUpd').val(),
                    'password' : $('#editPasswordUpd').val(),
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
            } else {
                $('#updateLab').html(this.model.validationError);
            }

            $('#viewContentHeader').hide();
            initUsers();
            //router.navigate('#showUsers', {trigger: true});
        },

        deleteUser: function() {
            this.model.destroy({
                success: function(response) {
                    console.log("Successfully DELETED user with id " + response.toJSON()._id);
                    $('#containerHeaderBlock').html('');
                    initUsers();
                    showUpdateButton();
                    //router.navigate('/', {trigger: true})
                },
                error: function(){
                    console.log("Failed to DELETE user!")
                }
            });
        },

        render: function(){
            console.log("NU ", this.model.toJSON());
            this.$el.html(this.template(this.model.toJSON()));
            return this
        }
    });


    return NewUserPageView
});



