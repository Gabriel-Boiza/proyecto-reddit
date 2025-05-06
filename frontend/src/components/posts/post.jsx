import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Heart, MessageSquare, Share2 } from "lucide-react";

function Post() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground mb-1">
          <span className="font-medium text-white">r/exampleSubreddit</span> • 3 hours ago • u/exampleUser
        </div>
        <h2 className="text-lg font-semibold mb-3">Este es un post de ejemplo en un componente</h2>
        <img
          src="/default.png"
          alt="post"
          className="rounded-lg border border-muted shadow mb-3 w-full object-cover"
        />
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>123</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
            <MessageSquare className="w-4 h-4" />
            <span>45</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default Post;
