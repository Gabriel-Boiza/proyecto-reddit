import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


import Home from './pages/home.jsx'

import Login from './pages/auth/login.jsx'
import Register from './pages/auth/register.jsx'

import Profile from './pages/profile/profile.jsx'

import PrivateRoute from './components/privateRoute.jsx'
 
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute/>}>
          <Route path='/profile' element={<Profile />}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
