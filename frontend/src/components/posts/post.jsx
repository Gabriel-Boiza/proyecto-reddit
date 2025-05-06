import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Heart, MessageSquare } from "lucide-react";

function Post({ post }) {
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
            src="/default.png"
            alt="post"
            className="rounded-lg border border-muted shadow mb-3 w-full object-cover"
          />
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{post.votes.upvotes.length}</span>
            </Button>
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
