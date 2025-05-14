import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home.jsx';
import Login from './pages/auth/login.jsx';
import Register from './pages/auth/register.jsx';
import CreatePost from './pages/posts/createPost.jsx';
import Profile from './pages/profile/profile.jsx';
import EditProfile from './pages/profile/editProfile.jsx';
import ProfilePrueba from './pages/profile/profileprueba.jsx';

import AuthProvider from './context/authProvider.jsx';
import PrivateRoute from './components/privateRoute.jsx';

import ViewPost from './pages/posts/viewPost.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
<<<<<<< HEAD
          <Route path="/pp/:id" element={<ProfilePrueba />} />
          <Route path='/post/:id' element={<ViewPost/>}/>
          <Route element={<PrivateRoute />}>
            <Route path="/createPost" element={<CreatePost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
=======
          <Route path="/profile/:username" element={<Profile isOwner={false} />} />
          <Route path='/post/:id' element={<ViewPost/>}/>
          <Route element={<PrivateRoute />}>
            <Route path="/createPost" element={<CreatePost />} />
            <Route path="/profile" element={<Profile isOwner={true}/>} />
>>>>>>> a4d0abba51074c2cf1d28cd37ffd2be11afd764a
            <Route path="/editProfile" element={<EditProfile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
