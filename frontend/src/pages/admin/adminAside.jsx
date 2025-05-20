import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, FileText } from 'lucide-react';

function AdminAside() {
  const location = useLocation();

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

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-neutral-800 border-r border-neutral-700 shadow-xl">
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-8">
          Admin Panel
        </h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
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
  );
}

export default AdminAside;