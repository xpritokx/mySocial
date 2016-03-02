/**
 * Created by Pritok on 29.02.2016.
 */
function showUpdateButton() {
    currModel(function () {
        if(currentUserModel.get('username') !== 'admin') {
            $('.butMini').hide();
            $('.butAdd').show();
        } else {
            $('.butMini').show();
            $('.butSendMessage').hide();
            $('.butUpd').hide();
            $('.deletePostButtonForm').show();
        }
    });

}

