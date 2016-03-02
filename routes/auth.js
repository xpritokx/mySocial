var express = require('express');
var router = express.Router();
var Handler = require('../handlers/auth');

var handler = new Handler();

// output all users in JSON Format (getUserAuth)
router.get('/', handler.getUserAuth);

// parsing POST userLog form and verification user and password in db (enterInToSite)
router.post('/', handler.enterInToSite);

module.exports = router;