define([
    'Backbone',
    'Underscore',
    'models/user',
    'text!templates/registerPage.html'
], function (
    Backbone,
    _,
    UserPageModel,
    temp
) {
    var RegisterPageView = Backbone.View.extend({
        el: '#global',
        template: _.template(temp),

        initialize: function(){
            this.render();
        },

        events: {
            'click #registerButton': 'sendFormReg'
        },

        sendFormReg: function() {
            console.log('-=- REGISTRATION -=-');

            var self = this;
            var user = new UserPageModel();
            var $editUsernameReg = $('#editUsernameReg');
            var $editPasswordReg = $('#editPasswordReg');
            var $editConfirmPasswordReg = $('#editConfirmPasswordReg');
            var $editEmailReg = $('#editEmailReg');
            var $editBirthdayReg = $('#editBirthdayReg');
            var $editAddressReg = $('#editAddressReg');

            if (($editPasswordReg.val()) == ($editConfirmPasswordReg.val()) && ($editPasswordReg.val().length > 6)) {
                user.save({
                    'username': $editUsernameReg.val(),
                    'password': $editPasswordReg.val(),
                    'email'   : $editEmailReg.val(),
                    'birthday': $editBirthdayReg.val(),
                    'address' : $editAddressReg.val()
                }, {
                    success: function(response) {
                        console.log('Successfully REGISTER User!!!))) with id ' + response.toJSON()._id);
                        alert($editUsernameReg.val() + '! We sent you message about verification on email ' + $editEmailReg.val() + " !");
                        self.clearInputs();
                        GLOBAL.router.navigate('#main', {trigger: true});
                    },
                    error: function () {
                        self.clearInputs();
                        console.log('Failed Save REGISTER data((((')
                    }
                });
            } else {
                console.log('REGISTRATION passwords is not confirm!');
                $('#errorLab').html('password must be confirm and more at 6 symbols!');
            }

        },

        clearInputs: function () {
            var $editUsernameReg = $('#editUsernameReg');
            var $editPasswordReg = $('#editPasswordReg');
            var $editConfirmPasswordReg = $('#editConfirmPasswordReg');
            var $editEmailReg = $('#editEmailReg');
            var $editBirthdayReg = $('#editBirthdayReg');
            var $editAddressReg = $('#editAddressReg');

            //clear inputs
            $editUsernameReg.val('');
            $editPasswordReg.val('');
            $editConfirmPasswordReg.val('');
            $editEmailReg.val('');
            $editBirthdayReg.val('1990-01-01');
            $editAddressReg.val('');
        },

        render: function () {
            var $registerBlock = $('#register-block');
            var $editAddressReg;

            $registerBlock.hide().append(this.template()).slideDown('slow');


            $editAddressReg = $('#editAddressReg');

            if (this.model) {
                $editAddressReg.val(this.model);
            }

            return this
        }
    });

    return RegisterPageView
});


