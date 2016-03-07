var express = require('express');
var router = express.Router();
var Handler = require('../handlers/user');

var handler = new Handler();

// output all users in JSON Format (getAllUsers)
router.get('/', handler.getAllUser);

// output one user (getOneUser)
router.get('/:id', handler.getOneUser);

//deleting user by id (deleteUser)
router.put('/:id', handler.updateUser);

//updating user by id (updateUser)
router.delete('/:id', handler.deleteUser);

module.exports = router;

