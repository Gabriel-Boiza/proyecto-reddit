import { useState, useEffect } from "react";
import { Search, RefreshCw, Trash2, AlertTriangle, ChevronDown, ChevronUp, Grid, List, UserCircle } from "lucide-react";
import axios from "axios";
import { domain } from "../../context/domain";
import { useAdminAuth } from "../../context/adminContext";

function ViewUsersAdmin() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("username");
  const [sortDirection, setSortDirection] = useState("asc");
  const [deleteInProgress, setDeleteInProgress] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const { logout } = useAdminAuth();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${domain}getAllUsers`, { withCredentials: true });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
    if (!confirmed) return;
    
    setDeleteInProgress(userId);
    try {
      await axios.delete(`${domain}deleteAccount`, {
        data: { user_id: userId },
        withCredentials: true
      });
      setUsers(users.filter(user => user._id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete the user. Please try again.");
    } finally {
      setDeleteInProgress(null);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(
      user => 
        user.username?.toLowerCase().includes(term) || 
        user.name?.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const handleSort = (field) => {
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    
    const sorted = [...filteredUsers].sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];
      
      if (valueA === undefined) valueA = "";
      if (valueB === undefined) valueB = "";
      
      if (field === "followers" || field === "following") {
        valueA = a[field]?.length || 0;
        valueB = b[field]?.length || 0;
        return newDirection === "asc" ? valueA - valueB : valueB - valueA;
      }
      
      const comparison = String(valueA).localeCompare(String(valueB));
      return newDirection === "asc" ? comparison : -comparison;
    });
    
    setFilteredUsers(sorted);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Users Dashboard
          </h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition duration-200 shadow-lg hover:shadow-red-500/20"
          >
            Logout
          </button>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search users by username or name..."
                className="bg-neutral-800 text-white w-full pl-12 pr-4 py-3 rounded-lg border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition duration-200"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition duration-200 shadow-lg"
                title="Toggle view mode"
              >
                {viewMode === "grid" ? <List size={20} /> : <Grid size={20} />}
              </button>
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition duration-200 shadow-lg hover:shadow-blue-500/20"
              >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {["username", "name", "followers", "following"].map((field) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`px-4 py-2 rounded-lg flex items-center gap-1 transition duration-200 ${
                  sortField === field
                    ? "bg-blue-600 text-white"
                    : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
                }`}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                <SortIcon field={field} />
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-white p-4 rounded-lg mb-6 flex items-center gap-3 shadow-lg">
            <AlertTriangle size={24} className="text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
            <RefreshCw size={48} className="animate-spin mb-4 text-blue-500" />
            <p className="text-xl">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-neutral-800/50 backdrop-blur text-white p-12 rounded-lg text-center shadow-lg border border-neutral-700">
            <p className="text-xl mb-2">
              {searchTerm ? "No users found matching your search." : "No users available."}
            </p>
            <p className="text-gray-400">
              {searchTerm ? "Try adjusting your search terms." : "Users will appear here once registered."}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition duration-200 border border-neutral-700 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-700 flex items-center justify-center">
                      {user.profileImage ? (
                        <img 
                          src={`${domain}${user.profileImage}`} 
                          alt={user.username} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCircle size={40} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{user.username}</h3>
                      <p className="text-gray-400">{user.name || "No name set"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-2 rounded-lg bg-neutral-700/50">
                      <p className="text-sm text-gray-400">Followers</p>
                      <p className="text-lg text-white font-semibold">{user.followers?.length || 0}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-neutral-700/50">
                      <p className="text-sm text-gray-400">Following</p>
                      <p className="text-lg text-white font-semibold">{user.following?.length || 0}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(user._id)}
                    disabled={deleteInProgress === user._id}
                    className="w-full bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition duration-200 group-hover:bg-red-600 group-hover:text-white"
                  >
                    {deleteInProgress === user._id ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                    <span>Delete User</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition duration-200 border border-neutral-700 overflow-hidden"
              >
                <div className="p-6 flex justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-700 flex items-center justify-center">
                      {user.profileImage ? (
                        <img 
                          src={`${domain}${user.profileImage}`} 
                          alt={user.username} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCircle size={30} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{user.username}</h3>
                      <p className="text-gray-400 text-sm">{user.name || "No name set"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden md:block">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-400">Followers</p>
                          <p className="text-white font-semibold">{user.followers?.length || 0}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-400">Following</p>
                          <p className="text-white font-semibold">{user.following?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={deleteInProgress === user._id}
                      className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200"
                    >
                      {deleteInProgress === user._id ? (
                        <RefreshCw size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-gray-400 text-sm text-right">
          {filteredUsers.length > 0 && (
            <span>
              Showing {filteredUsers.length} of {users.length} users
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewUsersAdmin;