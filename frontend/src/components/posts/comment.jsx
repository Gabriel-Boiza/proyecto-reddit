import axios from "axios";
import { domain } from "../../context/domain";
import { useEffect, useState } from "react";

const Comment = ({ post_id }) => {
    const [comments, setComments] = useState([]);

    const commentsData = async () => {
        const response = await axios.get(`${domain}getCommentsByPost/${post_id}`);
        const comments = response.data.comments;
        setComments(comments);
    };

    useEffect(() => {
        commentsData();
    }, []);

    
    return (
        <>
            {comments.map((comment) => {
                return (
                    <div key={comment._id} className="flex items-start p-4 border-b border-zinc-700 w-full overflow-hidden">
                        <div className="mr-3 flex-shrink-0">
                            <img 
                                src="/api/placeholder/40/40" 
                                alt="Avatar de usuario" 
                                className="w-10 h-10 rounded-full"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium">Usuario</h4>
                            <p className="break-words">{comment.text}</p>
                        </div>
                    </div>
                )
            })}
        </>
    );
};

export default Comment;