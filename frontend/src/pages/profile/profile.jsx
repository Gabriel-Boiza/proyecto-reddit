import Header from "../../layouts/header";
import Aside from "../../layouts/aside";

import { useAuth } from "../../context/authContext";
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
import { Plus, ThumbsUp, ThumbsDown, Trash } from "lucide-react";
import { Tab } from "@headlessui/react";
import { Link, useParams } from "react-router-dom";
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

    const {logout} = useAuth()
    const {username} = useParams()

    const [posts, setPosts] = useState([]);
    const [copied, setCopied] = useState(false);
    const [comments, setComments] = useState([]);
    const [upvotedPosts, setUpvotedPosts] = useState([]);
    const [downvotedPosts, setDownvotedPosts] = useState([]);
    
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
        console.log(username)
        userData();
        userPosts();
        fetchUserInteractions();
        console.log(`${domain}uploads/${user.profileImage}`)
    }, []);
    

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
                // Redirige sin librerías
                logout()
                window.location.href = '/';
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
        <>
            <Header />
            <Aside />
            <div className="flex">
                <main className="content grid grid-cols-[5fr_2fr] gap-6 mx-auto p-4 ml-80 w-[100%]">
                    <section className="flex flex-col w-[100%]">
                        <div className="flex px-12 gap-6">
                            <img className="w-18 rounded-full" 
                              src={
                                    user.profileImage != ""
                                    ? `${domain}uploads/${user.profileImage}`
                                    : "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png"
                                }
                            alt=""
                             />
                            <div className="flex flex-col gap-1">
                                <h2 className="text-3xl font-bold text-[#B7CAD4]">{user.username}</h2>
                                <h2 className="text-lg text-[#8BA2AD]">{user.name}</h2>
                            </div>
                        </div>

                        <Tab.Group className="w-[100%]">
                            <Tab.List className="relative flex space-x-4 mt-6 bg-gray-800 p-1 rounded-lg">
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

                            </Tab.Panels>
                        </Tab.Group>
                    </section>

                    <article className="p-10 h-[600px] w-[300px]  rounded-[10px] bg-[linear-gradient(to_bottom,_#1e3a8a,_#000_20%)]">
                        <ProfileCard user={user} isOwner={isOwner} deleteAccount={deleteAccount} />
                    </article>
                    
                </main>
            </div>

            {copied && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    <p className="text-sm">Profile link copied to clipboard!</p>
                </div>
            )}
        </>
    );
}

export default Profile;
