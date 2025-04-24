import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    votes: {
      upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
    collection: "comments"
  }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
