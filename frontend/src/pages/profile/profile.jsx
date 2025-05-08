import Header from "../../layouts/header"
import Aside from "../../layouts/aside"
import ProfilePost from "../../components/posts/profilePost"
import axios from "axios"
import { useEffect, useState } from "react"
import { domain } from "../../context/domain"
function Profile() {

    const [user, setUser] = useState({
        username: "",
        name: "",
        age: 0,
        posts: [],
        comments: []
    })

    const [posts, setPosts] = useState([])

    useEffect(() => {
        userData() 
        userPosts()
    }, [])
 
    const userData = async () => {
        try {
            const response = await axios.get(`${domain}getUserByCookie`, { withCredentials: true });
            const providedUser = response.data.user;
            setUser(prevUser => ({
                ...prevUser,
                username: providedUser.username,
                name: providedUser.name,
                age: providedUser.age,
                posts: providedUser.posts,
                comments: providedUser.comments
            }));
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

    return (
        <>
            <Header />
            <div className="flex">
                <Aside />
                <main className="content grid grid-cols-[5fr_2fr] min-w-[60%] max-w-[70%] gap-6 mx-auto p-4 ">
                    <section className="flex flex-col"> 
                        <div className="flex px-12 gap-6">
                            <img className="w-18 rounded-full" src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png" alt="" />
                            <div className="flex flex-col gap-1">
                                <h2 className="text-3xl font-bold text-[#B7CAD4]">{user.username}</h2>
                                <h2 className="text-lg text-[#8BA2AD]">{user.name}</h2>
                            </div>
                        </div>

                        <div className="mt-6">
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <ProfilePost post={post}/>
                                ))
                            ) : (
                                <p className="text-gray-500">No posts to show</p>
                            )}
                        </div>
                    </section>
                    
                    <article className="p-10 rounded-[10px] bg-[linear-gradient(to_bottom,_#1e3a8a,_#000_20%)] max-h-[70%]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white font-bold">{user.username}</h2>

                        </div>

                        <div className="mb-4">
                            <h3 className="text-xs font-bold text-gray-400 mb-2">SETTINGS</h3>
                            
                            <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <div className="bg-cyan-500 rounded-full w-6 h-6 flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-white mb-1"></div>
                                <div className="w-4 h-2 rounded-t-full bg-white absolute mt-3"></div>
                                </div>
                                <div>
                                <p className="text-white text-sm">Profile</p>
                                <p className="text-xs">Customize your profile</p>
                                </div>
                            </div>
                            <button className="bg-gray-700 text-white text-xs rounded-full px-3 py-1">Update</button>
                            </div>
                            
                        </div>

                    </article>
                </main>
            </div>
        </>
    )
}

export default Profile;
