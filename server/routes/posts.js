const express = require('express')
const router = express.Router()
const { createPost, getFeedPosts, likePost, addComment } = require('../controllers/postController')
const protect = require('../middleware/authMiddleware')

router.post('/', protect, createPost)      // protect runs first, then createPost
router.get('/', getFeedPosts)              // anyone can view posts

router.put('/:id/like', protect, likePost)
router.post('/:id/comment', protect, addComment)

module.exports = router