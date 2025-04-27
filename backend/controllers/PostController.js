import Post from "../models/Post.js"

export const getAllPosts = async (req, res) => {
    const posts = await Post.find()
    res.json(posts)
}

export const createPost = async (req, res) => {
    const {_id, title, description, file_url, votes, user_id, comments, category, community_id} = req.body
    const post = new Post({
        _id,
        title,
        description,
        file_url,
        votes,
        user_id,
        comments,
        category,
        community_id
    })

    post.save()

    res.send(post)

}
