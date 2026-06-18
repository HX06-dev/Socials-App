const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/users')

require('dotenv').config()

const app = express()

connectDB()

app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/posts', postRoutes)
app.use('/users', userRoutes)

app.get('/', (req, res) => {
    res.send('Server is running!')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})