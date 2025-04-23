import mongoose, { Collection } from "mongoose";

const userSchema = new mongoose.Schema(
    {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
    },
    { 
        timestamps: true,
        Collection: "users" //define la coleccion
    },


);

const User = mongoose.model("User", userSchema); //le da a User los metodos de mongo para acceder a los datos en la tabla users
export default User;
