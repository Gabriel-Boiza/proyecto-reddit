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

export const getCommentsByPost = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Encuentra el post y rellena el campo 'comments' con los datos completos de los comentarios
        const post = await Post.findById(id).populate('comments');
        
        // Asegúrate de que no haya duplicados en la respuesta
        console.log('Post Comments:', post.comments);

        // Si no se encuentra el post
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        // Devuelve los comentarios completos
        res.json({ comments: post.comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los comentarios' });
    }
};
