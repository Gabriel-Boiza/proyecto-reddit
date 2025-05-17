import { useState } from "react";
import axios from "axios";
import { domain } from "../../context/domain";
import { useAuth } from "../../context/authContext";
import Swal from "sweetalert2";

const ReplyForm = ({ post_id, parent_id, onSuccess }) => {
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user_id } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await axios.post(
        `${domain}createComment`,
        {
          text: replyText,
          post_id: post_id,
          parent_id: parent_id
        },
        { withCredentials: true }
      );
      
      setReplyText("");
      
      Swal.fire({
        icon: "success",
        title: "Reply posted",
        toast: true,
        timer: 2000,
        position: "top-end",
        showConfirmButton: false,
        background: "#1e1e1e",
        color: "#ffa500"
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      
      Swal.fire({
        icon: "error",
        title: "Failed to post reply",
        text: "Please try again later.",
        background: "#1e1e1e",
        color: "#ffa500",
        confirmButtonColor: "#ffa500"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Add a reply..."
        className="w-full p-3 bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
        rows={2}
        disabled={isSubmitting || !user_id}
      ></textarea>
      
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={isSubmitting || !replyText.trim() || !user_id}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            isSubmitting || !replyText.trim() || !user_id 
              ? "bg-zinc-700 text-zinc-400 cursor-not-allowed" 
              : "bg-orange-600 hover:bg-orange-700 text-white"
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2 align-middle"></span>
              <span>Posting...</span>
            </>
          ) : (
            "Post Reply"
          )}
        </button>
      </div>
      
      {!user_id && (
        <p className="text-zinc-500 text-xs mt-1 text-center">
          You need to be logged in to reply.
        </p>
      )}
    </form>
  );
};

export default ReplyForm;