import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { domain } from '../../context/domain';

const CommentForm = ({ post_id, onSuccess }) => {
  const [comment, setComment] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const textareaRef = useRef(null);
  const MAX_CHARS = 150;
  
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${domain}createComment`, 
        { post_id, comment }, 
        { withCredentials: true }
      );
      
      setComment('');
      setNotification({ message: response.data.message, type: 'success' });

      // Llama a la función para refrescar comentarios
      if (typeof onSuccess === 'function') {
        onSuccess();
      }

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error submitting the comment';
      setNotification({ message: errorMessage, type: 'error' });
    }
  };
  
  const handleTextareaChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setComment(value);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.max(40, textareaRef.current.scrollHeight)}px`;
      }
    }
  };

  useEffect(() => {
    if (comment === '' && textareaRef.current) {
      textareaRef.current.style.height = '40px';
    }
  }, [comment]);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleCancel = () => {
    setComment('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
    }
  };
  
  return (
    <div className="w-full mb-6">
      <div className="rounded-lg border border-zinc-700 flex flex-col">
        <div className="p-3">
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={handleTextareaChange}
            placeholder="Add a comment..."
            className="w-full rounded p-3 text-gray-200 min-h-[40px] resize-none focus:outline-none"
            style={{
              overflow: comment.length > 100 ? 'auto' : 'hidden'
            }}
          />
        </div>

        {notification.message && (
          <div className={`ml-3 mb-2 px-3 py-1 rounded text-sm inline-block ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="flex justify-end items-center p-2">
          <span className="text-gray-400 mr-4 text-sm">
            {comment.length}/{MAX_CHARS}
          </span>
          <div className="flex items-center space-x-2">
            <button 
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 rounded text-gray-300 hover:text-gray-100"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className={`px-4 py-1.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors ${!comment.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!comment.trim()}
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
