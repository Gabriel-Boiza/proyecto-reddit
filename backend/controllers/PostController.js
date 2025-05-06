import Post from "../models/Post.js"
import User from "../models/User.js"


export const getAllPosts = async (req, res) => {
    const posts = await Post.find()
    res.json(posts)
}

export const createPost = async (req, res) => {
    const { title, description } = req.body;
    const user_id = req.user.id;

    try {
        const post = new Post({
            title: title,
            user_id: user_id,
            description: description,
            votes: [],
            file_url: "file_url",
            comments: [],
            community_id: "6809fa19371970ec6cf6dcf5"
        });

        await post.save();

        await User.findByIdAndUpdate(
            user_id,
            { $push: { posts: post._id } }, 
            { new: true } 
        );

        res.json(post);

    } catch (error) {
        console.error("Error al crear el post:", error);
        res.status(500).json({ message: "Error interno al crear el post." });
    }
};


