const express = require('express')
const router = express.Router()
const { getUserProfile, updateProfile, followUser } = require('../controllers/userController')
const protect = require('../middleware/authMiddleware')

router.get('/:id', getUserProfile)
router.put('/:id', protect, updateProfile)
router.put('/:id/follow', protect, followUser)

module.exports = router