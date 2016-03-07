var express = require('express');
var router = express.Router();
var Handler = require('../handlers/auth');

var handler = new Handler();

// parsing POST userLog form and verification user and password in db (enterInToSite)
router.post('/', handler.enterInToSite);

// registration User, send message for verify User
router.get('/:id', handler.verify);

module.exports = router;