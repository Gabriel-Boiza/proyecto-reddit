import Header from "../../layouts/header";
import Aside from "../../layouts/aside";
import axios from "axios";
import { useEffect, useState } from "react";
import { domain } from "../../context/domain";
import { Plus, ThumbsUp, ThumbsDown, Trash } from "lucide-react";
import { Tab } from "@headlessui/react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

function Profile({ post, onDelete }) {

    const deletePost = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Mostrar el popup de confirmación con estilo personalizado
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Este post será eliminado permanentemente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF6600',  // Naranja como color principal
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1c1c1c',  // Fondo oscuro
            color: '#ffffff', // Texto blanco
            customClass: {
                title: 'text-orange-500', // Título con color naranja
                content: 'text-gray-300', // Contenido en gris claro
                confirmButton: 'text-white border-none', // Botón de confirmación con texto blanco
                cancelButton: 'text-white border-none', // Botón de cancelación con texto blanco
            },
        });

        if (result.isConfirmed) {
            try {
                // Hacer la solicitud para eliminar el post
                await axios.delete(`${domain}deletePost`, {
                    data: { post_id: post._id },
                    withCredentials: true
                });

                // Llamar la función onDelete para actualizar el estado en el componente padre
                if (onDelete) onDelete(post._id);

                // Mostrar un mensaje de éxito
                Swal.fire({
                    title: 'Eliminado!',
                    text: 'El post ha sido eliminado.',
                    icon: 'success',
                    background: '#1c1c1c',
                    color: '#ffffff',
                    confirmButtonColor: '#FF6600',
                    customClass: {
                        title: 'text-orange-500',
                        content: 'text-gray-300',
                        confirmButton: 'text-white border-none',
                    },
                });
            } catch (err) {
                // Manejar el error si algo sale mal
                console.error("Error deleting post:", err);
                Swal.fire(
                    'Error',
                    'Hubo un problema al eliminar el post.',
                    'error'
                );
            }
        }
    };

    const [user, setUser] = useState({
        username: "",
        name: "",
        age: 0,
        postCount: 0,
        commentCount: 0,
        upvotes: 0,
        downvotes: 0
    });

    const [posts, setPosts] = useState([]);
    const [isOpen, setIsOpen] = useState(false); // Estado para controlar la visibilidad del popup
    const [socialLink, setSocialLink] = useState(""); // Estado para el enlace social
    const [copied, setCopied] = useState(false); // Estado para mostrar el mensaje de copiado
    const [comments, setComments] = useState([]);
    const [upvotedPosts, setUpvotedPosts] = useState([]);
    const [downvotedPosts, setDownvotedPosts] = useState([]);
    
    const fetchUserInteractions = async () => {
        try {
            const response = await axios.get(`${domain}getUserInteractions`, { withCredentials: true });
            setComments(response.data.commentsWithPosts || []);
            setUpvotedPosts(response.data.upvotedPosts || []);
            setDownvotedPosts(response.data.downvotedPosts || []);
        } catch (error) {
            console.error("Error fetching interactions:", error.response?.data?.message);
        }
    };
    
    useEffect(() => {
        userData();
        userPosts();
        fetchUserInteractions();
    }, []);
    

    const userData = async () => {
        try {
            const response = await axios.get(`${domain}getUserByCookie`, { withCredentials: true });
            const providedUser = response.data.user;
            setUser({
                username: providedUser.username,
                name: providedUser.name,
                age: providedUser.age,
                postCount: providedUser.postCount,
                commentCount: providedUser.commentCount,
                upvotes: providedUser.upvotes,
                downvotes: providedUser.downvotes
            });
        } catch (error) {
            console.log(error.response?.data?.message);
        }
    };

    const userPosts = async () => {
        try {
            const response = await axios.get(`${domain}getPostsByCookie`, { withCredentials: true });
            setPosts(response.data.posts);
        } catch (error) {
            console.log("Error loading user posts:", error.response?.data?.message);
        }
    };

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post._id !== postId)); // Elimina el post del estado
    };

    // Función para copiar al portapapeles
    const copyToClipboard = () => {
        const profileLink = `${window.location.origin}/profile/${user.username}`; // Suponiendo que la URL del perfil sea esta
        navigator.clipboard.writeText(profileLink)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 3000); // El mensaje se cierra después de 3 segundos
            })
            .catch((error) => {
                console.error("Error copying to clipboard:", error);
            });
    };

    return (
        <>
            <Header />
            <Aside />
            <div className="flex">
                <main className="content grid grid-cols-[5fr_2fr] gap-6 mx-auto p-4 ml-80">
                    <section className="flex flex-col">
                        <div className="flex px-12 gap-6">
                            <img className="w-18 rounded-full" src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png" alt="" />
                            <div className="flex flex-col gap-1">
                                <h2 className="text-3xl font-bold text-[#B7CAD4]">{user.username}</h2>
                                <h2 className="text-lg text-[#8BA2AD]">{user.name}</h2>
                            </div>
                        </div>

                        <Tab.Group>
                            <Tab.List className="relative flex space-x-4 mt-6 bg-gray-800 p-1 rounded-lg w-[1200px]">
                                <Tab
                                    className={({ selected }) =>
                                        `relative z-10 py-2 px-4 text-sm font-medium rounded-md transition-all duration-300 outline-none
                                        ${selected
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700'}`
                                    }
                                    
                                >
                                    Posts
                                </Tab>
                                <Tab
                                    className={({ selected }) =>
                                        `relative z-10 py-2 px-4 text-sm font-medium rounded-md transition-all duration-300 outline-none
                                        ${selected
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700'}`
                                    }
                                    
                                >
                                    Upvoted
                                </Tab>
                                <Tab
                                    className={({ selected }) =>
                                        `relative z-10 py-2 px-4 text-sm font-medium rounded-md transition-all duration-300 outline-none
                                        ${selected
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700'}`
                                    }
                                    
                                >
                                    Downvoted
                                </Tab>
                                <Tab
                                    className={({ selected }) =>
                                        `relative z-10 py-2 px-4 text-sm font-medium rounded-md transition-all duration-300 outline-none
                                        ${selected
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700'}`
                                    }
                                    
                                >
                                    Comments
                                </Tab>
                            </Tab.List>

                            <Tab.Panels className="mt-4 max-h-[650px] overflow-y-auto pr-2 scrollPosts">
                                <Tab.Panel>
                                <div className="max-h-[600px] overflow-y-auto pr-2">
                                    {posts.length > 0 ? (
                                        posts.map(post => (
                                            posts.map(post => (
                                                <div key={post._id}>
                                                    <div>
                                                        <button
                                                            onClick={deletePost}
                                                            className="absolute right-4 top-4 gap-2 bg-[#2a3236] hover:bg-[#333D42] text-white font-bold px-2 py-2 rounded-2xl z-10"
                                                            aria-label="Delete Post">
                                                            <Trash className="w-4 h-4" color="red" />
                                                        </button>
                                                        <Link
                                                            to={`/post/${post._id}`}
                                                            className="block rounded-md p-4 hover:bg-gray-800 w-[1200px] flex flex-col justify-between"
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
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No posts to show</p>
                                    )}
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                <div className="max-h-[600px] overflow-y-auto pr-2">
                                        {upvotedPosts.length > 0 ? (
                                            upvotedPosts.map(post => (
                                                <div key={post._id}>
                                                    <div>
                                                        <button
                                                            onClick={deletePost}
                                                            className="absolute right-4 top-4 gap-2 bg-[#2a3236] hover:bg-[#333D42] text-white font-bold px-2 py-2 rounded-2xl z-10"
                                                            aria-label="Delete Post">
                                                            <Trash className="w-4 h-4" color="red" />
                                                        </button>
                                                        <Link
                                                            to={`/post/${post._id}`}
                                                            className="block rounded-md p-4 hover:bg-gray-800 w-[1200px] flex flex-col justify-between"
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
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                <div className="max-h-[600px] overflow-y-auto pr-2">
                                    {downvotedPosts.length > 0 ? (
                                        downvotedPosts.map(post => (
                                            // For "Upvoted" and "Downvoted" posts
                                            <div key={post._id} className="mb-4">
                                                <div>
                                                        <Link
                                                            to={`/post/${post._id}`}
                                                            className="block rounded-md p-4 hover:bg-gray-800 w-[1200px] flex flex-col justify-between"
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
                                                <hr className="border-t border-gray-700 mt-6 mx-2 mb-4 " />

                                                </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No downvoted posts to show.</p>
                                    )}
                                    </div>
                                </Tab.Panel>
                                
                                <Tab.Panel>
                                <div className="max-h-[600px] overflow-y-auto pr-2">
                                        {comments.length > 0 ? (
                                            comments.map(({ comment, post }) => (
                                                <div key={comment._id}>
                                                    <Link to={`/post/${post._id}`} className="block rounded-md p-4 hover:bg-gray-800 w-[1200px] min-h-[200px] flex flex-col justify-between">
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
                                                            <p className="text-sm text-gray-400 mt-4 self-end">Posted at: {new Date(comment.created_at).toLocaleDateString()}</p>
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
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </section>









                    <article className="p-10 h-[550px] w-[300px]  rounded-[10px] bg-[linear-gradient(to_bottom,_#1e3a8a,_#000_20%)]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white font-bold">{user.username}</h2>
                        </div>
                        <hr className="border-gray-700 my-4 mx-2" />

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p>{user.postCount}</p>
                                <p>Posts</p>
                            </div>
                            <div>
                                <p>{user.commentCount}</p>
                                <p>Comments</p>
                            </div>
                            <div>
                                <p>{user.upvotes}</p>
                                <p>Upvotes</p>
                            </div>
                            <div>
                                <p>{user.downvotes}</p>
                                <p>Downvotes</p>
                            </div>
                        </div>

                        <hr className="border-gray-700 my-4 mx-2" />

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 mb-2">SETTINGS</h3>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <img className="w-8 rounded-full" src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png" alt="" />
                                    <div>
                                        <p className="text-white text-sm">Profile</p>
                                        <p className="text-xs">Customize your profile</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="border-gray-700 my-4 mx-2" />

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 mb-2">MEDIA</h3>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div>
                                        <button className="flex bg-gray-700 text-white text-xs rounded-full px-3 w-34 py-1">
                                            <Plus className="w-4 h-4 mr-2" />Add Social Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="border-gray-700 my-4 mx-2" />

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 mb-2">SHARE MY PROFILE</h3>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div>
                                        <button onClick={copyToClipboard} className="flex bg-gray-700 text-white text-xs rounded-full px-3 w-34 py-1">
                                            Copy to Clipboard
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </main>
            </div>

            {/* Popup de éxito al copiar */}
            {copied && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    <p className="text-sm">Profile link copied to clipboard!</p>
                </div>
            )}
        </>
    );
}

export default Profile;
