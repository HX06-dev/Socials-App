import { useState, useEffect } from 'react'
import axios from 'axios'

function Feed() {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')
  const [commentText, setCommentText] = useState({})  // tracks comment input per post
  const token = localStorage.getItem('token')

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
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setContent('')
      fetchPosts()
    } catch (err) {
      console.error(err)
    }
  }

  const handleLike = async (postId) => {
    try {
      await axios.put(
        `http://localhost:5000/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchPosts()
    } catch (err) {
      console.error(err)
    }
  }

  const handleComment = async (postId) => {
    try {
      await axios.post(
        `http://localhost:5000/posts/${postId}/comment`,
        { text: commentText[postId] },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCommentText({ ...commentText, [postId]: '' })  // clear that post's input
      fetchPosts()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Feed</h2>

      {/* Create post */}
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

      {/* Posts list */}
      {posts.map((post) => (
        <div key={post._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
          
          {/* Post header */}
          <strong>{post.author.username}</strong>
          <p>{post.content}</p>
          <small>{new Date(post.createdAt).toLocaleString()}</small>

          {/* Like button */}
          <div>
            <button onClick={() => handleLike(post._id)}>
              ❤️ {post.likes.length}
            </button>
          </div>

          {/* Comments */}
          <div>
            {post.comments.map((comment, index) => (
              <div key={index}>
                <strong>{comment.user.username}</strong>: {comment.text}
              </div>
            ))}
          </div>

          {/* Add comment */}
          <div>
            <input
              type='text'
              placeholder='Write a comment...'
              value={commentText[post._id] || ''}
              onChange={(e) => setCommentText({ 
                ...commentText, 
                [post._id]: e.target.value 
              })}
            />
            <button onClick={() => handleComment(post._id)}>Comment</button>
          </div>

        </div>
      ))}
    </div>
  )
}

export default Feed