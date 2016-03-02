NewRegisterView = Backbone.View.extend({
    template: template("registerPage"),
    initialize: function(){
        this.render();
    },
    events: {
        'click #registerButton': 'sendFormReg'
    },
    render: function(){
        this.$el.html(this.template());
        return this
    },

    sendFormReg: function() {
        console.log("-=- REGISTRATION -=-");
        user = new UserPageModel();

        if (($('#editPasswordReg').val()) == ($('#editConfirmPasswordReg').val()) && ($('#editPasswordReg').val().length > 6)) {
            user.save({
                'username': $('#editUsernameReg').val(),
                'password': $('#editPasswordReg').val(),
                'email'   : $('#editEmailReg').val(),
                'birthday': $('#editBirthdayReg').val(),
                'address' : $('#editAddressReg').val()
            }, {
                success: function(response) {
                    router.navigate('#main', {trigger: true});
                    console.log("Successfully REGISTER User!!!))) with id " + response.toJSON()._id);
                },
                error: function(){
                    console.log("Failed Save REGISTER data((((")
                }
            });
        } else {
            console.log(" REGISTRATION passwords is not comfirm!");
            $('#errorLab').html("password must be confirm and more at 6 symbols!");
        }
        $('#editUsernameReg').val('');
        $('#editPasswordReg').val('');
        $('#editConfirmPasswordReg').val('');
        $('#editEmailReg').val('');
        $('#editBirthdayReg').val('1990-01-01');
        $('#editAddressReg').val('');

    }
});