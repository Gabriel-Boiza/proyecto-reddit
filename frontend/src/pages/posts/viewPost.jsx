import Header from "../../layouts/header"
import Aside from "../../layouts/aside"
import Post from "../../components/posts/post"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { domain } from "../../context/domain"
import axios from "axios"
import Comment from "../../components/posts/comment"

function ViewPost() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [refreshComments, setRefreshComments] = useState(false);

    const postData = async () => {
        try {
            const providedData = await axios.get(`${domain}getPostById/${id}`, { withCredentials: true });
            setPost(providedData.data);
        } catch (error) {
            console.log("ha petado");
        }
    };

    useEffect(() => {
        postData();
    }, []);

    const triggerRefreshComments = () => {
        setRefreshComments(prev => !prev);
    };

    return (
        <div className="bg-[#14181a] min-h-screen">
            <Header />
            <div className="flex pt-16 max-w-6xl mx-auto">
                <Aside />
                <main className="flex justify-center items-start w-full p-4">
                    <div className="w-full max-w-3xl">
                        {post ? (
                            <>
                                <Post post={post} />
                                <Comment post_id={id} refresh={refreshComments} />
                            </>
                        ) : (
                            <p className="text-white">Cargando post...</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ViewPost
