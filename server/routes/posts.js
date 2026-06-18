const express = require('express')
const router = express.Router()
const { createPost, getFeedPosts, getAllPosts, likePost, addComment } = require('../controllers/postController')
const protect = require('../middleware/authMiddleware')

router.post('/', protect, createPost)
router.get('/', protect, getFeedPosts)
router.get('/all', protect, getAllPosts)
router.put('/:id/like', protect, likePost)
router.post('/:id/comment', protect, addComment)

module.exports = router