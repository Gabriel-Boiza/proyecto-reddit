import Header from "../../layouts/header";
import Aside from "../../layouts/aside";

// Posts
import PostList from "../../components/profile/postList";

// Card perfil
import ProfileCard from "../../components/profile/profileCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { domain } from "../../context/domain";
<<<<<<< HEAD
=======
import { Plus, ThumbsUp, ThumbsDown, Trash } from "lucide-react";
import { Tab } from "@headlessui/react";
import { Link, useParams } from "react-router-dom";
>>>>>>> a4d0abba51074c2cf1d28cd37ffd2be11afd764a
import Swal from 'sweetalert2';
import { useAuth } from '../../context/authContext.js';
import { useParams } from "react-router-dom";
import { Tab } from "@headlessui/react";

<<<<<<< HEAD
// Pestañas solo para el perfil propio
import UpvotedPostList from "../../components/profile/upvotedPostList";
import DownvotedPostList from "../../components/profile/downvotedPostList";
import CommentedPostList from "../../components/profile/commentedPostList";

function Profile() {
    const { userId } = useParams();
    const { logout } = useAuth();

    const [user, setUser] = useState({});
    const [isOwnProfile, setIsOwnProfile] = useState(false);
=======
function Profile({isOwner}) {
    const [user, setUser] = useState({
        username: "",
        name: "",
        age: 0,
        postCount: 0,
        commentCount: 0,
        upvotes: 0,
        downvotes: 0
    });

    const {username} = useParams()

>>>>>>> a4d0abba51074c2cf1d28cd37ffd2be11afd764a
    const [posts, setPosts] = useState([]);
    const [postsThird, setPostsThird] = useState([]); // Nueva variable para posts del usuario ajeno

    // Solo para perfil propio
    const [comments, setComments] = useState([]);
    const [upvotedPosts, setUpvotedPosts] = useState([]);
    const [downvotedPosts, setDownvotedPosts] = useState([]);

    const fetchUserData = async (targetUserId) => {
        const endpoint = targetUserId
            ? `${domain}getUserProfileById/${targetUserId}`
            : `${domain}getUserByCookie`;
        const res = await axios.get(endpoint, { withCredentials: true });
        return res.data;
    };

    const fetchUserPosts = async (isOwner, targetUserId) => {
        try {
            const endpoint = isOwner
                ? `${domain}getPostsByCookie`
                : `${domain}getPostsByUserId/${targetUserId}`;
            const res = await axios.get(endpoint, { withCredentials: true });
            if (isOwner) {
                setPosts(res.data.posts);  // Posts del perfil propio
            } else {
                setPostsThird(res.data.posts);  // Posts del perfil ajeno
            }
        } catch (error) {
            console.error("Error fetching posts:", error.response?.data?.message);
        }
    };

    const fetchUserInteractions = async () => {
        try {
            let response
            if(isOwner){
                response = await axios.get(`${domain}getUserInteractions`, { withCredentials: true });
            }
            else{
                response = await axios.get(`${domain}getUserInteractionsByUsername/${username}`, { withCredentials: true });
            }
            setComments(response.data.commentsWithPosts || []);
            setUpvotedPosts(response.data.upvotedPosts || []);
            setDownvotedPosts(response.data.downvotedPosts || []);
        } catch (error) {
            console.error("Error fetching interactions:", error.response?.data?.message);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                // Obtener usuario autenticado (cookie)
                const auth = await axios.get(`${domain}getUserByCookie`, { withCredentials: true });
                const authUserData = auth.data.user;

<<<<<<< HEAD
                let profileUser = null;

                if (userId) {
                    // Perfil ajeno
                    const profileData = await fetchUserData(userId);
                    profileUser = profileData.user;
                } else {
                    // Perfil propio
                    profileUser = authUserData;
                }

                if (!profileUser) {
                    throw new Error("No se pudo obtener la información del perfil.");
                }

                const sameUser = profileUser._id === authUserData._id;
                setIsOwnProfile(sameUser); // Establece si es tu perfil o el ajeno
                setUser(profileUser); // Establece los datos del perfil en el estado

                await fetchUserPosts(sameUser, userId);

                if (sameUser) {
                    await fetchUserInteractions();
                }
            } catch (error) {
                console.error("Error cargando datos del perfil:", error.message);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo cargar el perfil del usuario.',
                    icon: 'error',
                    background: '#1c1c1c',
                    color: '#ffffff',
                    confirmButtonColor: '#FF6600',
                });
            }
        };

        loadData();
    }, [userId]);
