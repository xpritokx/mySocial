var express = require('express');
var router = express.Router();
var Handler = require('../handlers/invite');

var handler = new Handler();

router.post('/apply', handler.addInvite);

router.post('/cancel', handler.canceledInvite);

router.get('/', handler.getInvite);

module.exports = router;