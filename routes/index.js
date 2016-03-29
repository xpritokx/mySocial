var express = require('express');
var router = express.Router();
var Handler = require('../handlers/index');

var handler = new Handler();

router.get('/countMess/:id', handler.getCountMessages);

//updating count messages for send to cliend
router.put('/countMess/:id', handler.updateCountMessages);

//sending email in to description email (sendEmail)
router.post('/sendEmail',handler.sendEmail);

// disconnecting users (exit with site)
router.get('/logOut', handler.exitUser);

// uploading data (uploading data in to site)
router.post('/upload', handler.upData);


module.exports = router;