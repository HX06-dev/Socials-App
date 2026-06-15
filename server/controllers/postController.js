const Post = require('../models/Post')

// CREATE POST
const createPost = async (req, res) => {
  try {
    const newPost = new Post({
      author: req.user.id,   // comes from auth middleware
      content: req.body.content
    })

    await newPost.save()

    // populate replaces the author ID with the actual user object
    await newPost.populate('author', 'username profilePicture')

    res.status(201).json(newPost)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET ALL POSTS
const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 })  // newest first

    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createPost, getFeedPosts }