=======
    const userData = async () => {
        let response;
        try {
            if (isOwner) {
                response = await axios.get(`${domain}getUserByCookie`, { withCredentials: true });
            } else {
                response = await axios.get(`${domain}getUserByUsername/${username}`, { withCredentials: true });
            }
    
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
        let response
        try {
            if(isOwner){
                response = await axios.get(`${domain}getPostsByCookie`, { withCredentials: true });
            }
            else{
                response = await axios.get(`${domain}getPostsByUsername/${username}`, { withCredentials: true });
            }
            setPosts(response.data.posts);
        } catch (error) {
            console.log("Error loading user posts:", error.response?.data?.message);
        }
    };
>>>>>>> a4d0abba51074c2cf1d28cd37ffd2be11afd764a

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post._id !== postId));
    };

    const deleteAccount = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Your account will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF6600',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete account',
            cancelButtonText: 'Cancel',
            background: '#1c1c1c',
            color: '#ffffff',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${domain}deleteAccount`, { withCredentials: true });
                Swal.fire({
                    title: 'Account deleted!',
                    text: 'Your account has been deleted.',
                    icon: 'success',
                    background: '#1c1c1c',
                    color: '#ffffff',
                    confirmButtonColor: '#FF6600',
                }).then(() => {
                    logout();
                });
            } catch (err) {
                console.error("Error deleting account:", err);
                Swal.fire('Error', 'There was a problem deleting the account.', 'error');
            }
        }
    };

    return (
        <>
            <Header />
            <Aside />
            <div className="flex">
                <main className="content grid grid-cols-[5fr_2fr] gap-6 mx-auto p-4 ml-80 w-[100%]">
                    <section className="flex flex-col w-full">
                        {/* Mostrar solo la información del perfil propio */}
                        {isOwnProfile && (
                            <div className="flex px-12 gap-6">
                                <img
                                    className="w-18 rounded-full"
                                    src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png"
                                    alt="profile avatar"
                                />
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-3xl font-bold text-[#B7CAD4]">{user.username}</h2>
                                    <h2 className="text-lg text-[#8BA2AD]">{user.name}</h2>
                                </div>
                            </div>
                        )}

                        {/* Pestañas solo para el perfil propio */}
                        <Tab.Group className="w-full">
                            <Tab.List className="relative flex space-x-4 mt-6 bg-gray-800 p-1 rounded-lg">
                                <Tab
                                    className={({ selected }) =>
                                        `py-2 px-4 text-sm font-medium rounded-md transition-all duration-300 outline-none ${
                                            selected
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                        }`
                                    }
                                >
                                    Posts
                                </Tab>

                                {!userId && ['Upvoted', 'Downvoted', 'Comments'].map((tab) => (
                                    <Tab
                                        key={tab}
                                        className={({ selected }) =>
                                            `py-2 px-4 text-sm font-medium rounded-md transition-all duration-300 outline-none ${
                                                selected
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                            }`
                                        }
                                    >
                                        {tab}
                                    </Tab>
                                ))}
                            </Tab.List>

                            <Tab.Panels className="mt-4 max-h-[650px] overflow-y-auto pr-2 scrollPosts">
                                <Tab.Panel>
<<<<<<< HEAD
                                    <PostList 
                                        posts={userId ? postsThird : posts} // Aquí elegimos los posts según si estamos viendo un perfil ajeno
                                        onDelete={!userId ? handleDeletePost : undefined} 
                                    />
=======
                                    <div className="max-h-[600px] overflow-y-auto pr-2">
                                        <PostList posts={posts} onDelete={handleDeletePost} isOwner={isOwner} />
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="max-h-[600px] overflow-y-auto pr-2">
                                        <UpvotedPostList upvotedPosts={upvotedPosts} />
                                    </div>
                                </Tab.Panel>

                                <Tab.Panel>
                                    <div className="max-h-[600px] overflow-y-auto pr-2">
                                        <DownvotedPostList downvotedPosts={downvotedPosts} />
                                    </div>
                                </Tab.Panel>
                                
                                <Tab.Panel>
                                    <CommentedPostList comments={comments} />
>>>>>>> a4d0abba51074c2cf1d28cd37ffd2be11afd764a
                                </Tab.Panel>

                                {!userId && (
                                    <>
                                        <Tab.Panel>
                                            <UpvotedPostList upvotedPosts={upvotedPosts} />
                                        </Tab.Panel>
                                        <Tab.Panel>
                                            <DownvotedPostList downvotedPosts={downvotedPosts} />
                                        </Tab.Panel>
                                        <Tab.Panel>
                                            <CommentedPostList comments={comments} />
                                        </Tab.Panel>
                                    </>
                                )}
                            </Tab.Panels>
                        </Tab.Group>
                    </section>

<<<<<<< HEAD
                    <article className="p-10 h-[600px] w-[300px] rounded-[10px] bg-[linear-gradient(to_bottom,_#1e3a8a,_#000_20%)]">
                        {userId === user.username && (
                            <ProfileCard user={user} deleteAccount={deleteAccount} isOwnProfile={true} />
                        )}
                        {userId !== user.username && (
                            <ProfileCard user={user} deleteAccount={deleteAccount} isOwnProfile={false} />
                        )}
                    </article>

                </main>
            </div>
=======
                    <article className="p-10 h-[600px] w-[300px]  rounded-[10px] bg-[linear-gradient(to_bottom,_#1e3a8a,_#000_20%)]">
                        <ProfileCard user={user} isOwner={isOwner} />
                    </article>
                    
                </main>
            </div>

            {copied && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    <p className="text-sm">Profile link copied to clipboard!</p>
                </div>
            )}
>>>>>>> a4d0abba51074c2cf1d28cd37ffd2be11afd764a
        </>
    );
}

export default Profile;
