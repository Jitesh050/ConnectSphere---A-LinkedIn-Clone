
import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { PhotoIcon, UserIcon } from './Icons';

const CreatePostForm: React.FC = () => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const context = useContext(AppContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      alert('Post content cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    try {
      await context?.createPost(text, imageFile || undefined);
      setText('');
      removeImage();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-6 h-6 text-gray-500" />
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start a post"
            className="w-full border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out resize-none"
            rows={3}
          />
          {imagePreview && (
            <div className="mt-2 relative">
                <img src={imagePreview} alt="Preview" className="rounded-lg max-h-48 w-auto"/>
                <button onClick={removeImage} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 text-xs">✕</button>
            </div>
          )}
          <div className="mt-3 flex justify-between items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 text-gray-500 hover:text-primary transition-colors"
            >
              <PhotoIcon className="w-6 h-6" />
              <span className="text-sm font-medium">Photo</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              className="bg-primary text-white font-semibold py-2 px-5 rounded-full hover:bg-primary-focus disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;
