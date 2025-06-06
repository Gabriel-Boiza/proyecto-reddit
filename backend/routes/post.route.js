import express from "express"
import * as PostController from "../controllers/PostController.js"
import * as authMiddleware from '../middlewares/auth.middleware.js'
import { upload } from "../config/multer.js"

const route = express.Router()

route.get("/getAllPosts", PostController.getAllPosts)
route.get("/getPostsByCookie", authMiddleware.verifyToken, PostController.getPostsByCookie)
route.get("/getPostById/:id", PostController.getPostById)
route.get("/getPostsByUsername/:username", PostController.getPostsByUsername)

route.post("/upvote", authMiddleware.verifyToken, PostController.upVote)
route.post("/downvote", authMiddleware.verifyToken, PostController.downVote)
route.post("/getVoteState", authMiddleware.verifyToken, PostController.getVoteState)


route.post("/createPost", authMiddleware.verifyToken, upload.single("file"), PostController.createPost)
route.put("/updatePost/:id", authMiddleware.verifyToken, upload.single("file"), PostController.updatePost)
route.delete("/deletePost", authMiddleware.verifyToken, PostController.deletePost)

export default route
