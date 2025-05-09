import express from "express"
import * as CommentController from "../controllers/CommentController.js"
import * as authMiddleware from '../middlewares/auth.middleware.js'


const route = express.Router()

route.post("/createComment", authMiddleware.verifyToken, CommentController.createComment)
route.get("/getCommentsByPost/:id", CommentController.getCommentsByPost)


export default route