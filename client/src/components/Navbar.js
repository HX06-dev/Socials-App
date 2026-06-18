import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId')
    const username = localStorage.getItem('username')

    const handleLogout = () => {
        localStorage.removeItem('token')
            localStorage.removeItem('userId')
            localStorage.removeItem('username')
            navigate('/login')
    }

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            borderBottom: '1px solid gray'
        }}>
            <span
                style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '20px' }}
                onClick={() => navigate('/feed')}
            >
                Social Media App
            </span>

            <span
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/explore')}
            >
                Explore
            </span>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/profile/${userId}`)}
                >
                {username}
                </span>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    )
}

export default Navbar