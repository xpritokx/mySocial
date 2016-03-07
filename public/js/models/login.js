define([
    'Backbone'
], function (
    Backbone
) {
    //send information for user for authorization
    var UserLogModel = Backbone.Model.extend({
        urlRoot: "/userLog",
        initialize : function () {
            this.on('change', function () {
                console.log(' loginModel is been changed ');
            });

            this.on('invalid', function (model, validationError) {
                $('#errorLabLog').html(validationError);
                console.log('log in error = ', validationError);
            });
        },
        validate: function (attr) {
            if ((!attr.username) || (attr.username.length < 3)) {
                return "Length username must be more at 3 symbols"
            }
        }
    });

    return UserLogModel
});

