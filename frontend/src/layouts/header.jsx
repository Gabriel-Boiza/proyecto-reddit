import SearchBar from './searchbar.jsx'
import { Link } from 'react-router-dom'
import { Plus } from "lucide-react";
import { useAuth } from '../context/authContext.js';

function Header() {
  const { isAuth, logout } = useAuth();

  return (
    <header className="header">
      <button id="botonDesplegableAside" className="md:hidden" aria-label="Toggle Menu">
        <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <rect y="5" width="20" height="2" rx="2" fill="gray" />
          <rect y="11" width="20" height="2" rx="2" fill="gray" />
          <rect y="17" width="20" height="2" rx="2" fill="gray" />
        </svg>
      </button>

      <Link to="/" className="header-page-title">reddix</Link>

      <SearchBar />

      <div className="flex">
        {isAuth && (
          <Link to="/createPost" className="qr-button" aria-label="Create Post">
            <Plus className="w-6 h-6" /> Create
          </Link>
        )}

        <button className="qr-button" aria-label="Get App">
          <svg fill="currentColor" height="20" width="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.8 16h-3.7v-1.2h3.7v-3.7H16v3.7c0 .7-.5 1.2-1.2 1.2ZM9 7.8V5.2C9 4.5 8.5 4 7.8 4H5.2C4.5 4 4 4.5 4 5.2v2.5C4 8.5 4.5 9 5.2 9h2.5C8.5 9 9 8.5 9 7.8Zm-1.2 0H5.3V5.3h2.5v2.5Zm8.2 0V5.2c0-.7-.5-1.2-1.2-1.2h-2.5c-.8 0-1.3.5-1.3 1.2v2.5c0 .8.5 1.3 1.2 1.3h2.5c.8 0 1.3-.5 1.3-1.2Zm-1.2 0h-2.5V5.3h2.5v2.5Zm-5.8 7v-2.5c0-.8-.5-1.3-1.2-1.3H5.2c-.7 0-1.2.5-1.2 1.2v2.5c0 .8.5 1.3 1.2 1.3h2.5c.8 0 1.3-.5 1.3-1.2Zm-1.2 0H5.3v-2.5h2.5v2.5Zm-.8 3H2.6c-.2 0-.4-.2-.4-.4V13H1v4.4c0 .9.7 1.6 1.6 1.6H7v-1.2Zm12-.4V13h-1.2v4.4c0 .2-.2.4-.4.4H13V19h4.4c.9 0 1.6-.7 1.6-1.6Zm0-14.8c0-.9-.7-1.6-1.6-1.6H13v1.2h4.4c.2 0 .4.2.4.4V7H19V2.6Zm-16.8 0c0-.2.2-.4.4-.4H7V1H2.6C1.7 1 1 1.7 1 2.6V7h1.2V2.6Z"></path>
          </svg>
          Get App
        </button>

        {!isAuth ? (
          <Link to="/login" className="login-button">Log In</Link>
        ) : (
          <>
            <Link to="/profile" className="login-button">My Profile</Link>
            <Link to="/" onClick={() => logout()} className="login-button">Logout</Link>
          </>
        )}

        <button id="BotonDesplegableUsuario" className="px-2 hover:bg-[#333d42] rounded-full" aria-label="User Menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="2" fill="white" />
            <circle cx="12" cy="12" r="2" fill="white" />
            <circle cx="19" cy="12" r="2" fill="white" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header;
