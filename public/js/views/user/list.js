NewUserPageView = Backbone.View.extend({
    tagName: "li",
    template: template("userPage"),
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
        var modelForAddFriend = new FriendModel();
        modelForAddFriend.set({userId:
            this.model.get('_id')
        });
        modelForAddFriend.save(null, {
            success: function(response) {
                console.log("Adding user is success");
                console.log("firstUser = ", response.toJSON().firstUser);
                console.log("secondUser = ", response.toJSON().secondUser);
                friendsViewInstance.initialize();
            },
            error: function() {
                console.log("Adding user is failed!");
            }
        });
    },
    showUpdateForm: function() {
        this.$el.show().append(template('updateUserInfoPage'));

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

                    compResult = 1;
                },
                error: function(){
                    console.log("Failed Save data((((")
                    compResult = 1;
                }
            });

        } else {
            $('#updateLab').html(this.model.validationError);
        }

        $('#viewContentHeader').hide();
        router.navigate('#showUsers', {trigger: true});
    },
    deleteUser: function() {
        this.model.destroy({
            success: function(response) {
                console.log("Successfully DELETED user with id " + response.toJSON()._id);
                $('#containerHeaderBlock').html('');
                userViewInstance.render();
            },
            error: function(){
                console.log("Failed to DELETE user!")
            }
        })
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this
    }
});
