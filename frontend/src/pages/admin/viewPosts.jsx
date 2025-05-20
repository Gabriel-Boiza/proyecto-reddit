import { useEffect, useState } from "react";
import { Search, Trash2, RefreshCw, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { domain } from "../../context/domain";
import { useAdminAuth } from "../../context/adminContext";

function ViewPostsAdmin() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [deleteInProgress, setDeleteInProgress] = useState(null);
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Posts Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200"
        >
          Logout
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search posts by title or author..."
            className="bg-neutral-700 text-white w-full pl-10 pr-4 py-2 rounded border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={fetchPosts}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50 transition duration-200"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-white p-4 rounded mb-6 flex items-center gap-3">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin mx-auto mb-4">
            <RefreshCw size={32} className="text-blue-500" />
          </div>
          <p className="text-white">Loading posts...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-neutral-800 text-white p-8 rounded text-center">
          <p className="text-xl">
            {searchTerm ? "No posts found matching your search." : "No posts available."}
          </p>
        </div>
      ) : (
        <div className="bg-neutral-800 rounded shadow overflow-hidden">
          <table className="w-full text-white">
            <thead>
              <tr className="bg-neutral-700">
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:bg-neutral-600 transition"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-1">
                    Title <SortIcon field="title" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:bg-neutral-600 transition hidden md:table-cell"
                  onClick={() => handleSort("user")}
                >
                  <div className="flex items-center gap-1">
                    Author <SortIcon field="user" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:bg-neutral-600 transition hidden md:table-cell"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1">
                    Date <SortIcon field="createdAt" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post._id} className="border-t border-neutral-700 hover:bg-neutral-700/50 transition">
                  <td className="px-4 py-3">
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-gray-400 md:hidden">
                      by {post.user?.username || "Unknown"}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">{post.user?.username || "Unknown"}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{formatDate(post.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(post._id)}
                      disabled={deleteInProgress === post._id}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center gap-1 ml-auto transition duration-200 disabled:opacity-50"
                    >
                      {deleteInProgress === post._id ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 text-gray-400 text-sm text-right">
        {filteredPosts.length > 0 && (
          <span>
            Showing {filteredPosts.length} of {posts.length} posts
          </span>
        )}
      </div>
    </div>
  );
}

export default ViewPostsAdmin;