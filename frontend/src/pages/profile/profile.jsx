import Header from "../../layouts/header";
import Aside from "../../layouts/aside";

import { useAuth } from "../../context/authContext";
// Posts map
import PostList from "../../components/profile/postList";
import UpvotedPostList from "../../components/profile/upvotedPostList";
import DownvotedPostList from "../../components/profile/downvotedPostList";
import CommentedPostList from "../../components/profile/commentedPostList";
import FollowersList from "../../components/profile/FollowersList";
import FollowingList from "../../components/profile/FollowingList";
// Card perfil
import ProfileCard from "../../components/profile/profileCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { domain } from "../../context/domain";
import { Plus, ThumbsUp, ThumbsDown, Trash, UserPlus, UserMinus, Users, UserCheck, MessageSquare } from "lucide-react";
import { Tab } from "@headlessui/react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';



function Profile({isOwner}) {
    const [user, setUser] = useState({
        username: "",
        name: "",
        age: 0,
        postCount: 0,
        commentCount: 0,
        upvotes: 0,
        downvotes: 0,
        profileImage: ""
    });

    const {logout, isAuth} = useAuth()
    const {username} = useParams()
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [copied, setCopied] = useState(false);
    const [comments, setComments] = useState([]);
    const [upvotedPosts, setUpvotedPosts] = useState([]);
    const [downvotedPosts, setDownvotedPosts] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        if (!isAuth && !username) {
            navigate("/login");
            return;
        }
        
        const loadProfileData = async () => {
            await Promise.all([
                userData(),
                userPosts(),
                fetchUserInteractions(),
                fetchFollowers(),
                fetchFollowing(),
                checkFollowStatus()
            ]);
        };

        loadProfileData();
    }, [isAuth, username]); // Agregamos username como dependencia
    
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

    const fetchFollowers = async () => {
        try {
            let response;
            if (isOwner) {
                // Ruta para obtener seguidores del usuario autenticado
                response = await axios.get(`${domain}getFollowers`, { withCredentials: true });
            } else {
                // Ruta para obtener seguidores de otro usuario por nombre de usuario
                response = await axios.get(`${domain}getFollowers/${username}`, { withCredentials: true });
            }
            
            if (response.data && response.data.followers) {
                setFollowers(response.data.followers);
            }
        } catch (error) {
            console.error("Error fetching followers:", error.response?.data?.message);
        
        }
    };
    
    const fetchFollowing = async () => {
        try {
            let response;
            if (isOwner) {
                // Ruta para obtener usuarios seguidos por el usuario autenticado
                response = await axios.get(`${domain}getFollowedUsers`, { withCredentials: true });
            } else {
                // Ruta para obtener usuarios seguidos por otro usuario por nombre de usuario
                response = await axios.get(`${domain}getFollowedUsers/${username}`, { withCredentials: true });
            }
            
            if (response.data && response.data.following) {
                setFollowing(response.data.following || []);
            }
        } catch (error) {
            console.error("Error fetching following:", error.response?.data?.message);
        }
    };

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
                downvotes: providedUser.downvotes,
                profileImage: providedUser.profileImage
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

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(post => post._id !== postId));
    };

    const checkFollowStatus = async () => {
        try {
            if (!isOwner && isAuth) {
                const response = await axios.get(`${domain}checkFollowStatus/${username}`, { withCredentials: true });
                setIsFollowing(response.data.isFollowing);
            }
        } catch (error) {
            console.error("Error checking follow status:", error.response?.data?.message);
        }
    };

    const handleFollowAccount = async () => {
        try {
            if (isFollowing) {
                await axios.post(`${domain}unfollowUser/${username}`, {}, { withCredentials: true });
                setIsFollowing(false);
                Swal.fire({
                    title: 'Unfollowed',
                    text: `You have unfollowed ${username}`,
                    icon: 'info',
                    background: '#1e293b',
                    color: '#f97316',
                    confirmButtonColor: '#f97316',
                    timer: 2000,
                    timerProgressBar: true,
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false
                });
            } else {
                await axios.post(`${domain}followUser/${username}`, {}, { withCredentials: true });
                setIsFollowing(true);
                Swal.fire({
                    title: 'Following',
                    text: `You are now following ${username}`,
                    icon: 'success',
                    background: '#1e293b',
                    color: '#f97316',
                    confirmButtonColor: '#f97316',
                    timer: 2000,
                    timerProgressBar: true,
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update follow status',
                icon: 'error',
                background: '#1e293b',
                color: '#f97316',
                confirmButtonColor: '#f97316'
            });
        }
    };

    const handleMessageUser = () => {
        navigate(`/chat/${username}`);
    };

    const deleteAccount = () => {
        Swal.fire({
          title: 'Are you sure?',
          text: "This will permanently delete your account!",
          icon: 'warning',
          background: '#1e293b', // fondo oscuro
          color: '#f97316',      // texto naranja
          showCancelButton: true,
          confirmButtonColor: '#f97316', // naranja
          cancelButtonColor: '#374151',  // gris oscuro
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel',
          reverseButtons: true,
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await axios.delete(`${domain}deleteAccount`, { withCredentials: true });
      
              Swal.fire({
                title: 'Deleted!',
                text: 'Your account has been deleted.',
                icon: 'success',
                background: '#1e293b',
                color: '#f97316',
                confirmButtonColor: '#f97316',
              }).then(() => {
                logout()
                window.location.href = '/login';
              });
      
            } catch (error) {
              Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'Failed to delete account',
                icon: 'error',
                background: '#1e293b',
                color: '#f97316',
                confirmButtonColor: '#f97316',
              });
            }
          }
        });
      };
      
      

    return (
        <div className="min-h-screen bg-[#14181a]">
            <Header />
            <div className="pt-16"> {/* Add padding-top for fixed header */}
                <Aside />
                <div className="flex flex-col md:flex-row">
                    <main className="content w-full p-4 md:ml-80">
                        <div className="grid grid-cols-1 lg:grid-cols-[5fr_2fr] gap-6">
                            <section className="flex flex-col w-full">
                                <div className="flex flex-col md:flex-row px-4 md:px-12 gap-6 items-start md:items-center">
                                    <img
                                        className="w-20 h-20 md:w-18 md:h-18 rounded-full"
                                        src={
                                            user.profileImage
                                            ? `${domain}uploads/${user.profileImage}`
                                            : "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png"
                                        }
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png";
                                        }}
                                        alt=""
                                    />
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-2xl md:text-3xl font-bold text-[#B7CAD4]">{user.username}</h2>
                                        <h2 className="text-md md:text-lg text-[#8BA2AD]">{user.name}</h2>
                                    </div>
                                    
                                    {!isOwner && isAuth && (
                                        <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0 md:ml-auto w-full md:w-auto">
                                            <button 
                                                onClick={handleMessageUser}
                                                className="w-full md:w-auto px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-all duration-300 
                                                    bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <MessageSquare size={18} />
                                                <span>Message</span>
                                            </button>
                                            
                                            <button 
                                                onClick={handleFollowAccount}
                                                className={`w-full md:w-auto px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-all duration-300 ${
                                                    isFollowing 
                                                    ? 'bg-gray-700 hover:bg-red-700 text-white' 
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                            >
                                                {isFollowing ? (
                                                    <>
                                                        <UserMinus size={18} />
                                                        <span>Unfollow</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus size={18} />
                                                        <span>Follow</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <Tab.Group className="w-full">
                                    <Tab.List className="relative flex overflow-x-auto space-x-2 md:space-x-4 mt-6 bg-gray-800 p-1 rounded-lg no-scrollbar">
                                        <Tab
                                            className={({ selected }) =>
                                                `relative z-10 py-2 px-3 md:px-4 text-xs md:text-sm font-medium rounded-md transition-all duration-300 outline-none whitespace-nowrap
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
                                        <Tab
                                            className={({ selected }) =>
                                                `relative z-10 py-2 px-4 text-sm font-medium rounded-md transition-all duration-300 outline-none
                                                ${selected
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-gray-300 hover:text-white hover:bg-gray-700'}`
                                            }
                                        >
                                            <div className="flex items-center gap-1">
                                                <Users size={14} />
                                                <span>Followers</span>
                                            </div>
                                        </Tab>
                                        <Tab
                                            className={({ selected }) =>
                                                `relative z-10 py-2 px-4 text-sm font-medium rounded-md transition-all duration-300 outline-none
                                                ${selected
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-gray-300 hover:text-white hover:bg-gray-700'}`
                                            }
                                        >
                                            <div className="flex items-center gap-1">
                                                <UserCheck size={14} />
                                                <span>Following</span>
                                            </div>
                                        </Tab>
                                    </Tab.List>

                                    <Tab.Panels className="mt-4 max-h-[650px] overflow-y-auto pr-2 scrollPosts">
                                        
                                        <Tab.Panel>
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
                                        </Tab.Panel>

                                        <Tab.Panel>
                                            <div className="max-h-[600px] overflow-y-auto pr-2">
                                                <FollowersList followers={followers} />
                                            </div>
                                        </Tab.Panel>

                                        <Tab.Panel>
                                            <div className="max-h-[600px] overflow-y-auto pr-2">
                                                <FollowingList following={following} />
                                            </div>
                                        </Tab.Panel>

                                    </Tab.Panels>
                                </Tab.Group>
                            </section>

                            <article className="p-6 md:p-10 max-h-[620px] w-full lg:w-[300px] rounded-[10px] bg-[linear-gradient(to_bottom,_#1e3a8a,_#000_20%)] mt-6 lg:mt-0">
                                <ProfileCard user={user} isOwner={isOwner} deleteAccount={deleteAccount} />
                            </article>
                            
                        </div>
                    </main>
                </div>
            </div>

            {copied && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    <p className="text-sm">Profile link copied to clipboard!</p>
                </div>
            )}
        </div>
    );
}

export default Profile;