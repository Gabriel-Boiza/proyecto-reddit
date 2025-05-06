import Post from "../models/Post.js"
import User from "../models/User.js"


export const getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find()
        .populate("user_id", "username name") // Solo trae username y name del usuario
  
      res.json(posts);
    } catch (error) {
      console.error("Error al obtener los posts:", error);
      res.status(500).json({ message: "Error interno al obtener los posts." });
    }
  };
  

export const createPost = async (req, res) => {
    const { title, description } = req.body;
    const user_id = req.user.id;

    try {
        const post = new Post({
            title: title,
            user_id: user_id,
            description: description,
            votes: {
                upvotes: [],
                downvotes: []
            },  
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

export const getPostsByCookie = async (req, res) => {
    try {
        const user_id = req.user.id;

        const user = await User.findById(user_id)

        const posts = await Post.find({ _id: { $in: user.posts } });

        res.status(200).json({ posts: posts });
    } catch (error) {
        console.error("Error al obtener los posts del usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};