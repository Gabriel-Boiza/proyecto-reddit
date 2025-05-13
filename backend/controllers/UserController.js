import User from "../models/User.js"
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

import jwt from "jsonwebtoken"

export const getAllUsers = async (req, res) => {
    const users = await User.find();
    res.json(users)
}

export const getUserById = async (req, res) => {
    const params = req.params //obtenemos los parametros del get
    const id = params.id
    try {
        const user = await User.findById(id)
        if(!user){throw new Error("User not found")}
        res.json(user)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getUserByCookie = async (req, res) => {
    try {
        const decoded = jwt.verify(req.cookies.access_token, process.env.SECRET_JWT_KEY);
        const userId = decoded.id;

        const posts = await Post.find({ user_id: userId });
        const user = await User.findById(userId).select("-password");

        // Sumar upvotes y downvotes de los posts
        const upvotes = posts.reduce((acc, post) => acc + (post.votes?.upvotes?.length || 0), 0);
        const downvotes = posts.reduce((acc, post) => acc + (post.votes?.downvotes?.length || 0), 0);

        // Sumar total de comentarios que tienen sus posts
        const commentCount = posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0);

        res.json({
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                age: user.age,
                postCount: posts.length,
                commentCount,
                upvotes,
                downvotes
            }
        });
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: "Invalid token or user" });
    }
};

export const getUserProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        // Buscar al usuario en la base de datos por ID (sin contraseña)
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Posts creados por el usuario
        const userPosts = await Post.find({ user_id: id });

        // Todos los posts (para buscar likes/dislikes del usuario)
        const allPosts = await Post.find();

        // Likes y dislikes hechos por el usuario
        const likedPosts = allPosts.filter(post =>
            post.votes?.upvotes?.includes(id)
        );
        const dislikedPosts = allPosts.filter(post =>
            post.votes?.downvotes?.includes(id)
        );

        // Comentarios hechos por el usuario
        const comments = await Comment.find({ user_id: id });

        // Sumar upvotes y downvotes en sus propios posts
        const upvotes = userPosts.reduce((acc, post) => acc + (post.votes?.upvotes?.length || 0), 0);
        const downvotes = userPosts.reduce((acc, post) => acc + (post.votes?.downvotes?.length || 0), 0);

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                age: user.age,
                postCount: userPosts.length,
                commentCount: comments.length,
                upvotes,
                downvotes
            },
            posts: userPosts,
            likedPosts,
            dislikedPosts,
            comments
        });
        

    } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUserInteractions = async (req, res) => {
    try {
        const decoded = jwt.verify(req.cookies.access_token, process.env.SECRET_JWT_KEY);
        const userId = decoded.id;

        // Comentarios con posts asociados
        const user = await User.findById(userId).populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } }
        });

        const commentsWithPosts = await Promise.all(user.comments.map(async comment => {
            const post = await Post.findOne({ comments: comment._id });
            return post ? { comment, post } : null;
        }));

        // Posts upvoted y downvoted
        const upvotedPosts = await Post.find({ "votes.upvotes": userId }).sort({ created_at: -1 });
        const downvotedPosts = await Post.find({ "votes.downvotes": userId }).sort({ created_at: -1 });

        res.json({
            commentsWithPosts: commentsWithPosts.filter(Boolean),
            upvotedPosts,
            downvotedPosts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch interactions" });
    }
};


export const editUser = async (req, res) => {
  const { name, username, password } = req.body;
  const userId = req.user.id; // Suponiendo que el middleware auth agrega el ID del usuario

  if (!name || !username || !password) {
    return res.status(400).json({ message: 'Faltan datos para actualizar el usuario' });
  }

  try {
    // Cifrar la contraseña si se cambia
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar el usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { name, username, password: hashedPassword }, 
      { new: true } // Retorna el usuario actualizado
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario actualizado correctamente', updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

export const deleteUser = async (req, res) => {
    const userId = req.user.id;  // Suponiendo que el id del usuario está en req.user
    try {
        const user = await User.findById(userId);  // Busca al usuario por el id
        if (!user) {
            throw new Error("User not found");
        }
        await user.deleteOne();  // Elimina el usuario de la base de datos
        res.json({ message: "OK" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getUserPosts = async (req, res) => {
    const params = req.params 
    const id = params.id
    try {
        const user = await User.findById(id).populate('posts');
        if (!user) {throw new Error("User not found")}
        res.json(user.posts)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


export const getUserComments = async (req, res) => {
    const params = req.params 
    const id = params.id
    try {
        const user = await User.findById(id).populate('comments');
        if (!user) {throw new Error("User not found")}
        res.json(user.comments);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}