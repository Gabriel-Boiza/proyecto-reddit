import Comment from "../models/Comment.js"
import Post from "../models/Post.js"
import User from "../models/User.js"

export const createComment = async (req, res) => {
    const {post_id, comment} = req.body
    const user_id = req.user.id
    
    try {

        let post = await Post.findById(post_id)
        if(!post){throw new Error("Post not found")}
        let user = await User.findById(user_id)
        if(!user){throw new Error("User not found")}

        
        const submitedComment = await Comment.create({
            text: comment
        })

        post.comments.push(submitedComment._id)
        user.comments.push(submitedComment._id)

        await post.save()
        await user.save()

        res.json({ message: "Comment successfully posted!"});
    } catch (error) {
        res.json({message: error.message})
    }
}