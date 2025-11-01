export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
  likes: string[]; // Array of user IDs who liked the post
}

export interface Comment {
  id:string;
  postId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}
