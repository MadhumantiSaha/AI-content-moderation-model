
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, X } from "lucide-react";
import { CreatePostData } from "@/types";
import { toast } from "sonner";
import { createPost } from "@/utils/api";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
}

const CreatePostModal = ({ open, onOpenChange, username }: CreatePostModalProps) => {
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const [video, setVideo] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setVideo(undefined); // Clear video when image is selected
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideo(file);
      setImage(undefined); // Clear image when video is selected
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearMedia = () => {
    setImage(undefined);
    setVideo(undefined);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(undefined);
    }
  };

  const handleHashtagSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      e.preventDefault();
      const newHashtag = hashtagInput.trim().startsWith('#') 
        ? hashtagInput.trim() 
        : `#${hashtagInput.trim()}`;
      
      if (!hashtags.includes(newHashtag)) {
        setHashtags([...hashtags, newHashtag]);
      }
      setHashtagInput("");
    }
  };

  const removeHashtag = (hashtagToRemove: string) => {
    setHashtags(hashtags.filter(hashtag => hashtag !== hashtagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!caption) {
      toast.error("Please add a caption");
      return;
    }
    
    if (!image && !video) {
      toast.error("Please upload an image or video");
      return;
    }
    
    setLoading(true);
    
    const postData: CreatePostData = {
      username,
      caption,
      hashtags: hashtags.length > 0 ? hashtags : undefined,
      image,
      video,
    };
    
    try {
      const success = await createPost(postData);
      
      if (success) {
        toast.success("Post created successfully");
        resetForm();
        onOpenChange(false);
      } else {
        toast.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCaption("");
    setHashtags([]);
    setHashtagInput("");
    clearMedia();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share an image or video with your followers
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind?"
              className="resize-none min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="hashtags"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={handleHashtagSubmit}
                placeholder="Add hashtags (press Enter)"
              />
            </div>
            
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map((hashtag, index) => (
                  <div key={index} className="bg-muted px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                    <span>{hashtag}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeHashtag(hashtag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {previewUrl ? (
            <div className="relative rounded-md overflow-hidden border">
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 z-10"
                onClick={clearMedia}
              >
                <X className="h-4 w-4 text-white" />
              </Button>
              
              {image ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <video 
                  src={previewUrl} 
                  controls 
                  className="aspect-video w-full"
                />
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image" className="block mb-2">Image</Label>
                <Label 
                  htmlFor="image" 
                  className="border-2 border-dashed rounded-md p-4 h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors"
                >
                  <Image className="h-6 w-6 mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload image</span>
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              
              <div>
                <Label htmlFor="video" className="block mb-2">Video</Label>
                <Label 
                  htmlFor="video" 
                  className="border-2 border-dashed rounded-md p-4 h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors"
                >
                  <Video className="h-6 w-6 mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload video</span>
                </Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
