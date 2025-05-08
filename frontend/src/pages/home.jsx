import Header from "../layouts/header";
import Aside from "../layouts/aside";
import Post from "../components/posts/post";
import axios from "axios";
import { useEffect, useState } from "react";
import { domain } from "../context/domain";

function Home() {
  const [posts, setPosts] = useState([]);

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
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </>
  );
}

export default Home;
