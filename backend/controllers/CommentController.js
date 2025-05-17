import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const createComment = async (req, res) => {
  const { post_id, comment } = req.body;
  const user_id = req.user.id;

  try {
    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const submitedComment = await Comment.create({ text: comment, user: user_id });

    post.comments.push(submitedComment._id);
    user.comments.push(submitedComment._id);

    await post.save();
    await user.save();

    res.status(201).json({ message: "Comment successfully posted!", comment: submitedComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCommentsByPost = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de post inválido" });
    }

    const post = await Post.findById(id)
      .populate({
        path: 'comments',
        populate: [
          { path: 'user' },
          { path: 'children', populate: { path: 'user' } }
        ]
      });

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    res.status(200).json({ comments: post.comments || [] });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ message: 'Error al obtener los comentarios' });
  }
};

export const replyToComment = async (req, res) => {
  const parentId = req.params.parentId;
  const { comment } = req.body;
  const user_id = req.user.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ message: "ID de comentario inválido" });
    }

    const parentComment = await Comment.findById(parentId);
    if (!parentComment) return res.status(404).json({ message: "Comentario padre no encontrado" });

    const reply = await Comment.create({ text: comment, user: user_id });

    parentComment.children.push(reply._id);
    await parentComment.save();

    const populatedReply = await Comment.findById(reply._id).populate('user');

    res.status(201).json({ message: "Respuesta añadida correctamente", reply: populatedReply });
  } catch (error) {
    console.error("Error replying to comment:", error);
    res.status(500).json({ message: "Error al responder comentario" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { text } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "ID de comentario inválido" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    comment.text = text;
    comment.edited = true;
    await comment.save();


    res.status(200).json({ message: "Comment updated", comment });
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "ID de comentario inválido" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await Post.updateMany({}, { $pull: { comments: commentId } });
    await User.updateMany({}, { $pull: { comments: commentId } });

    await Comment.updateMany({}, { $pull: { children: commentId } });

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
