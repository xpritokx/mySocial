var express = require('express');
var router = express.Router();
var Handler = require('../handlers/chat');

var handler = new Handler();

//sending message to the chat
router.post('/', handler.sendMessage);

//loading messages for chat
router.get('/', handler.getMessages);

//loading messages for chat
router.delete('/:id', handler.delMessage);

module.exports = router;