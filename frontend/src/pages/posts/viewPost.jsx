import Header from "../../layouts/header"
import Aside from "../../layouts/aside"
import Post from "../../components/posts/post"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { domain } from "../../context/domain"
import axios from "axios"
import CommentForm from "../../components/posts/createComment"
import Comment from "../../components/posts/comment"

function ViewPost(){
    const {id} = useParams() //recoge el parametro id
    const [post, setPost] = useState(null)
    
    const postData = async () => {
        try {
            const providedData = await axios.get(`${domain}getPostById/${id}`, {withCredentials: true})
            setPost(providedData.data)  
        } catch (error) {
            console.log("ha petado")
        }      
    }
    useEffect(() => {
        postData()
    }, [])

    return(
        <>
            <Header/>
            <Aside/>
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                {post ? (
                    <>
                    <Post post={post} />
                    <CommentForm post_id={id}/>
                    <Comment post_id={id}/>
                    </>
                ) : (
                    <p>Cargando post...</p>
                )}
            
            </div>
            
            

        </>
    )
}

export default ViewPost