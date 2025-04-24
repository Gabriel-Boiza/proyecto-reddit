import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    creator_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    categories: [{ type: String }]
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
    collection: "communities"
  }
);

const Community = mongoose.model("Community", communitySchema);
export default Community;
