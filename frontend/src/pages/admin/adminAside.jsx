import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, FileText, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

function AdminAside() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard"
    },
    {
      path: "/admin/users",
      icon: <Users size={20} />,
      label: "Users"
    },
    {
      path: "/admin/posts",
      icon: <FileText size={20} />,
      label: "Posts"
    },
    {
      path: "/admin/comments",
      icon: <MessageSquare size={20} />,
      label: "Comments"
    }
  ];

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-neutral-800 border-r border-neutral-700 shadow-xl z-40 transition-transform duration-300 lg:translate-x-0 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isMobile ? 'w-[280px]' : 'w-64'} lg:block`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-8">
            Admin Panel
          </h2>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-neutral-700 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

export default AdminAside;