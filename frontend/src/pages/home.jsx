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
  <div className="min-h-screen bg-[#14181a]">
    <Header />
    <div className="pt-16"> {/* Add padding-top to account for fixed header */}
      <Aside />
      <div className="flex justify-center">
        <div className="w-full md:pl-80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
            {/* Main content column for posts */}
            <div className="md:col-span-2 space-y-6 py-6">
              {posts.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </div>
            {/* FollowList column */}
            {isAuth && (
              <div className="py-6 sticky top-20 h-fit hidden md:block">
                <FollowList />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default Home;
