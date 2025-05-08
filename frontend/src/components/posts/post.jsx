import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import axios from "axios"
import { domain } from "../../context/domain";
function Post({ post }) {

  const [counter, setCounter] = useState(post.votes.upvotes.length - post.votes.downvotes.length)
  const [voteState, setVoteState] = useState(0) //0 no ha votado, 1 like, -1 dislike
  const {isAuth} = useAuth()

  const handleUpVote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(!isAuth){
      alert("Need to be logged")
      return
    }
    try {
      const response = await axios.post(`${domain}upvote`, {post_id: post._id}, {withCredentials: true});

      setCounter(prev => prev + response.data.number)
      setVoteState(response.data.voteState)
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownVote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(!isAuth){
      alert("Need to be logged")
      return
    }
    try {
      const response = await axios.post(`${domain}downvote`, {post_id: post._id}, {withCredentials: true});

      setCounter(prev => prev + response.data.number)
      setVoteState(response.data.voteState)
    } catch (error) {
      console.log(error);      
    }
  };


  useEffect(() => {
    if (!isAuth) return; 
    axios.post(`${domain}getVoteState`, {post_id: post._id}, {withCredentials: true})
    .then(response => {
      console.log(response.data.voteState);
      setVoteState(response.data.voteState)
    })
    .catch(error => {
      console.log(error);
    })
  }, [])


  // Get the appropriate background color based on voteState
  const getVoteContainerClass = () => {
    const baseClasses = "flex items-center space-x-1 rounded-md transition-colors duration-200 px-2 py-1";
    
    if (voteState === 1) {
      return `${baseClasses} bg-orange-500`; 
    } else if (voteState === -1) {
      return `${baseClasses} bg-purple-500`;
    } else {
      return baseClasses;
    }
  };

  return (
    <Link to={`/post/${post._id}`} className="block">
      <Card className="bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors duration-200 cursor-pointer">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground mb-1">
            <span className="font-medium text-white">
              {post.user_id?.username ?? "Anon"}
            </span>{" "}
            •{" "}
            {new Date(post.created_at).toLocaleString([], {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <h2 className="text-lg font-semibold">{post.title}</h2>
          <p className="text-sm text-gray-400 mb-3">{post.description}</p>
          <img
            src={post?.file_url ? `${domain}uploads/${post.file_url}` : '/default.png'}
            alt="post"
            className="rounded-lg border border-muted shadow mb-3 w-full object-cover"
          />

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className={getVoteContainerClass()}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpVote}
              className={`p-1 ${voteState === 1 ? "text-orange-500" : ""} cursor-pointer`}
            >
              <ArrowUp className="w-4 h-4 text-white font-bold" />
            </Button>
              <span>{counter}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownVote}
                className={`p-1 ${voteState === -1 ? "text-purple-500" : ""} cursor-pointer`}
              >
                <ArrowDown className="w-4 h-4 text-white" />
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{post.comments.length}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default Post;