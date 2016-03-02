function currModel (func) {
    if (!currentUserModel) {
        var modelInstance = new UserPageModel({_id:'admin'});
        console.log(modelInstance);
        modelInstance.urlRoot = function () {
            return '/users/';
        };
        console.log(modelInstance.urlRoot);
        modelInstance.fetch({
            success: function(model){
                currentUserModel = model;
                if (func) {
                    func();
                }
            }
        });
    } else {
        if (func) {
            func();
        }
    }
}
