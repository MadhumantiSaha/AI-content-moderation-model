
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Post } from "@/types";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  className?: string;
}

const PostCard = ({ post, className }: PostCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
      <CardHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-medium">
              {post.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium">{post.username}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {post.image && (
          <div className="relative aspect-square w-full">
            <div className={cn("image-placeholder", imageLoaded ? "opacity-0" : "opacity-100")} />
            <img
              src={post.image}
              alt={post.caption}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-500",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        )}
        
        {post.video && (
          <div className="relative aspect-video w-full">
            <div className={cn("image-placeholder", videoLoaded ? "opacity-0" : "opacity-100")} />
            <video
              src={post.video}
              controls
              className={cn(
                "w-full h-full object-cover transition-opacity duration-500",
                videoLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoadedData={() => setVideoLoaded(true)}
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 flex flex-col items-start gap-2">
        <p className="text-sm font-medium">{post.caption}</p>
        <p className="text-xs text-muted-foreground">{post.createdAt}</p>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
