define([
    'Backbone'
], function (
    Backbone
) {
    //change state verification User after link in the email (True/False)
    var ChangeStateModel = Backbone.Model.extend({
        urlRoot: function() {
            return "/changeState"
        }
    });

    return ChangeStateModel
});



