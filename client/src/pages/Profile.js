import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function Profile() {
    const { id } = useParams()   // grabs the :id from the URL
    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [bio, setBio] = useState('')
    const [profilePicture, setProfilePicture] = useState('')
    const [error, setError] = useState(null)

    const token = localStorage.getItem('token')
    const currentUserId = localStorage.getItem('userId')
    const isOwnProfile = currentUserId === id

    useEffect(() => {
        fetchProfile()
    }, [id])

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/users/${id}`)
            setProfile(res.data.user)
            setPosts(res.data.posts)
            setBio(res.data.user.bio)
            setProfilePicture(res.data.user.profilePicture)
        } catch (err) {
            if (err.response?.status === 404) {
                setError('User not found')
            } else {
                setError('Something went wrong')
            }
        }
    }

    const handleUpdate = async () => {
        try {
            await axios.put(
                `http://localhost:5000/users/${id}`,
                { bio, profilePicture },
                { headers: { Authorization: `Bearer ${token}` } }
        )
            setIsEditing(false)
            fetchProfile()
        } catch (err) {
            console.error(err)
        }
    }

    const handleFollow = async () => {
        try {
            await axios.put(
                `http://localhost:5000/users/${id}/follow`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
            fetchProfile()
        } catch (err) {
            console.error(err)
        }
    }

    if (error) return <p>{error}</p> 
    if (!profile) return <p>Loading...</p>

    const isFollowing = profile.followers.includes(currentUserId)

    return (
        <div>
        {/* Profile header */}
        <div>
            {profile.profilePicture
            ? <img src={profile.profilePicture} alt='avatar' width={80} height={80} />
            : <div style={{ width: 80, height: 80, background: 'gray', borderRadius: '50%' }} />
            }
            <h2>{profile.username}</h2>
            <p>{profile.bio || 'No bio yet'}</p>
            <p>{profile.followers.length} followers · {profile.following.length} following</p>

            {/* Show edit or follow button depending on whose profile it is */}
            {isOwnProfile ? (
            <button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            ) : (
            <button onClick={handleFollow}>
                {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            )}
        </div>

        {/* Edit form */}
        {isEditing && (
            <div>
            <input
                type='text'
                placeholder='Profile picture URL'
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
            />
            <textarea
                placeholder='Bio'
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            />
            <button onClick={handleUpdate}>Save</button>
            </div>
        )}

        {/* User's posts */}
        <h3>Posts</h3>
        {posts.map((post) => (
            <div key={post._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
            <p>{post.content}</p>
            <small>{new Date(post.createdAt).toLocaleString()}</small>
            </div>
        ))}
        </div>
    )
}

export default Profile