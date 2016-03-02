NewLoginView = Backbone.View.extend({
    model: new UserPagesCollection,
    template: template("loginPage"),
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
        console.log('-=- LOGIN -=-');
        user = new UserLogModel();
        usInput = $('#editUsernameLog').val();
        passInput = $('#editPasswordLog').val();


        navigator.geolocation.getCurrentPosition(success, error);

        function success (p) {
            login(p.coords.latitude, p.coords.longitude);
        }
        function error () {
            login();
        }

        function login (lat, long) {

            if (arguments.length) {
                user.set('coords', {
                    latitude: lat,
                    longitude: long
                });
            }
            console.log('geo user = ', user);

            if (passInput.length > 6) {
                user.set('username', usInput);
                user.set('password', passInput);
                user.save(null, {
                    success: function(model) {
                        console.log('Successfully Save Data!))) with id ' + model.toJSON()._id);
                        console.log("username this user is " + model.toJSON().username);
                        currentUserModel = model;
                        router.navigate('/connected_user/' + model.toJSON()._id, {trigger: true});
                    },
                    error: function(){
                        console.log("Failed Save LOGIN data((((")
                    }
                });
            } else {
                $('#errorLabLog').html("password must be more at 6 symbols!");
            }
            $('#editUsernameLog').val('');
            $('#editPasswordLog').val('');
        }

    }
});
