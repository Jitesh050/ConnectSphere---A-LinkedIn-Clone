
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { User, Post } from '../types';
import PostCard from '../components/PostCard';
import { UserIcon } from '../components/Icons';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const context = useContext(AppContext);
  
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId || !context) return;
      setIsLoading(true);
      try {
        const user = await context.getUser(userId);
        const posts = await context.getPostsByUser(userId);
        setProfileUser(user || null);
        setUserPosts(posts);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [userId, context]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profileUser) {
    return <div className="text-center py-10">User not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
        <div className="relative">
          <div className="h-24 bg-gray-200 -mx-6 -mt-6"></div>
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white absolute -bottom-12 left-6">
            <UserIcon className="w-16 h-16 text-gray-500" />
          </div>
        </div>
        <div className="mt-16 p-6">
          <h1 className="text-3xl font-bold text-gray-800">{profileUser.name}</h1>
          <p className="text-md text-gray-500">{profileUser.email}</p>
          <div className="border-t mt-4 pt-4">
            <p className="text-sm text-gray-600 font-medium">
              {userPosts.length} post{userPosts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Posts</h2>
      <div>
        {userPosts.length > 0 ? (
          userPosts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center text-gray-500 bg-white p-6 rounded-lg shadow-sm">
            <p>{profileUser.name} hasn't posted anything yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
