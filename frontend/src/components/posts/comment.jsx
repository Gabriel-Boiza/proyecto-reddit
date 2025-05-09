import { useState, useEffect } from "react";
import axios from "axios";
import { domain } from "../../context/domain";
import { MessageCircle, ThumbsUp, ThumbsDown, Clock } from "lucide-react";

const Comment = ({ post_id }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${domain}getCommentsByPost/${post_id}`);
      setComments(response.data.comments || []);
      setError(null);
    } catch (err) {
      console.error("Error al cargar comentarios:", err);
      setError("No se pudieron cargar los comentarios. Intenta de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post_id]);

  // Función para formatear la fecha relativa
  const formatRelativeTime = (timestamp) => {
    // Implementación básica para demostración
    // En producción, usar una librería como date-fns o dayjs
    if (!timestamp) return "hace un momento";
    
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "justo ahora";
    if (diffInMinutes < 60) return `hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Contador de comentarios */}
      <div className="flex items-center mb-4 text-zinc-400">
        <MessageCircle size={18} className="mr-2" />
        <span>{comments.length} {comments.length === 1 ? 'comentario' : 'comentarios'}</span>
      </div>
      
      {/* Estado de carga */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-zinc-400">Cargando comentarios...</p>
        </div>
      )}
      
      {/* Mensaje de error */}
      {error && !isLoading && (
        <div className="bg-red-900/30 border border-red-700 p-4 rounded-md text-center mb-4">
          <p className="text-red-300">{error}</p>
          <button 
            onClick={fetchComments}
            className="mt-2 text-blue-400 hover:underline"
          >
            Intentar de nuevo
          </button>
        </div>
      )}

      {/* Lista de comentarios */}
      {!isLoading && !error && comments.length === 0 && (
        <div className="text-center py-6 border border-dashed border-zinc-700 rounded-lg">
          <MessageCircle size={24} className="mx-auto text-zinc-500 mb-2" />
          <p className="text-zinc-400">No hay comentarios aún. ¡Sé el primero en comentar!</p>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div 
            key={comment._id} 
            className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start">
              <img 
                src={comment.user?.avatar || "/api/placeholder/40/40"} 
                alt={`Avatar de ${comment.user?.name || 'Usuario'}`} 
                className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-zinc-200">
                    {comment.user?.name || "Usuario"}
                  </h4>
                  <div className="flex items-center text-xs text-zinc-500">
                    <Clock size={12} className="mr-1" />
                    <span>{formatRelativeTime(comment.createdAt)}</span>
                  </div>
                </div>
                <p className="text-zinc-300 break-words whitespace-pre-wrap">{comment.text}</p>
                
                {/* Acciones del comentario */}
                <div className="flex items-center mt-3 text-zinc-500 text-sm">
                  <button className="flex items-center hover:text-blue-400 transition mr-4">
                    <ThumbsUp size={14} className="mr-1" />
                    <span>{comment.likes || 0}</span>
                  </button>
                  <button className="flex items-center hover:text-red-400 transition mr-4">
                    <ThumbsDown size={14} className="mr-1" />
                    <span>{comment.dislikes || 0}</span>
                  </button>
                  <button className="hover:text-zinc-300 transition">
                    Responder
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;