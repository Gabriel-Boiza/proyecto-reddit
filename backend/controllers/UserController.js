import User from "../models/User.js"
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const getAllUsers = async (req, res) => {
    const users = await User.find();
    res.json(users)
}

export const getUserById = async (req, res) => {
    const params = req.params //obtenemos los parametros del get
    const id = params.id
    const user = await User.findById(id)
    res.json(user)
}

export const createUser = async (req, res) => {
    res.send(req.body)
}

export const editUser = async (req, res) => {
    res.send(req.body)
}

export const deleteUser = async (req, res) => {
    const params = req.params 
    const id = params.id
    const user = await User.findById(id)

    await user.deleteOne()
}

export const getUserPosts = async (req, res) => {
    const params = req.params 
    const id = params.id
    const user = await User.findById(id).populate('posts')

    res.json(user.posts)
}

export const getUserComments = async (req, res) => {
    const params = req.params
    const id = params.id
    const user = await User.findById(id).populate('comments')

    res.json(user.comments)
}