import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home.jsx'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'

import Header from './components/header.jsx'
import Aside from './components/aside.jsx'
 
function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal con header y aside directamente */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Aside />
              <Home />
            </>
          }
        />

        {/* Ruta con layout diferente (sin header/aside) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
