import { useState, useEffect } from "react";
import axios from "axios";
import { MessageCircle, ThumbsUp, ThumbsDown, Clock, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import CommentForm from "./createComment";
import { domain } from "../../context/domain";
import { useAuth } from "../../context/authContext";

const Comment = ({ post_id, refresh }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeReply, setActiveReply] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user_id } = useAuth();

  const fetchComments = async () => {
  try {
    setIsLoading(true);
    const response = await axios.get(`${domain}getCommentsByPost/${post_id}`);
    const commentsData = response.data.comments || [];
    commentsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setComments(commentsData);
    setError(null);
  } catch (err) {
    console.error("Error loading comments:", err);
    setError("Failed to load comments. Please try again later.");
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    fetchComments();
  }, [post_id, refresh]);

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "just now";
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60));

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `about ${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'}`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `about ${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'}`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `about ${diffInDays} ${diffInDays === 1 ? 'day' : 'days'}`;
  };

  const handleEdit = (comment) => {
    setEditingComment(comment._id);
    setEditedText(comment.text);
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditedText("");
  };

  const submitEdit = async (commentId) => {
    if (!commentId) return;
    setIsSubmitting(true);

    try {
      await axios.put(
        `${domain}updateComment/${commentId}`,
        { text: editedText },
        { withCredentials: true }
      );

      setComments(comments.map(comment =>
        comment._id === commentId ? { ...comment, text: editedText, edited: true } : comment
      ));
      setEditingComment(null);
      setEditedText("");

      Swal.fire({
        icon: "success",
        title: "Comment updated",
        toast: true,
        timer: 2000,
        position: "top-end",
        showConfirmButton: false,
        background: "#1e1e1e",
        color: "#ffa500"
      });
    } catch (error) {
      console.error("Error updating comment:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to update comment",
        text: "Please try again later.",
        background: "#1e1e1e",
        color: "#ffa500",
        confirmButtonColor: "#ffa500"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This comment will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ffa500",
      cancelButtonColor: "#555",
      confirmButtonText: "Yes, delete it!",
      background: "#1e1e1e",
      color: "#ffa500"
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${domain}deleteComment/${commentId}`, { withCredentials: true });

      setComments(comments.filter(comment => comment._id !== commentId));

      Swal.fire({
        icon: "success",
        title: "Comment deleted",
        toast: true,
        timer: 2000,
        position: "top-end",
        showConfirmButton: false,
        background: "#1e1e1e",
        color: "#ffa500"
      });
    } catch (err) {
      console.error("Error deleting comment:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to delete comment",
        text: "Please try again later.",
        background: "#1e1e1e",
        color: "#ffa500",
        confirmButtonColor: "#ffa500"
      });
    }
  };

  const renderComments = (commentsList) => {
    return commentsList.map((comment) => (
      <div key={comment._id} className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-colors">
        <div className="flex items-start">
          <img 
            src={comment.user?.profileImage
              ? `${domain}uploads/${comment.user.profileImage}`
              : "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png"}
            alt={`Avatar of ${comment.user?.username || 'User'}`} 
            className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <Link to={`/profile/${comment.user?.username ?? ""}`} className="hover:underline font-medium text-zinc-200">
                {comment.user?._id === user_id ? "Tú" : comment.user?.username}
              </Link>
              <div className="flex items-center text-xs text-zinc-500">
                <Clock size={12} className="mr-1" />
                <span>
                  {formatRelativeTime(comment.created_at)}{comment.edited ? " (edited)" : ""}
                </span>
              </div>
            </div>

            {editingComment === comment._id ? (
              <div className="mt-2">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-2 bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                  rows={3}
                  disabled={isSubmitting}
                ></textarea>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => submitEdit(comment._id)}
                    disabled={isSubmitting}
                    className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm"
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={isSubmitting}
                    className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-zinc-300 break-words whitespace-pre-wrap">{comment.text}</p>
            )}

            <div className="flex items-center mt-3 text-zinc-500 text-sm">
              <button className="flex items-center hover:text-orange-400 transition mr-4">
                <ThumbsUp size={14} className="mr-1" />
                <span>{comment.likes || 0}</span>
              </button>
              <button className="flex items-center hover:text-orange-300 transition mr-4">
                <ThumbsDown size={14} className="mr-1" />
                <span>{comment.dislikes || 0}</span>
              </button>

              {editingComment !== comment._id && (
                <button 
                  onClick={() => setActiveReply(activeReply === comment._id ? null : comment._id)}
                  className="hover:text-zinc-300 transition mr-4"
                >
                  {activeReply === comment._id ? "Cancel" : "Reply"}
                </button>
              )}

              {comment.user?._id === user_id && editingComment !== comment._id && (
                <>
                  <button 
                    onClick={() => handleEdit(comment)}
                    className="flex items-center hover:text-yellow-400 transition mr-4"
                  >
                    <Edit size={14} className="mr-1" />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(comment._id)}
                    className="flex items-center hover:text-red-500 transition"
                  >
                    <Trash2 size={14} className="mr-1" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>

            {activeReply === comment._id && (
              <div className="mt-3 pl-4 border-l-2 border-zinc-700">
                <CommentForm 
                  post_id={post_id} 
                  parent_id={comment._id}
                  onSuccess={() => {
                    fetchComments();
                    setActiveReply(null);
                  }} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-4 text-zinc-400">
        <MessageCircle size={18} className="mr-2" />
        <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
      </div>

      <CommentForm post_id={post_id} onSuccess={fetchComments} />

      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
          <p className="mt-2 text-zinc-400">Loading comments...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-red-900/30 border border-red-700 p-4 rounded-md text-center mb-4">
          <p className="text-red-300">{error}</p>
          <button 
            onClick={fetchComments}
            className="mt-2 text-orange-400 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && comments.length === 0 && (
        <div className="text-center py-6 border border-dashed border-zinc-700 rounded-lg">
          <Message Circle size={28} className="mx-auto mb-2 text-zinc-500" />
          <p className="text-zinc-500">No comments yet. Be the first to comment!</p>
        </div>
      )}
      <div className="space-y-4 mt-4">
    {renderComments(comments)}
  </div>
</div>
);
};

export default Comment;
