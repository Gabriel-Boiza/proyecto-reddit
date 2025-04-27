import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const register = async (req, res) => {
    const {username, name, age, email, password, posts, comments} = req.body

    try {
        
        if(await User.findOne({username : username})){throw new Error("Username already exist")}
        if(await User.findOne({email : email})){throw new Error("Email already exist")}

        const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT_HASH))

        const user = new User({
            username : username,
            name : name,
            age : age,
            email : email,
            password : hashPassword,
            posts : posts,
            comments : comments
        })
    
        await user.save()
    
        res.send(user)
    } catch (error) {
        res.status(409).json({message: error.message})
    }
    
}

export const login = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email : email})
        if(!user){throw new Error("User not found")}  

        const isValid = await bcrypt.compare(password, user.password)
        if(!isValid) throw new Error("Password incorrect")

        const token = jwt.sign(
            {id: user.id},
            process.env.SECRET_JWT_KEY,
            {
                expiresIn: '1h',
            }
        )

        res.send(jwt.decode(token))
    } catch (error) {
        res.status(401).json({message : error.message})
    }
}