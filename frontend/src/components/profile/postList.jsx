import { Link, useNavigate } from "react-router-dom";
import { Trash, Pencil, ThumbsUp, ThumbsDown } from "lucide-react";
import { domain } from "../../context/domain";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const PostList = ({ posts, onDelete, isOwner }) => {
  const { currentUser } = useAuth(); // Obtiene el usuario logueado
  const navigate = useNavigate()
  const deletePost = async (e, postId) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This post will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF6600",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#1c1c1c",
      color: "#ffffff",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${domain}deletePost`, {
          data: { post_id: postId },
          withCredentials: true,
        });

        if (onDelete) onDelete(postId);

        Swal.fire({
          title: "Deleted!",
          text: "The post has been deleted.",
          icon: "success",
          background: "#1c1c1c",
          color: "#ffffff",
          confirmButtonColor: "#FF6600",
        });
      } catch (err) {
        console.error("Error deleting post:", err);
        Swal.fire("Error", "There was a problem deleting the post.", "error");
      }
    }
  };

    const editPost = async (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/editPost/${postId}`)
  
  };
  return (
    <>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id}>
            <Link
              to={`/post/${post._id}`}
              className="rounded-md p-4 hover:bg-gray-800 w-[100%] flex flex-col justify-between"
            >
              <div className="relative rounded-md p-4 hover:bg-gray-800">
                {currentUser?.username === post.author?.username && isOwner && (
                  <div className="absolute right-4 top-4 flex gap-2 z-10">
                    <button
                      onClick={(e) => deletePost(e, post._id)}
                      className="bg-[#2a3236] hover:bg-[#333D42] text-white font-bold px-2 py-2 rounded-2xl"
                      aria-label="Delete Post"
                    >
                      <Trash className="w-4 h-4" color="red" />
                    </button>
                    <button
                      onClick={(e) => editPost(e, post._id)} // Asegúrate de tener esta función definida
                      className="bg-[#2a3236] hover:bg-[#333D42] text-white font-bold px-2 py-2 rounded-2xl"
                      aria-label="Edit Post"
                    >
                      <Pencil className="w-4 h-4" color="white" />
                    </button>
                  </div>
                )}
                {post?.file_url && (
                <img
                  src={
                      `${domain}uploads/${post.file_url}`
                  }
                  alt={post.title}
                  className="w-18 h-18 rounded-md mb-2 float-left mr-2"
                />
                )}

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
            <hr className="border-t border-gray-700 mt-6 mx-2" />
          </div>
        ))
      ) : (
        <p className="text-gray-500">No posts to show</p>
      )}
    </>
  );
};

export default PostList;
