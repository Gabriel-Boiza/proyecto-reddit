import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    edited: { type: Boolean, default: false }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "comments"
  }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;