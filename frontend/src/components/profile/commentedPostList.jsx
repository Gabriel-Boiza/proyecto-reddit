import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Link } from "react-router-dom";
import { domain } from "../../context/domain";

export default function CommentedPostList({ comments }) {
    return (
        <div className="max-h-[600px] overflow-y-auto pr-2">
            {comments.length > 0 ? (
                comments.map(({ comment, post }) => (
                    <div key={comment._id}>
                        <Link
                            to={`/post/${post._id}`}
                            className="block rounded-md p-4 hover:bg-gray-800 w-[100%] min-h-[200px] flex flex-col justify-between"
                        >
                            <div className="relative rounded-md p-4 hover:bg-gray-800">
                                <img
                                    src={`${domain}uploads/${post.file_url}` || "https://via.placeholder.com/150"}
                                    alt={post.title}
                                    className="w-18 h-18 rounded-md mb-2 float-left mr-2"
                                />
                                <h3 className="text-xl text-[#B7CAD4] font-semibold">{post.title}</h3>
                                <p className="text-gray-400">{post.description}</p>
                            </div>
                            <div className="mt-auto">
                                <p className="text-sm text-gray-400 mt-4 self-end">
                                    Posted at: {new Date(comment.created_at).toLocaleDateString()}
                                </p>
                                <p className="mt-2 text-gray-300">Comment: {comment.text}</p>
                                <div className="mt-3 text-sm text-gray-500 flex gap-4">
                                    <span className="flex items-center gap-1 text-green-400">
                                        <ThumbsUp size={16} />{post.votes?.upvotes?.length || 0}
                                    </span>
                                    <span className="flex items-center gap-1 text-red-400">
                                        <ThumbsDown size={16} />{post.votes?.downvotes?.length || 0}
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <hr className="border-t border-gray-700 mt-6 mx-2 mb-4 " />
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No comments to show.</p>
            )}
        </div>
    );
}
