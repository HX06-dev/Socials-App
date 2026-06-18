const User = require('../models/User')
const Post = require('../models/Post')

// GET USER PROFILE
const getUserProfile = async (req, res) => {
    try {
        // check if the id is a valid MongoDB ObjectId before querying
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ message: 'User not found' })
        }

        const user = await User.findById(req.params.id).select('-password')

        if (!user) {
        return res.status(404).json({ message: 'User not found' })
        }

        const posts = await Post.find({ author: req.params.id }).sort({ createdAt: -1 })

        res.status(200).json({ user, posts })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const { bio, profilePicture } = req.body

    // make sure users can only edit their own profile
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own profile' })
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { bio, profilePicture },
      { new: true }          // returns the updated document instead of the old one
    ).select('-password')

    res.status(200).json(updatedUser)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// FOLLOW / UNFOLLOW
const followUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You can't follow yourself" })
    }

    const userToFollow = await User.findById(req.params.id)
    const currentUser = await User.findById(req.user.id)

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' })
    }

    const alreadyFollowing = currentUser.following.includes(req.params.id)

    if (alreadyFollowing) {
      // unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== req.params.id
      )
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== req.user.id
      )
    } else {
      // follow
      currentUser.following.push(req.params.id)
      userToFollow.followers.push(req.user.id)
    }

    await currentUser.save()
    await userToFollow.save()

    res.status(200).json({ message: alreadyFollowing ? 'Unfollowed' : 'Followed' })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getUserProfile, updateProfile, followUser }