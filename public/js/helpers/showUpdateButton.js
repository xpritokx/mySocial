define([
    'helpers/currModel'
], function (
    currModel
){
    //showing and hiding buttons
    function showUpdateButton() {
        currModel(function (currentUserModel) {
            var $butMini = $('.butMini');
            var $deletePostButtonForm = $('.deletePostButtonForm');
            var $butAdd = $('.butAdd');
            var $butKick = $('.butKick');
            var $butWrite = $('.butWrite');
            var $butUpd = $('.butUpd');

            //showing and hiding button on permissions
            if(!currentUserModel.get('admin')) {
                $butMini.hide();
                $deletePostButtonForm.hide();
                $butAdd.show();
                $butKick.hide();
                $butWrite.hide();
            } else {
                $butMini.show();
                $butUpd.hide();
                $butKick.hide();
                $butWrite.hide();
                $deletePostButtonForm.show();
            }
        });
    }

    return showUpdateButton
});
