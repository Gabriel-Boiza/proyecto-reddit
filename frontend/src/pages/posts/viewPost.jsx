import Header from "../../layouts/header"
import Aside from "../../layouts/aside"
import Post from "../../components/posts/post"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { domain } from "../../context/domain"
import axios from "axios"
import Comment from "../../components/posts/comment"

function ViewPost(){
    const {id} = useParams();
    const [post, setPost] = useState(null);
    const [refreshComments, setRefreshComments] = useState(false); // <-- estado para refrescar comentarios

    const postData = async () => {
        try {
            const providedData = await axios.get(`${domain}getPostById/${id}`, {withCredentials: true});
            setPost(providedData.data);
        } catch (error) {
            console.log("ha petado");
        }      
    };

    useEffect(() => {
        postData();
    }, []);

    // función que se llamará desde el formulario para refrescar comentarios
    const triggerRefreshComments = () => {
        setRefreshComments(prev => !prev); // alterna el valor
    };

    return (
        <div className="min-h-screen bg-[#14181a]">
            <Header />
            <div className="pt-16"> {/* Add padding-top for fixed header */}
                <Aside />
                <div className="flex">
                    <main className="content w-full p-4 md:ml-80">
                        {post ? (
                            <>
                                <Post post={post} />
                                <Comment post_id={id} refresh={refreshComments} />
                            </>
                        ) : (
                            <p>Cargando post...</p>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default ViewPost