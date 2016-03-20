define([
    'Backbone',
    'Underscore',
], function (
    Backbone,
    _
) {
    //function for hiding friends
    function hideFriends(currentUserModel) {
        console.log('hideModel ', currentUserModel);
        var masFriends = currentUserModel.get('friends');
        var i;

        for (i = 0; i < masFriends.length; i++) {
            $('.' + masFriends[i]).hide()
        }

        for (i = 0; i < GLOBAL.listInvites.length; i++) {
            $('.' + GLOBAL.listInvites[i]).hide()
        }
    }

    return hideFriends
});