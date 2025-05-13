import SearchBar from './searchbar.jsx'
import GetApp from './getApp.jsx'
import { Link } from 'react-router-dom'
import { Plus } from "lucide-react";
import { useAuth } from '../context/authContext.js';

function Header() {
  const { isAuth, logout } = useAuth();

  return (
    <header className="header">
      <button id="botonDesplegableAside" className="md:hidden mt-2" aria-label="Toggle Menu">
        <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <rect y="5" width="20" height="2" rx="2" fill="gray" />
          <rect y="11" width="20" height="2" rx="2" fill="gray" />
          <rect y="17" width="20" height="2" rx="2" fill="gray" />
        </svg>
      </button>

      <Link to="/" className="header-page-title">reddix</Link>

      <SearchBar />

      <div className="flex">
        <Link to="/createPost" className="qr-button" aria-label="Create Post">
          <Plus className="w-6 h-6" /> Create
        </Link>

        <GetApp />


        {!isAuth ? (
          <Link to="/login" className="login-button">Log In</Link>
        ) : (
          <>
            <Link to="/profile" className="login-button">My Profile</Link>
            <Link to="/" onClick={() => logout()} className="login-button">Logout</Link>
          </>
        )}
        <button id="botonDesplegableUser" className="md:hidden" aria-label="User Menú">
          <img className="md:w-10 rounded-full w-16 ml-2" src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png" alt="" />
        </button>
      </div>

    </header>
  );
}

export default Header;
