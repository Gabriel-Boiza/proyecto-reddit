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



export const editUser = async (req, res) => {
    res.send(req.body)
}

export const deleteUser = async (req, res) => {
    const params = req.params 
    const id = params.id
    try {
        const user = await User.findById(id)
        if(!user){throw new Error("User not found")}
        await user.deleteOne()
        res.json({message: "OK"})
    } catch (error) {
        res.status(404).json({message: error.message})
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