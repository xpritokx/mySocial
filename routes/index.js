var express = require('express');
var router = express.Router();
var Handler = require('../handlers/index');

var handler = new Handler();

//sending email in to description email (sendEmail)
router.post('/sendEmail',handler.sendEmail);

// disconnecting users (exit with site)
router.get('/logOut', handler.exitUser);

// uploading data (uploading data in to site)
router.post('/upload', handler.upData);

//restore user password on the user email(restorePass)
router.post('/sendRestore', handler.restorePass);

//changed State user with verificated on the email(changeState)
router.post('/changeState', handler.changeState);

module.exports = router;