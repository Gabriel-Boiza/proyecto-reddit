import express from "express"

const route = express.Router()

route.get("/profile", (req, res) => {
    res.send("asdsg")
})

export default route
