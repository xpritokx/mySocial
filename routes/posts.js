var express = require('express');
var router = express.Router();
var Handler = require('../handlers/post');

var handler = new Handler();

//get All posts! (createPost)
router.get('/', handler.getAllPosts);

//creating new post (createPost)
router.post('/', handler.createPost);

//deleting post
router.delete('/:id', handler.deletePost);

module.exports = router;