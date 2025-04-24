import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import usersRouter from "./routes/user.route.js"
import User from "./models/User.js"
dotenv.config()
connectDB()

const app = express()
app.use(express.json())

app.get('/', async (req, res) => {
    const users = await User.find();
    res.json(users)
})

app.use("/", usersRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {

})