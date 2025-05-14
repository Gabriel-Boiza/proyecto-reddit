import express from "express"
import * as UserController from "../controllers/UserController.js"
import * as auth from "../middlewares/auth.middleware.js"


const route = express.Router()

route.get("/getAllUsers", UserController.getAllUsers)
route.get("/getUserById/:id", UserController.getUserById)
route.get("/getUserByUsername/:username", UserController.getUserByUsername)
route.get("/getUserByCookie", auth.verifyToken, UserController.getUserByCookie)
<<<<<<< HEAD
route.get("/getUserProfileById/:id", auth.verifyToken, UserController.getUserProfileById);
route.get('/getUserInteractions', auth.verifyToken, UserController.getUserInteractions);
=======

route.get("/getUserInteractions", auth.verifyToken, UserController.getUserInteractions);
route.get("/getUserInteractionsByUsername/:username", UserController.getUserInterectionsByUsername);
>>>>>>> a4d0abba51074c2cf1d28cd37ffd2be11afd764a


route.put('/editUser', auth.verifyToken, UserController.editUser);

route.delete("/deleteAccount", auth.verifyToken, UserController.deleteUser)

route.get('/getUserPosts/:id', UserController.getUserPosts)
route.get('/getUserComments/:id', UserController.getUserComments)

export default route
