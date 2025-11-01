import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { User, Post } from '../types';
import * as api from '../services/api';
import { LoginCredentials, SignupData } from '../services/api';

interface AppContextType {
  currentUser: User | null;
  posts: Post[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  createPost: (text: string, imageFile?: File) => Promise<void>;
  updatePost: (postId: string, text: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  initialize: () => void;
  getUser: (userId: string) => Promise<User | undefined>;
  getPostsByUser: (userId: string) => Promise<Post[]>;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = useCallback(async () => {
    try {
      const fetchedPosts = await api.getPosts();
      setPosts(fetchedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      // Handle error appropriately, e.g., show a toast notification
    }
  }, []);

  const initialize = useCallback(async () => {
    setIsLoading(true);
    const user = await api.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      await fetchPosts();
    }
    setIsLoading(false);
  }, [fetchPosts]);

  const login = async (credentials: LoginCredentials) => {
    const user = await api.login(credentials);
    setCurrentUser(user);
    await fetchPosts();
  };

  const signup = async (data: SignupData) => {
    const user = await api.signup(data);
    setCurrentUser(user);
    // No need to fetch posts, as a new user has none
    setPosts([]);
  };

  const logout = () => {
    api.logout();
    setCurrentUser(null);
    setPosts([]);
  };

  const createPost = async (text: string, imageFile?: File) => {
    if (!currentUser) throw new Error("User not logged in");
    await api.createPost({ text, imageFile });
    await fetchPosts(); // Refetch to get the new post from the server
  };

  const updatePost = async (postId: string, text: string) => {
    const updatedPost = await api.updatePost(postId, { text });
    setPosts(prevPosts =>
      prevPosts.map(p => (p.id === postId ? updatedPost : p))
    );
  };

  const deletePost = async (postId: string) => {
    await api.deletePost(postId);
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
  };

  const toggleLike = async (postId: string) => {
    const updatedPost = await api.toggleLike(postId);
    setPosts(prevPosts =>
      prevPosts.map(p => (p.id === postId ? updatedPost : p))
    );
  };

  const getUser = async (userId: string) => {
    return api.getUser(userId);
  };

  const getPostsByUser = async (userId: string) => {
    const userPosts = await api.getPostsByUser(userId);
    return userPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };


  const value = {
    currentUser,
    posts,
    isLoading,
    searchQuery,
    setSearchQuery,
    login,
    signup,
    logout,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    initialize,
    getUser,
    getPostsByUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
