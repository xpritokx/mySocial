define([
    'Backbone',
    'Underscore',
    'models/user',
], function (
    Backbone,
    _,
    UserPageModel
){

    function currModel (func) {
        var modelInstance = new UserPageModel({_id: 'id_for_URL/:id'});

        modelInstance.on('change', function () {
            console.log('current model has been changed!');
        });

        modelInstance.fetch({
            success: function(model){
                if (func) {
                    func(model);
                }
            },
            error: function () {
                if (func) {
                    func();
                }
            }
        });
    };

    return currModel

});

