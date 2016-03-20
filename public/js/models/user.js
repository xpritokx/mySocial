define([
    'Backbone'
], function (
    Backbone
) {

//model for storage and validation data of one user
    var UserPageModel = Backbone.Model.extend({
        urlRoot : function () {
            return '/users/';
        },

        defaults: {
            coords: {
                latitude: 0,
                longitude: 0
            },
            img: 'images/question.png'
        },

        initialize : function () {
            this.on('change', function () {
                console.log(' modelUser is been changed ');
            });

            this.on('invalid', function (model, validationError) {
                $('#errorLab').html(validationError);
                console.log(model, validationError);
            });
        },

        validate: function (attr) {
            if ((!attr.username) || (attr.username.length < 3)) {
                return 'Length username must be more at 3 symbols'
            }

            if ((!attr.email) || (attr.email.length <= 5) || (attr.email.search('@') == -1) || (attr.email.search('.') == -1)) {
                return 'Invalid Email!'
            }
        }
    });

    return UserPageModel
});
