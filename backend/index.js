import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import usersRouter from "./routes/user.route.js"
import postsRouter from "./routes/post.route.js"


dotenv.config()
connectDB()

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.send("g")
})

app.use("/", usersRouter)
app.use("/", postsRouter)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Servidor")
})