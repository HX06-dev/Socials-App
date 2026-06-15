const express = require('express')
const router = express.Router()
const { createPost, getFeedPosts } = require('../controllers/postController')
const protect = require('../middleware/authMiddleware')

router.post('/', protect, createPost)      // protect runs first, then createPost
router.get('/', getFeedPosts)              // anyone can view posts

module.exports = router