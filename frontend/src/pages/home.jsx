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
  const { isAuth } = useAuth();

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
    <Aside />
    <div className="flex justify-center">
      <div className="w-full sm:pl-80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-2 sm:px-4">
          {/* Columna 2/3 para posts */}
          <div className="md:col-span-2 space-y-6 py-6">
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
          {/* Columna 1/3 para FollowList (si está autenticado) */}
          {isAuth && (
            <div className="py-6 sticky top-16 h-fit hidden md:block">
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
