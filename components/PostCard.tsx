
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { AppContext } from '../contexts/AppContext';
import { HeartIcon, PencilIcon, TrashIcon, UserIcon, HeartFilledIcon } from './Icons';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const context = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(post.text);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUser = context?.currentUser;
  const isOwner = currentUser?.id === post.userId;
  const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;

  const handleLike = () => {
    context?.toggleLike(post.id);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await context?.deletePost(post.id);
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post.');
      }
    }
    setIsDeleting(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if(editedText.trim() === post.text.trim()) {
        setIsEditing(false);
        return;
    }
    try {
        await context?.updatePost(post.id, editedText);
        setIsEditing(false);
    } catch (error) {
        console.error('Failed to update post:', error);
        alert('Failed to update post.');
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center mb-3">
          <Link to={`/profile/${post.userId}`} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <UserIcon className="w-6 h-6 text-gray-500" />
          </Link>
          <div>
            <Link to={`/profile/${post.userId}`} className="font-semibold text-gray-800 hover:underline">{post.userName}</Link>
            <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        {isOwner && (
          <div className="flex items-center space-x-2">
            <button onClick={() => setIsEditing(!isEditing)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <PencilIcon className="w-5 h-5" />
            </button>
            <button onClick={handleDelete} disabled={isDeleting} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 disabled:opacity-50">
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate}>
            <textarea 
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full border rounded-md p-2 mb-2"
                rows={3}
            />
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1 bg-gray-200 rounded-md text-sm font-medium">Cancel</button>
                <button type="submit" className="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium">Save</button>
            </div>
        </form>
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap my-3">{post.text}</p>
      )}

      {post.imageUrl && (
        <div className="mt-3 -mx-4">
            <img src={post.imageUrl} alt="Post content" className="w-full h-auto max-h-96 object-contain bg-gray-100" />
        </div>
      )}

      <div className="border-t mt-4 pt-2 flex items-center space-x-4">
        <button onClick={handleLike} className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-200">
          {isLiked ? <HeartFilledIcon className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5" />}
          <span className="text-sm font-medium">{post.likes.length > 0 ? `${post.likes.length} Like${post.likes.length > 1 ? 's' : ''}` : 'Like'}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
