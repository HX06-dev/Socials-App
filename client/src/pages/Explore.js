import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Explore() {
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchAllPosts()
    }, [])

    const fetchAllPosts = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get('http://localhost:5000/posts/all', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setPosts(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
        <h2>Explore</h2>
        {posts.map((post) => (
            <div key={post._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
                <strong
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/profile/${post.author._id}`)}
                >
                    {post.author.username}
                </strong>
                <p>{post.content}</p>
                <small>{new Date(post.createdAt).toLocaleString()}</small>
            </div>
        ))}
        </div>
    )
}

export default Explore