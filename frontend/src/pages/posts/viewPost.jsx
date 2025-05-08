import Header from "../../layouts/header"
import Aside from "../../layouts/aside"
import Post from "../../components/posts/post"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"

function ViewPost(){
    const {id} = useParams() //recoge el parametro id
    const [post, setPost] = useState(null)
    
    const postData = async () => {
        const providedData = await axios.get(`http://localhost:3000/getPostById/${id}`, {withCredentials: true})
        setPost(providedData.data)        
    }
    useEffect(() => {
        postData()
    }, [])
    useEffect(() => {
        console.log(post);
    }, [post])
    return(
        <>
            <Header/>
            <Aside/>
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                {post ? (
                    <Post key={post._id} post={post} />
                ) : (
                    <p>Cargando post...</p>
                )}
            </div>

        </>
    )
}

export default ViewPost