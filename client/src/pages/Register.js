import { useState } from 'react'
import axios from 'axios'

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })

    const[error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:5000/auth/register', formData)
            localStorage.setItem('token', res.data.token)
            alert('Registered successfully!')
        } catch (err) {
            setError(err.response.data.message)
        }
    }

      return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    name='username'
                    placeholder='Username'
                    value={formData.username}
                    onChange={handleChange}
                />
                <br />
                <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    value={formData.email}
                    onChange={handleChange}
                />
                <br />
                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                />
                <br />
                <button type='submit'>Register</button>
            </form>
            <p>Already have an account? <a href='/login'>Login</a></p>
        </div>
    )
}

export default Register