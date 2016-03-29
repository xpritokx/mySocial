var express = require('express');
var router = express.Router();
var Handler = require('../handlers/friend');

var handler = new Handler();

// output all friends in JSON Format (getFriends)
router.get('/', handler.getFriends);

//adding user id to array for two users (addFriends)
router.post('/', handler.addFriends);

router.put('/:id', handler.delFromFriends);


//deleting user by id (delFriend)
//router.delete('/:id', handler.delFriend);


module.exports = router;