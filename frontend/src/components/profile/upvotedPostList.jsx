import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { domain } from "../../context/domain";

const UpvotedPostList = ({ upvotedPosts }) => {

  return (
    <>
      {upvotedPosts.length > 0 ? (
                                            upvotedPosts.map(post => (
                                                <div key={post._id}>
                                                    <div>
                                                        <Link
                                                            to={`/post/${post._id}`}
                                                            className="block rounded-md p-4 hover:bg-gray-800 w-[100%] flex flex-col justify-between"
                                                            >
                                                            <div className="relative rounded-md p-4 hover:bg-gray-800 ">

                                                                <img
                                                                src={`${domain}uploads/${post.file_url}` || "https://via.placeholder.com/150"}
                                                                alt={post.title}
                                                                className="w-18 h-18 rounded-md mb-2 float-left mr-2"
                                                                />
                                                                <h3 className="text-xl text-[#B7CAD4] font-semibold">{post.title}</h3>
                                                                <p className="text-gray-400">{post.description}</p>
                                                            </div>

                                                            <div className="mt-auto">
                                                                <div className="text-sm text-gray-500 mt-4">
                                                                <span>Posted at: {new Date(post.created_at).toLocaleString()}</span>
                                                                </div>
                                                                <div className="mt-2 text-sm text-gray-500 flex gap-4">
                                                                <span className="flex items-center gap-1 text-green-400">
                                                                    <ThumbsUp size={16} />{post.votes?.upvotes?.length || 0}
                                                                </span>
                                                                <span className="flex items-center gap-1 text-red-400">
                                                                    <ThumbsDown size={16} />{post.votes?.downvotes?.length || 0}
                                                                </span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                    <hr className="border-t border-gray-700 mt-6 mx-2" />
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No upvoted posts to show.</p>
                                        )}
    </>
  );
};

export default UpvotedPostList;
