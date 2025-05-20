import { useState, useEffect } from "react";
import { Search, RefreshCw, Trash2, AlertTriangle, ChevronDown, ChevronUp, Grid, List } from "lucide-react";
import axios from "axios";
import { domain } from "../../context/domain";
import { useAdminAuth } from "../../context/adminContext";

function ViewCommentsAdmin() {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [deleteInProgress, setDeleteInProgress] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const { logout } = useAdminAuth();

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${domain}getAllComments`, { withCredentials: true });
      setComments(res.data.comments);
      setFilteredComments(res.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    const confirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;
    
    setDeleteInProgress(commentId);
    try {
      await axios.delete(`${domain}admin/deleteComment/${commentId}`, {
        withCredentials: true
      });
      setComments(comments.filter(comment => comment._id !== commentId));
      setFilteredComments(filteredComments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete the comment. Please try again.");
    } finally {
      setDeleteInProgress(null);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredComments(comments);
      return;
    }
    
    const filtered = comments.filter(
      comment => 
        comment.text.toLowerCase().includes(term) || 
        comment.user?.username?.toLowerCase().includes(term)
    );
    setFilteredComments(filtered);
  };

  const handleSort = (field) => {
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    
    const sorted = [...filteredComments].sort((a, b) => {
      let valueA = field === "user" ? a[field]?.username : a[field];
      let valueB = field === "user" ? b[field]?.username : b[field];
      
      if (valueA === undefined) valueA = "";
      if (valueB === undefined) valueB = "";
      
      const comparison = valueA.toString().localeCompare(valueB.toString());
      return newDirection === "asc" ? comparison : -comparison;
    });
    
    setFilteredComments(sorted);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            Comments Dashboard
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
                placeholder="Search comments by text or author..."
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
                onClick={fetchComments}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition duration-200 shadow-lg hover:shadow-blue-500/20"
              >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {["text", "user", "created_at"].map((field) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`px-4 py-2 rounded-lg flex items-center gap-1 transition duration-200 ${
                  sortField === field
                    ? "bg-blue-600 text-white"
                    : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
                }`}
              >
                {field === "created_at" ? "Date" : field.charAt(0).toUpperCase() + field.slice(1)}
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
            <p className="text-xl">Loading comments...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="bg-neutral-800/50 backdrop-blur text-white p-12 rounded-lg text-center shadow-lg border border-neutral-700">
            <p className="text-xl mb-2">
              {searchTerm ? "No comments found matching your search." : "No comments available."}
            </p>
            <p className="text-gray-400">
              {searchTerm
                ? "Try adjusting your search terms."
                : "Comments will appear here once created."}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComments.map((comment) => (
              <div
                key={comment._id}
                className="bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition duration-200 border border-neutral-700 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-white text-lg mb-3 line-clamp-3">{comment.text}</p>
                    <div className="flex items-center text-gray-400 text-sm">
                      <span className="truncate">{comment.user?.username || "Unknown"}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(comment.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    disabled={deleteInProgress === comment._id}
                    className="w-full bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition duration-200 group-hover:bg-red-600 group-hover:text-white"
                  >
                    {deleteInProgress === comment._id ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                    <span>Delete Comment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div
                key={comment._id}
                className="bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition duration-200 border border-neutral-700 overflow-hidden"
              >
                <div className="p-6 flex justify-between items-start gap-4">
                  <div className="flex-grow">
                    <p className="text-white text-lg mb-2">{comment.text}</p>
                    <div className="flex items-center text-gray-400 text-sm">
                      <span>{comment.user?.username || "Unknown"}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(comment.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    disabled={deleteInProgress === comment._id}
                    className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200"
                  >
                    {deleteInProgress === comment._id ? (
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
          {filteredComments.length > 0 && (
            <span>
              Showing {filteredComments.length} of {comments.length} comments
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewCommentsAdmin;