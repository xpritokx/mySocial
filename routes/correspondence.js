/**
 * Created by Pritok on 11.03.2016.
 */
var express = require('express');
var router = express.Router();
var Handler = require('../handlers/correspondence');

var handler = new Handler();

//saving message to the db!(saveCorrespondence)
router.post('/', handler.saveCorrespondence);

//sending all messages to the user chat(getMessages)
router.get('/', handler.getUserMessages);

module.exports = router;