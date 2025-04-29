import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home.jsx'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import PrivateRoute from './components/privateRoute.jsx'
 
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute/>}>
          <Route path='/protected' element={<Register/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
