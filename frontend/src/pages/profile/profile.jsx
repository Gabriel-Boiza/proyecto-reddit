import Header from "../../layouts/header";
import Aside from "../../layouts/aside";
import ProfilePost from "../../components/posts/profilePost";
import axios from "axios";
import { useEffect, useState } from "react";
import { domain } from "../../context/domain";
import { Plus } from "lucide-react";
import { Tab } from "@headlessui/react";
import { Dialog } from "@headlessui/react"; // Importamos el Dialog para el modal

function Profile() {
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

    useEffect(() => {
        userData();
        userPosts();
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
            <div className="flex">
                <Aside />
                <main className="content grid grid-cols-[5fr_2fr] min-w-[60%] max-w-[70%] gap-6 mx-auto p-4">
                    <section className="flex flex-col">
                        <div className="flex px-12 gap-6">
                            <img className="w-18 rounded-full" src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png" alt="" />
                            <div className="flex flex-col gap-1">
                                <h2 className="text-3xl font-bold text-[#B7CAD4]">{user.username}</h2>
                                <h2 className="text-lg text-[#8BA2AD]">{user.name}</h2>
                            </div>
                        </div>

                        <Tab.Group>
                            <Tab.List className="flex space-x-4 mt-6">
                                <Tab className="py-2 px-4 bg-gray-700 text-white rounded-md">Posts</Tab>
                                <Tab className="py-2 px-4 bg-gray-700 text-white rounded-md">Comments</Tab>
                                <Tab className="py-2 px-4 bg-gray-700 text-white rounded-md">Upvoted</Tab>
                                <Tab className="py-2 px-4 bg-gray-700 text-white rounded-md">Downvoted</Tab>
                            </Tab.List>

                            <Tab.Panels className="mt-4">
                                <Tab.Panel>
                                    <div>
                                        {posts.length > 0 ? (
                                            posts.map(post => (
                                                <ProfilePost 
                                                    key={post._id} 
                                                    post={post} 
                                                    onDelete={handleDeletePost}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No posts to show</p>
                                        )}
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div>
                                        <p>No comments to show.</p>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div>
                                        <p>No upvoted posts to show.</p>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div>
                                        <p>No downvoted posts to show.</p>
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </section>

                    <article className="p-10 rounded-[10px] bg-[linear-gradient(to_bottom,_#1e3a8a,_#000_20%)]">
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
