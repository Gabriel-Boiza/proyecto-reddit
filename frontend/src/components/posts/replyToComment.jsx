import { useState } from "react";
import axios from "axios";
import { domain } from "../../context/domain";

const ReplyToComment = ({ parentId, onSuccess, onCancel }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("[ReplyToComment] handleSubmit called");
    console.log("Parent ID:", parentId);
    console.log("Comment content:", comment);

    if (!comment.trim()) {
      console.warn("[ReplyToComment] Empty comment, not sending");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("[ReplyToComment] Sending POST request to:", `${domain}replyComment/${parentId}`);
      const response = await axios.post(`${domain}replyComment/${parentId}`, { comment });
      console.log("[ReplyToComment] Response received:", response.data);

      setComment("");
      if (onSuccess) {
        console.log("[ReplyToComment] Calling onSuccess callback");
        onSuccess();
      }
      if (onCancel) {
        console.log("[ReplyToComment] Calling onCancel callback to close form");
        onCancel();
      }
    } catch (err) {
      console.error("[ReplyToComment] Error sending reply:", err);
      setError("Error sending reply. Please try again.");
    } finally {
      setLoading(false);
      console.log("[ReplyToComment] Loading set to false");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-zinc-300"
        rows={3}
        placeholder="Write your reply..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      {error && <p className="text-red-500 mt-1">{error}</p>}
      <div className="flex justify-end mt-1 space-x-2">
        <button
          type="button"
          onClick={() => {
            console.log("[ReplyToComment] Cancel button clicked");
            onCancel && onCancel();
          }}
          className="px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-sm text-white"
        >
          {loading ? "Sending..." : "Reply"}
        </button>
      </div>
    </form>
  );
};

export default ReplyToComment;
