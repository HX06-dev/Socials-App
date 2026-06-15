import { useState, useEffect } from 'react'
import axios from 'axios'

function Feed() {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const token = localStorage.getItem('token')

  // load posts when page opens
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/posts')
      setPosts(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handlePost = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        'http://localhost:5000/posts',
        { content },
        { headers: { Authorization: `Bearer ${token}` } }  // send the token
      )
      setContent('')     // clear the input
      fetchPosts()       // reload posts
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Feed</h2>

      <form onSubmit={handlePost}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
        />
        <br />
        <button type='submit'>Post</button>
      </form>

      <div>
        {posts.map((post) => (
          <div key={post._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
            <strong>{post.author.username}</strong>
            <p>{post.content}</p>
            <small>{new Date(post.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Feed