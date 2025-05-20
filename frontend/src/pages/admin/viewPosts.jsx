import { useEffect, useState } from "react";
import { Search, Trash2, RefreshCw, AlertTriangle, ChevronDown, ChevronUp, Grid, List } from "lucide-react";
import axios from "axios";
import { domain } from "../../context/domain";
import { useAdminAuth } from "../../context/adminContext";
import AdminAside from "./adminAside";

function ViewPostsAdmin() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [deleteInProgress, setDeleteInProgress] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const { logout } = useAdminAuth();

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${domain}getAllPosts`, { withCredentials: true });
      setPosts(res.data);
      setFilteredPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;
    
    setDeleteInProgress(postId);
    try {
        await axios.delete(`${domain}deletePost`, {
          data: { post_id: postId },
          withCredentials: true,
        });
      setPosts(posts.filter((post) => post._id !== postId));
      setFilteredPosts(filteredPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete the post. Please try again.");
    } finally {
      setDeleteInProgress(null);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredPosts(posts);
      return;
    }
    
    const filtered = posts.filter(
      post => 
        post.title.toLowerCase().includes(term) || 
        post.user?.username?.toLowerCase().includes(term)
    );
    setFilteredPosts(filtered);
  };

  const handleSort = (field) => {
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    
    const sorted = [...filteredPosts].sort((a, b) => {
      let valueA, valueB;
      
      if (field === "user") {
        valueA = a.user?.username || "";
        valueB = b.user?.username || "";
      } else {
        valueA = a[field];
        valueB = b[field];
      }
      
      if (typeof valueA === 'string') {
        return newDirection === "asc" 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      return newDirection === "asc" ? valueA - valueB : valueB - valueA;
    });
    
    setFilteredPosts(sorted);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      <AdminAside />
      <div className="pl-64">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Posts Dashboard
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
                    placeholder="Search posts by title or author..."
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
                    onClick={fetchPosts}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition duration-200 shadow-lg hover:shadow-blue-500/20"
                  >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {["title", "user", "createdAt"].map((field) => (
                  <button
                    key={field}
                    onClick={() => handleSort(field)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-1 transition duration-200 ${
                      sortField === field
                        ? "bg-blue-600 text-white"
                        : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
                    }`}
                  >
                    {field === "createdAt" ? "Date" : field.charAt(0).toUpperCase() + field.slice(1)}
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
                <p className="text-xl">Loading posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="bg-neutral-800/50 backdrop-blur text-white p-12 rounded-lg text-center shadow-lg border border-neutral-700">
                <p className="text-xl mb-2">
                  {searchTerm ? "No posts found matching your search." : "No posts available."}
                </p>
                <p className="text-gray-400">
                  {searchTerm ? "Try adjusting your search terms." : "Posts will appear here once created."}
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition duration-200 border border-neutral-700 overflow-hidden group"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">{post.title}</h3>
                      <div className="flex items-center text-gray-400 text-sm mb-4">
                        <span className="truncate">{post.user?.username || "Unknown"}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(post._id)}
                        disabled={deleteInProgress === post._id}
                        className="w-full bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition duration-200 group-hover:bg-red-600 group-hover:text-white"
                      >
                        {deleteInProgress === post._id ? (
                          <RefreshCw size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                        <span>Delete Post</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition duration-200 border border-neutral-700 overflow-hidden"
                  >
                    <div className="p-6 flex justify-between items-start gap-4">
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
                        <div className="flex items-center text-gray-400 text-sm">
                          <span>{post.user?.username || "Unknown"}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(post._id)}
                        disabled={deleteInProgress === post._id}
                        className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200"
                      >
                        {deleteInProgress === post._id ? (
                          <RefreshCw size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-gray-400 text-sm text-right">
              {filteredPosts.length > 0 && (
                <span>
                  Showing {filteredPosts.length} of {posts.length} posts
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPostsAdmin;