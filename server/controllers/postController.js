const Post = require('../models/Post')
const User = require('../models/User')

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

// GET FOLLOWED POSTS
const getFeedPosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id)

    const userIds = [...currentUser.following, req.user.id]

    const posts = await Post.find({ author: { $in: userIds } })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 })

    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET ALL POSTS
const getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find()
        .populate('author', 'username profilePicture')
        .sort({ createdAt: -1 })

      res.status(200).json(posts)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
}

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const alreadyLiked = post.likes.includes(req.user.id)

    if (alreadyLiked) {
      // unlike it
      post.likes = post.likes.filter(id => id.toString() !== req.user.id)
    } else {
      // like it
      post.likes.push(req.user.id)
    }

    await post.save()
    res.status(200).json(post.likes)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const comment = {
      user: req.user.id,
      text: req.body.text
    }

    post.comments.push(comment)
    await post.save()

    await post.populate('comments.user', 'username')

    res.status(201).json(post.comments)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createPost, getFeedPosts, getAllPosts, likePost, addComment }