import { useState, useEffect } from "react";
import { Users, MessageSquare, FileText, TrendingUp } from "lucide-react";
import axios from "axios";
import { domain } from "../../context/domain";
import { useAdminAuth } from "../../context/adminContext";
import AdminAside from "./adminAside";

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    comments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAdminAuth();

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch users count
      const usersRes = await axios.get(`${domain}getAllUsers`, { withCredentials: true });
      // Fetch posts count
      const postsRes = await axios.get(`${domain}getAllPosts`, { withCredentials: true });
      // Fetch comments count
      const commentsRes = await axios.get(`${domain}getAllComments`, { withCredentials: true });

      setStats({
        users: usersRes.data.length,
        posts: postsRes.data.length,
        comments: commentsRes.data.comments.length
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{loading ? "..." : value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900">
      <AdminAside />
      <div className="lg:pl-64">
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent pl-12 lg:pl-0">
                Dashboard
              </h1>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-lg transition duration-200 shadow-lg hover:shadow-red-500/20"
              >
                Logout
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <StatCard
                title="Total Users"
                value={stats.users}
                icon={Users}
                color="bg-blue-600"
              />
              <StatCard
                title="Total Posts"
                value={stats.posts}
                icon={FileText}
                color="bg-green-600"
              />
              <StatCard
                title="Total Comments"
                value={stats.comments}
                icon={MessageSquare}
                color="bg-purple-600"
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-white p-4 rounded-lg mb-6 flex items-center gap-3">
                <TrendingUp size={24} className="text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Aquí puedes agregar más secciones del dashboard como gráficos o tablas */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
