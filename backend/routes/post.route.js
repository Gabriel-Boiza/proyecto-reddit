import express from "express"
import * as PostController from "../controllers/PostController.js"

const route = express.Router()

route.get("/getAllPosts", PostController.getAllPosts)



route.post("/createPost", PostController.createPost)


export default route
