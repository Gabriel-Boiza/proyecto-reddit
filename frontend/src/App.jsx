import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home.jsx';
import Login from './pages/auth/login.jsx';
import Register from './pages/auth/register.jsx';
import CreatePost from './pages/posts/createPost.jsx';
import Profile from './pages/profile/profile.jsx';
import EditProfile from './pages/profile/editProfile.jsx';
import Chat from './pages/chat/chat.jsx';
import AuthProvider from './context/authProvider.jsx';
import PrivateRoute from './components/privateRoute.jsx';
import EditPost from './pages/posts/editPost.jsx';
import ViewPost from './pages/posts/viewPost.jsx';
import UserSearch from './pages/users/UserSearch.jsx';
import PrivateAdminRoute from './components/privateAdminRoute.jsx';
import AdminProvider from './context/adminProvides.jsx';
import LoginAdmin from './pages/auth/LoginAdmin.jsx';
import ViewPostsAdmin from './pages/admin/viewPosts.jsx';

function App() {
  return (
    <AdminProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/post/:id' element={<ViewPost/>} />
            <Route path="/profile/:username" element={<Profile  isOwner={false}/>} />
            <Route path="/searchUsers" element={<UserSearch/>} />
            

            <Route element={<PrivateRoute />}>
              <Route path='/editPost/:id' element={<EditPost/>}></Route>
              <Route path="/chat/:username" element={<Chat/>}/>
              <Route path="/createPost" element={<CreatePost />} />
              <Route path="/profile" element={<Profile isOwner={true}/>} />
              <Route path="/editProfile" element={<EditProfile />} />
            </Route>
            
            <Route path="/admin/login" element={<LoginAdmin />} />
            
            <Route element={<PrivateAdminRoute />}>
              <Route path="/admin/dashboard" element={<h1>Dashboard</h1>}/>
              <Route path="/admin/users" element={<h1>Users</h1>}/>
              <Route path="/admin/posts" element={<ViewPostsAdmin/>}/>
              <Route path="/admin/comments" element={<h1>Comments</h1>}/>
            </Route>

          </Routes>
        </Router>
      </AuthProvider>
    </AdminProvider>
  );
}

export default App;
