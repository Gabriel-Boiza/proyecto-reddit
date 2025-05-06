import Header from "../../layouts/header"
import Aside from "../../layouts/aside"
import axios from "axios"
import { useEffect, useState } from "react"

function Profile() {

    const [user, setUser] = useState({
        username: "",
        name: "",
        age: 0,
        posts: [],
        comments: []
    })

    useEffect(() => {
        userData() 
    }, [])
 
    const userData = () => {
        axios.get("http://localhost:3000/getUserByCookie", {withCredentials: true})
        .then(response => {
            const providedUser = response.data.user
            setUser(prevUser => ({
                ...prevUser, 
                username: providedUser.username ,
                name: providedUser.name,
                age: providedUser.age,
                posts: providedUser.posts,
                comments: providedUser.comments
            }));
            
        })
        .catch(error => {
            console.log( error.response?.data?.message)
        })
    }


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
                    </section>
                    
                    <article className="rounded-[10px] bg-[linear-gradient(to_bottom,_#1e3a8a,_#000_20%)] max-h-[70%]">
                        
                    </article>


                </main>
            </div>
        </>
    )
}

export default Profile
