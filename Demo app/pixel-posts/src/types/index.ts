
export interface User {
  username: string;
  email: string;
  password: string;
}

export interface Post {
  id: string;
  username: string;
  caption: string;
  hashtags?: string[];
  image?: string;
  video?: string;
  createdAt: string;
}

export interface CreatePostData {
  username: string;
  caption: string;
  hashtags?: string[];
  image?: File;
  video?: File;
}
