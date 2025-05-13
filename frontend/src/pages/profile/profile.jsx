import Header from "../../layouts/header";
import Aside from "../../layouts/aside";

// Posts map
import PostList from "../../components/profile/postList";
import UpvotedPostList from "../../components/profile/upvotedPostList";
import DownvotedPostList from "../../components/profile/downvotedPostList";
import CommentedPostList from "../../components/profile/commentedPostList";

// Card perfil
import ProfileCard from "../../components/profile/profileCard";

import axios from "axios";
import { useEffect, useState } from "react";
import { domain } from "../../context/domain";
import Swal from 'sweetalert2';
import { useAuth } from '../../context/authContext.js';
import { useParams } from "react-router-dom";
import { Tab } from "@headlessui/react";

function Profile() {
    const { userId } = useParams();    
    const { logout } = useAuth();

    const [user, setUser] = useState({});
    const [authUser, setAuthUser] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [upvotedPosts, setUpvotedPosts] = useState([]);
    const [downvotedPosts, setDownvotedPosts] = useState([]);

    // Obtener usuario autenticado para comparar
    const fetchAuthUser = async () => {
        try {
            const res = await axios.get(`${domain}getUserByCookie`, { withCredentials: true });
            setAuthUser(res.data.user);  // Este usuario debe tener el campo _id
        } catch (error) {
            console.error("Error getting logged in user:", error.response?.data?.message);
        }
    };
    
    

    const fetchUserData = async (targetUserId) => {
        const endpoint = targetUserId
            ? `${domain}getUserProfileById/${targetUserId}`
            : `${domain}getUserByCookie`;
    
        const res = await axios.get(endpoint, { withCredentials: true });
        
        // Devuelve todos los datos (user, posts, likes, comments, etc.)
        return res.data;
    };
    
    const fetchUserPosts = async (isOwner, targetUserId) => {
        try {
            const endpoint = isOwner
                ? `${domain}getPostsByCookie`
                : `${domain}getPostsByUserId/${targetUserId}`;

            const res = await axios.get(endpoint, { withCredentials: true });
            setPosts(res.data.posts);
            console.log(endpoint);
        } catch (error) {
            console.error("Error fetching posts:", error.response?.data?.message);
        }
    };

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
        console.log("UserId:", userId);  // Verifica si el userId es correcto
    
        const loadData = async () => {
            const targetUserId = userId || null;  // Si userId no está disponible, será null
    
            const auth = await axios.get(`${domain}getUserByCookie`, { withCredentials: true });
            const authUserData = auth.data.user;
            console.log("Auth User:", authUserData);  // Verifica si el usuario autenticado es correcto
            setAuthUser(authUserData);
    
            // Obtener los datos del perfil
            const profileData = await fetchUserData(targetUserId);
            const profileUser = profileData.user;
            console.log("Profile User:", profileUser);  // Verifica si el usuario del perfil es correcto
    
            // Comprobación si el perfil es el mismo que el usuario autenticado
            const sameUser = profileUser?._id === authUserData?._id;
            console.log("Is Same User:", sameUser);  // Verifica la comparación entre los usuarios
    
            setIsOwnProfile(sameUser);  // Establece si el perfil es el mismo
            setUser(profileUser);
    
            // Fetch posts dependiendo si es el perfil del usuario autenticado
            await fetchUserPosts(sameUser, targetUserId);
    
            if (sameUser) {
                await fetchUserInteractions();
            } else {
                setComments(profileData.comments || []);
                setUpvotedPosts(profileData.likedPosts || []);
                setDownvotedPosts(profileData.dislikedPosts || []);
            }
        };
    
        loadData();
    }, [userId]);
    
    
    
    
    
    console.log(userId);

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

                        <Tab.Group className="w-full">
                            <Tab.List className="relative flex space-x-4 mt-6 bg-gray-800 p-1 rounded-lg">
                                {['Posts', 'Upvoted', 'Downvoted', 'Comments'].map((tab) => (
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
                                    <PostList posts={posts} onDelete={handleDeletePost} />
                                </Tab.Panel>

                                <Tab.Panel>
                                    <UpvotedPostList upvotedPosts={upvotedPosts} />
                                </Tab.Panel>

                                <Tab.Panel>
                                    <DownvotedPostList downvotedPosts={downvotedPosts} />
                                </Tab.Panel>

                                <Tab.Panel>
                                    <CommentedPostList comments={comments} />
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </section>

                    <article className="p-10 h-[600px] w-[300px] rounded-[10px] bg-[linear-gradient(to_bottom,_#1e3a8a,_#000_20%)]">
                        <ProfileCard
                            user={user}
                            deleteAccount={deleteAccount}
                        />
                    </article>
                </main>
            </div>
        </>
    );
}

export default Profile;
