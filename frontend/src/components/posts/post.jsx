import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";
import { useState } from "react";

function Post({ post }) {

  const [counter, setCounter] = useState(post.votes.upvotes.length - post.votes.downvotes.length)

  const handleUpVote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCounter(prev => prev + 1)
    console.log("Upvote");
  };

  const handleDownVote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCounter(prev => prev - 1)
    console.log("Downvote");
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
            src={post?.file_url ? `http://localhost:3000/uploads/${post.file_url}` : '/default.png'}
            alt="post"
            className="rounded-lg border border-muted shadow mb-3 w-full object-cover"
          />

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUpVote}
                className="p-1"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <span>{counter}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownVote}
                className="p-1"
              >
                <ArrowDown className="w-4 h-4" />
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
