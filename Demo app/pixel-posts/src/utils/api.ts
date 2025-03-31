
import { CreatePostData } from "@/types";

export const createPost = async (postData: CreatePostData): Promise<boolean> => {
  try {
    const formData = new FormData();
    
    formData.append("username", postData.username);
    formData.append("caption", postData.caption);
    
    if (postData.hashtags && postData.hashtags.length > 0) {
      formData.append("hashtags", JSON.stringify(postData.hashtags));
    }
    
    if (postData.image) {
      formData.append("image", postData.image);
    }
    
    if (postData.video) {
      formData.append("video", postData.video);
    }
    
    const response = await fetch("http://localhost:8000/check_content", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error creating post:", error);
    return false;
  }
};
