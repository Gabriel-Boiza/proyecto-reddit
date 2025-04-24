import Post from "../models/Post.js"

export const getAllPosts = async (req, res) => {
    const posts = await Post.find()
    res.json(posts)
}