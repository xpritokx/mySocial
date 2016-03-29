define([
    'Backbone',
    'Underscore',
    'models/login',
    'app',

    'helpers/sockets',

    'text!templates/loginPage.html'
], function (
    Backbone,
    _,
    UserLogModel,
    app,

    sockets,

    temp
) {
    var LoginPageView;

    LoginPageView = Backbone.View.extend({
        model: UserLogModel,
        el: '#login-block',
        template: _.template(temp),

        initialize: function () {
            this.render();
        },

        events: {
            'click #signInButton': 'sendFormLog'
        },

        sendFormLog: function () {
            console.log('-=- LOGIN -=-');
            var user = new this.model();
            var $usInput = $('#editUsernameLog').val();
            var $passInput = $('#editPasswordLog').val();

            //get coords -> latitude and longitude
            navigator.geolocation.getCurrentPosition(success, error);

            function success(p) {
                login(p.coords.latitude, p.coords.longitude);
            }

            function error() {
                login(0, 0);
            }

            function login(lat, long) {
                var $editUsernameLog = $('#editUsernameLog');
                var $editPasswordLog = $('#editPasswordLog');
                var $errorLabLog = $('#errorLabLog');

                if ($passInput.length > 6) {
                    user.save({
                        'username': $usInput,
                        'password': $passInput,
                        'coords': {
                            latitude: lat,
                            longitude: long
                        }
                    }, {
                        success: function (model) {
                            console.log('Successfully Save Data!))) with id ' + model.toJSON()._id);
                            console.log('username this user is ' + model.toJSON().username);
                            sockets();
                            GLOBAL.router.navigate('/connected_user/' + model.toJSON()._id, {trigger: true});
                        },
                        error: function () {
                            console.log('Failed Save LOGIN data((((')
                        }
                    });
                } else {
                    $errorLabLog.html('password must be more at 6 symbols!');
                }

                $editUsernameLog.val('');
                $editPasswordLog.val('');
            }
        },

        render: function () {
            this.$el.hide().html('').append(this.template()).slideDown('slow');
        }
    });

    return LoginPageView
});

