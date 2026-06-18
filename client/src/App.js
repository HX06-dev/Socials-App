import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import Explore from './pages/Explore'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Navigate to='/feed' />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/feed' element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } />
        <Route path='/explore' element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        } />
        <Route path='/profile/:id' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App