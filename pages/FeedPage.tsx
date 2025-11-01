import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import CreatePostForm from '../components/CreatePostForm';
import PostCard from '../components/PostCard';

const FeedPage: React.FC = () => {
  const context = useContext(AppContext);

  const filteredPosts = context?.posts.filter(post => 
    post.text.toLowerCase().includes(context?.searchQuery.toLowerCase() ?? '')
  ) ?? [];

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <CreatePostForm />
      <div>
        {filteredPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        {filteredPosts.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            {context?.searchQuery ? (
              <p>No posts match your search for "{context.searchQuery}".</p>
            ) : (
              <p>No posts yet. Be the first to share something!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
