/**
 * Created by Pritok on 03.03.2016.
 */
var express = require('express');
var router = express.Router();
var Handler = require('../handlers/restorePass');

var handler = new Handler();

//change Pass is valid(changePass)
router.put('/change/:token', handler.changePass);

//is here user can change password(redirectToRestore)
router.get('/:token', handler.redirectToRestore);

//restore user password on the user email(restorePass)
router.post('/', handler.restorePass);

module.exports = router;
