import express from "express"
import * as UserController from "../controllers/UserController.js"

const route = express.Router()

route.get("/getAllUsers", UserController.getAllUsers)

export default route
