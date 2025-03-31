
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import SignupForm from "@/components/SignupForm";
import CreatePostButton from "@/components/CreatePostButton";
import CreatePostModal from "@/components/CreatePostModal";
import { User, Post } from "@/types";

// Sample dummy posts
const dummyPosts: Post[] = [
  {
    id: "1",
    username: "sarah_design",
    caption: "Exploring minimalist design patterns",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    createdAt: "2 hours ago"
  },
  {
    id: "2",
    username: "travel_mike",
    caption: "Sunset views from my latest adventure",
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    createdAt: "5 hours ago"
  },
  {
    id: "3",
    username: "tech_enthusiast",
    caption: "Check out this cool new gadget",
    video: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smart-watch-with-the-stopwatch-running-32808-large.mp4",
    createdAt: "Yesterday"
  },
  {
    id: "4",
    username: "food_lover",
    caption: "Homemade pasta - so delicious!",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    createdAt: "2 days ago"
  }
];

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  
  const handleSignup = (newUser: User) => {
    setUser(newUser);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
        <SignupForm onSignup={handleSignup} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="container max-w-4xl pt-24 px-4">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-medium">Welcome, {user.username}</h1>
          <p className="text-muted-foreground mt-1">Your feed</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dummyPosts.map((post) => (
            <PostCard key={post.id} post={post} className="animate-fade-in" />
          ))}
        </div>
        
        <div className="my-8 text-center text-sm text-muted-foreground">
          <p>End of feed</p>
        </div>
      </main>
      
      <CreatePostButton 
        onClick={() => setIsCreatePostOpen(true)} 
      />
      
      <CreatePostModal 
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
        username={user.username}
      />
    </div>
  );
};

export default Index;
