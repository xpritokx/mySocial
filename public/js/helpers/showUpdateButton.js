define([
    'helpers/currModel'
], function (
    currModel
){

    function showUpdateButton() {
        currModel(function (currentUserModel) {
            if(currentUserModel.get('username') !== 'admin') {
                $('.butMini').hide();
                $('.deletePostButtonForm').hide();
                $('.butAdd').show();
                $('.butKick').hide();
                $('.butWrite').hide();
            } else {
                $('.butMini').show();
                $('.butUpd').hide();
                $('.butKick').hide();
                $('.butWrite').hide();
                $('.deletePostButtonForm').show();
            }
        });
    }

    return showUpdateButton
});
