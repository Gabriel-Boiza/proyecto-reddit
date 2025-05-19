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
  // Estado para tracking de operaciones asíncronas de likes/dislikes
  const [pendingLikeActions, setPendingLikeActions] = useState({});

  const { user_id } = useAuth();

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${domain}getCommentsByPost/${post_id}`);
      const commentsData = response.data.comments || [];
      
      // Función para ordenar comentarios recursivamente (más reciente primero)
      const sortCommentsRecursively = (comments) => {
        comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        // Ordenar hijos recursivamente
        comments.forEach(comment => {
          if (comment.children && comment.children.length > 0) {
            comment.children = sortCommentsRecursively([...comment.children]);
          }
        });
        
        return comments;
      };
      
      const sortedComments = sortCommentsRecursively([...commentsData]);
      setComments(sortedComments);
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

  // Función recursiva para actualizar un comentario en cualquier nivel del árbol
  const updateCommentInTree = (commentsList, commentId, updatedData) => {
    return commentsList.map(comment => {
      if (comment._id === commentId) {
        // Si updatedData es una función, la ejecutamos pasando el comentario actual
        if (typeof updatedData === 'function') {
          // Preservamos los hijos del comentario original
          const updatedComment = updatedData(comment);
          return { 
            ...comment, 
            ...updatedComment,
            // Aseguramos que los hijos se mantengan
            children: comment.children 
          };
        }
        // Si es un objeto, simplemente lo mezclamos pero conservamos los hijos
        return { 
          ...comment, 
          ...updatedData,
          children: comment.children 
        };
      }
      
      if (comment.children && comment.children.length > 0) {
        return {
          ...comment,
          children: updateCommentInTree(comment.children, commentId, updatedData)
        };
      }
      
      return comment;
    });
  };

  const submitEdit = async (commentId) => {
    if (!commentId) return;
    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `${domain}updateComment/${commentId}`,
        { text: editedText },
        { withCredentials: true }
      );

      // Actualiza el comentario en cualquier nivel del árbol
      const updatedComments = updateCommentInTree(comments, commentId, {
        text: editedText,
        edited: true
      });
      
      setComments(updatedComments);
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

      // Eliminar comentario de cualquier nivel del árbol
      const filterCommentsRecursively = (commentsList, idToRemove) => {
        return commentsList
          .filter(comment => comment._id !== idToRemove)
          .map(comment => {
            if (comment.children && comment.children.length > 0) {
              return {
                ...comment,
                children: filterCommentsRecursively(comment.children, idToRemove)
              };
            }
            return comment;
          });
      };

      setComments(filterCommentsRecursively(comments, commentId));

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

  const handleLike = async (commentId) => {
    // Evitar múltiples clics mientras se procesa una acción
    if (pendingLikeActions[commentId]) return;
    
    try {
      // Marcar esta acción como pendiente
      setPendingLikeActions(prev => ({ ...prev, [commentId]: true }));
      
      // Actualizar inmediatamente para UI optimista
      const updatedComments = updateCommentInTree([...comments], commentId, comment => {
        const userLikedIndex = comment.likedBy?.indexOf(user_id) ?? -1;
        const userDislikedIndex = comment.dislikedBy?.indexOf(user_id) ?? -1;
        
        let likedBy = [...(comment.likedBy || [])];
        let dislikedBy = [...(comment.dislikedBy || [])];
        let likes = comment.likes || 0;
        let dislikes = comment.dislikes || 0;
        
        // Si ya dio like, quitar el like
        if (userLikedIndex !== -1) {
          likedBy.splice(userLikedIndex, 1);
          likes--;
        } else {
          // Si no, añadir like
          likedBy.push(user_id);
          likes++;
          
          // Si había dado dislike antes, quitar el dislike
          if (userDislikedIndex !== -1) {
            dislikedBy.splice(userDislikedIndex, 1);
            dislikes--;
          }
        }
        
        return {
          likedBy,
          dislikedBy,
          likes,
          dislikes
        };
      });
      
      // Actualizar el estado con la versión optimista
      setComments(updatedComments);
      
      // Realizar la acción real en el servidor
      const response = await axios.put(
        `${domain}likeComment/${commentId}`, 
        {}, 
        { withCredentials: true }
      );
      
      // Actualizar con la respuesta del servidor para asegurar consistencia
      if (response.data && response.data.comment) {
        // Preservar los hijos al actualizar con los datos del servidor
        const serverUpdatedComments = updateCommentInTree([...comments], commentId, comment => {
          // Mantén los hijos del comentario original
          return { 
            ...response.data.comment,
            children: comment.children 
          };
        });
        setComments(serverUpdatedComments);
      }
      
    } catch (err) {
      console.error("Error liking comment:", err);
      // En caso de error, revertir al estado original recargando los comentarios
      fetchComments();
      
      Swal.fire({
        icon: "error",
        title: "Failed to like comment",
        text: "Please try again later.",
        background: "#1e1e1e",
        color: "#ffa500",
        confirmButtonColor: "#ffa500"
      });
    } finally {
      // Marcar la acción como completada
      setPendingLikeActions(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const handleDislike = async (commentId) => {
    // Evitar múltiples clics mientras se procesa una acción
    if (pendingLikeActions[commentId]) return;
    
    try {
      // Marcar esta acción como pendiente
      setPendingLikeActions(prev => ({ ...prev, [commentId]: true }));
      
      // Actualizar inmediatamente para UI optimista
      const updatedComments = updateCommentInTree([...comments], commentId, comment => {
        const userLikedIndex = comment.likedBy?.indexOf(user_id) ?? -1;
        const userDislikedIndex = comment.dislikedBy?.indexOf(user_id) ?? -1;
        
        let likedBy = [...(comment.likedBy || [])];
        let dislikedBy = [...(comment.dislikedBy || [])];
        let likes = comment.likes || 0;
        let dislikes = comment.dislikes || 0;
        
        // Si ya dio dislike, quitar el dislike
        if (userDislikedIndex !== -1) {
          dislikedBy.splice(userDislikedIndex, 1);
          dislikes--;
        } else {
          // Si no, añadir dislike
          dislikedBy.push(user_id);
          dislikes++;
          
          // Si había dado like antes, quitar el like
          if (userLikedIndex !== -1) {
            likedBy.splice(userLikedIndex, 1);
            likes--;
          }
        }
        
        return {
          likedBy,
          dislikedBy,
          likes,
          dislikes
        };
      });
      
      // Actualizar el estado con la versión optimista
      setComments(updatedComments);
      
      // Realizar la acción real en el servidor
      const response = await axios.put(
        `${domain}dislikeComment/${commentId}`, 
        {}, 
        { withCredentials: true }
      );
      
      // Actualizar con la respuesta del servidor para asegurar consistencia
      if (response.data && response.data.comment) {
        // Preservar los hijos al actualizar con los datos del servidor
        const serverUpdatedComments = updateCommentInTree([...comments], commentId, comment => {
          // Mantén los hijos del comentario original
          return { 
            ...response.data.comment,
            children: comment.children 
          };
        });
        setComments(serverUpdatedComments);
      }
      
    } catch (err) {
      console.error("Error disliking comment:", err);
      // En caso de error, revertir al estado original recargando los comentarios
      fetchComments();
      
      Swal.fire({
        icon: "error",
        title: "Failed to dislike comment",
        text: "Please try again later.",
        background: "#1e1e1e",
        color: "#ffa500",
        confirmButtonColor: "#ffa500"
      });
    } finally {
      // Marcar la acción como completada
      setPendingLikeActions(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const renderComments = (commentsList, isChild = false) => {
    if (!commentsList || commentsList.length === 0) return null;
    
    return commentsList.map((comment) => {
      // Check if the current user has liked/disliked this comment
      const userHasLiked = comment.likedBy?.includes(user_id);
      const userHasDisliked = comment.dislikedBy?.includes(user_id);
      const isLikeActionPending = pendingLikeActions[comment._id];
      
      return (
        <div key={comment._id} className={`${isChild ? 'bg-zinc-800' : 'bg-zinc-900'} rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-colors ${isChild ? 'mt-3' : ''}`}>
          <div className="flex items-start">
            <img 
              src={comment.user?.profileImage
                ? `${domain}uploads/${comment.user.profileImage}`
                : "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png"}
              alt={`Avatar of ${comment.user?.username || 'User'}`} 
              className={`${isChild ? 'w-8 h-8' : 'w-10 h-10'} rounded-full mr-3 flex-shrink-0`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <Link to={`/profile/${comment.user?.username ?? ""}`} className="hover:underline font-medium text-zinc-200">
                  {comment.user?._id === user_id ? "You" : comment.user?.username}
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
                <button 
                  onClick={() => handleLike(comment._id)} 
                  disabled={isLikeActionPending}
                  className={`flex items-center hover:text-orange-400 transition mr-4 ${userHasLiked ? 'text-orange-400 font-medium' : ''} ${isLikeActionPending ? 'opacity-50' : ''}`}
                >
                  {/* SVG DIRECTAMENTE PARA THUMBS UP */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    className="mr-1"
                    fill={userHasLiked ? "currentColor" : "none"}
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                  <span>{comment.likes || 0}</span>
                </button>

                <button 
                  onClick={() => handleDislike(comment._id)} 
                  disabled={isLikeActionPending}
                  className={`flex items-center hover:text-orange-300 transition mr-4 ${userHasDisliked ? 'text-orange-300 font-medium' : ''} ${isLikeActionPending ? 'opacity-50' : ''}`}
                >
                  {/* SVG DIRECTAMENTE PARA THUMBS DOWN */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    className="mr-1"
                    fill={userHasDisliked ? "currentColor" : "none"}
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M17 14V2" />
                    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                  </svg>
                  <span>{comment.dislikes || 0}</span>
                </button>

                {/* Only show reply button for top-level comments (not for replies/children) */}
                {!isChild && editingComment !== comment._id && (
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
              
              {/* Render child comments if they exist */}
              {comment.children && comment.children.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-zinc-700 space-y-4">
                  {renderComments(comment.children, true)}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });
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
          <MessageCircle size={28} className="mx-auto mb-2 text-zinc-500" />
          <p className="text-zinc-500">No comments yet. Be the first to comment!</p>
        </div>
      )}

      <div className="space-y-4 mt-4">
        {renderComments(comments.filter(comment => !comment.parent))}
      </div>
    </div>
  );
};

export default Comment;