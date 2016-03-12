/**
 * Created by Pritok on 10.03.2016.
 */
define([
    'Backbone',
    'Underscore',
], function (
    Backbone,
    _
) {
    function hideFriends(currentUserModel) {
        var masFriends = currentUserModel.get('friends');
        masFriends.forEach(function (classEl) {
            $('.' + classEl).hide()
        });
    }

    return hideFriends
});