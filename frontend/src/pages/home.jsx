import Header from "../layouts/header";
import Aside from "../layouts/aside";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Heart, MessageSquare, Share2 } from "lucide-react";

const posts = [
  {
    id: 1,
    subreddit: "r/reactjs",
    user: "u/frontendDev",
    title: "¿Vale la pena aprender Vite?",
    image: "/default.png",
    likes: 207,
    comments: 18,
    time: "24/04/2025 16:33"
  },
  {
    id: 2,
    subreddit: "r/javascript",
    user: "u/jslover",
    title: "Mi setup para desarrollo web en 2025",
    image: "/default.png",
    likes: 233,
    comments: 75,
    time: "25/04/2025 08:51"
  },
  {
    id: 4,
    subreddit: "r/playrust",
    user: "@rustbuilder",
    title: "Check out my solo base design!",
    image: "/default.png",
    likes: 40,
    comments: 33,
    time: "18/04/2025 14:13"
  },
  {
    id: 3,
    subreddit: "r/webdev",
    user: "u/csswizard",
    title: "Tailwind CSS salvó mi vida (de maquetador)",
    image: "/default.png",
    likes: 31,
    comments: 41,
    time: "17/04/2025 18:15"
  },
  {
    id: 6,
    subreddit: "r/playrust",
    user: "@solo_survivor",
    title: "Defended a raid solo last night!",
    image: "/default.png",
    likes: 266,
    comments: 63,
    time: "12/04/2025 02:01"
  },
  {
    id: 5,
    subreddit: "r/rustbases",
    user: "@metalhead",
    title: "Is this honeycomb good enough?",
    image: "/default.png",
    likes: 133,
    comments: 52,
    time: "16/04/2025 05:53"
  }
];

function parseDateTime(dateTimeStr) {
  const [datePart, timePart] = dateTimeStr.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

function shuffleArray(arr) {
  return arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function groupPostsByWeek(posts) {
  const now = new Date();
  const weeks = new Map();

  posts.forEach(post => {
    const postDate = parseDateTime(post.time);
    const diffInDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));
    const week = Math.floor(diffInDays / 7); 

    if (!weeks.has(week)) {
      weeks.set(week, []);
    }
    weeks.get(week).push(post);
  });

  const orderedWeeks = [...weeks.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([_, posts]) => shuffleArray(posts)); 

  return orderedWeeks.flat(); 
}

function getRelativeTime(postDateStr) {
  const postDate = parseDateTime(postDateStr);
  const now = new Date();
  const diffMs = now - postDate;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "just now";
}

function Home() {
  const orderedPosts = groupPostsByWeek(posts);

  return (
    <>
      <Header />
      <Aside />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {orderedPosts.map((post, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">
                <span className="font-medium text-white">{post.subreddit}</span> • {getRelativeTime(post.time)} • {post.user}
              </div>
              <h2 className="text-lg font-semibold mb-3">{post.title}</h2>
              <img
                src={post.image}
                alt="post"
                className="rounded-lg border border-muted shadow mb-3 w-full object-cover"
              />
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

export default Home;