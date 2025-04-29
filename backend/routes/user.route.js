import express from "express"
import * as UserController from "../controllers/UserController.js"
import * as auth from "../middlewares/auth.middleware.js"


const route = express.Router()

route.get("/getAllUsers", UserController.getAllUsers)
route.get("/getUserById/:id", UserController.getUserById)

route.put("/editUser", UserController.editUser)

route.delete("/deleteUser/:id", UserController.deleteUser)

route.get('/getUserPosts/:id', UserController.getUserPosts)
route.get('/getUserComments/:id', UserController.getUserComments)

export default route
