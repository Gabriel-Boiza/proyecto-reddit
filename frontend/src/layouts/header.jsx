import SearchBar from './searchbar.jsx'
import GetApp from './getApp.jsx'
import { Link } from 'react-router-dom'
import { Plus } from "lucide-react";
import { useAuth } from '../context/authContext.js';
import { useState, useEffect, useRef } from 'react';

function Header() {
  const { isAuth, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      <div className="flex items-center">
        {/* Desktop buttons */}
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

        {/* Mobile menu button */}
        <div className="relative md:hidden" ref={menuRef}>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center ml-2"
          >
            <img 
              className="w-10 h-10 rounded-full" 
              src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png" 
              alt="" 
            />
          </button>

          {/* Mobile menu dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#14181a] ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <Link 
                  to="/createPost" 
                  className="block px-4 py-2 text-sm text-white hover:bg-[#1c2224]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Post
                  </div>
                </Link>
                {isAuth ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-white hover:bg-[#1c2224]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link 
                      to="/" 
                      className="block px-4 py-2 text-sm text-white hover:bg-[#1c2224]"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="block px-4 py-2 text-sm text-white hover:bg-[#1c2224]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
