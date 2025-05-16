import Header from "../layouts/header";
import Aside from "../layouts/aside";
import Post from "../components/posts/post";
import axios from "axios";
import { useEffect, useState } from "react";
import { domain } from "../context/domain";
import FollowList from "../components/follows/FollowList";
import { useAuth } from "../context/authContext";

function Home() {
  const [posts, setPosts] = useState([]);

  const {isAuth} = useAuth()
  
  useEffect(() => {
    postsData();
  }, []);
  
  const postsData = async () => {
    try {
      const response = await axios.get(`${domain}getAllPosts`, {
        withCredentials: true,
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  
  return (
    <>
      <Header />
      <div className="flex">
        <Aside />
        <div className="flex-1 flex justify-center">
          {/* Contenedor principal con flex para posts y followList */}
          <div className="flex max-w-6xl w-full gap-6 px-4">
            {/* Columna izquierda para posts */}
            <div className="flex-1 max-w-4xl space-y-6 py-6">
              {posts.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </div>
            
            {isAuth && (
              <div className="w-72 py-6 sticky top-16 h-fit">
              <FollowList />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;