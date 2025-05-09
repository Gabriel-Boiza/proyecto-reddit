import { useState } from 'react';
import { Send } from 'lucide-react';

const CommentForm = () => {
  const [comment, setComment] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for your logic
    console.log('Comment submitted:', comment);
    setComment('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">

        <form 
        onSubmit={handleSubmit}
        className="rounded-lg flex items-center border border-white"
        >
        <button 
          type="button"
          className="mr-2 p-2 text-gray-400 hover:text-gray-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        
        <div className="flex-1 relative">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-none focus:ring-0 outline-none text-white resize-none py-2 px-1 h-10 max-h-40"
            style={{ minHeight: '40px' }}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            type="button" 
            className="px-3 py-1.5 rounded text-gray-300 hover:text-gray-100"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={`px-4 py-1.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors ${!comment.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!comment.trim()}
          >
            Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;