var express = require('express');
var router = express.Router();
var Handler = require('../handlers/register');

var handler = new Handler();

// saved users by form registration in JSON Format POST method  (saveUser)
router.post('/', handler.saveUser);

module.exports = router;