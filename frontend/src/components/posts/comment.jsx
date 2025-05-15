import { useState, useEffect } from "react";
import axios from "axios";
import { domain } from "../../context/domain";
import { MessageCircle, ThumbsUp, ThumbsDown, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import ReplyToComment from "./replyToComment"; // Importamos el nuevo componente

const Comment = ({ post_id, refresh }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeReply, setActiveReply] = useState(null);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${domain}getCommentsByPost/${post_id}`);
      setComments(response.data.comments || []);
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

  // Función recursiva para mostrar comentarios y sus hijos (reply en árbol)
  const renderComments = (commentsList) => {
    return commentsList.map((comment) => (
      <div key={comment._id} className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-colors">
        <div className="flex items-start">
          <img 
            src={comment.user?.avatar || "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png"} 
            alt={`Avatar of ${comment.user?.name || 'User'}`} 
            className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <Link to={`/profile/${comment.user?.username ?? ""}`} className="hover:underline font-medium text-zinc-200">
                {comment.user?.username || "Anon"}
              </Link>
              <div className="flex items-center text-xs text-zinc-500">
                <Clock size={12} className="mr-1" />
                <span>{formatRelativeTime(comment.created_at)}</span>
              </div>
            </div>
            <p className="text-zinc-300 break-words whitespace-pre-wrap">{comment.text}</p>

            {/* Comment actions */}
            <div className="flex items-center mt-3 text-zinc-500 text-sm">
              <button className="flex items-center hover:text-blue-400 transition mr-4">
                <ThumbsUp size={14} className="mr-1" />
                <span>{comment.likes || 0}</span>
              </button>
              <button className="flex items-center hover:text-red-400 transition mr-4">
                <ThumbsDown size={14} className="mr-1" />
                <span>{comment.dislikes || 0}</span>
              </button>
              <button 
                onClick={() => setActiveReply(activeReply === comment._id ? null : comment._id)}
                className="hover:text-zinc-300 transition"
              >
                {activeReply === comment._id ? "Cancel" : "Reply"}
              </button>
            </div>

            {/* Reply form */}
            {activeReply === comment._id && (
              <ReplyToComment 
                parentId={comment._id} 
                onSuccess={fetchComments} 
                onCancel={() => setActiveReply(null)} 
              />
            )}

            {/* Render children recursively */}
            {comment.children && comment.children.length > 0 && (
              <div className="ml-10 mt-4 space-y-4 border-l border-zinc-700 pl-4">
                {renderComments(comment.children)}
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full">
      {/* Comment counter */}
      <div className="flex items-center mb-4 text-zinc-400">
        <MessageCircle size={18} className="mr-2" />
        <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-zinc-400">Loading comments...</p>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="bg-red-900/30 border border-red-700 p-4 rounded-md text-center mb-4">
          <p className="text-red-300">{error}</p>
          <button 
            onClick={fetchComments}
            className="mt-2 text-blue-400 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* No comments */}
      {!isLoading && !error && comments.length === 0 && (
        <div className="text-center py-6 border border-dashed border-zinc-700 rounded-lg">
          <MessageCircle size={24} className="mx-auto text-zinc-500 mb-2" />
          <p className="text-zinc-400">No comments yet. Be the first to comment!</p>
        </div>
      )}

      {/* Comments */}
      <div className="space-y-4">
        {renderComments(comments)}
      </div>
    </div>
  );
};

export default Comment;
