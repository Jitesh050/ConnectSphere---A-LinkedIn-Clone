const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');
const User = require('../models/userModel');

const formatPost = (post) => {
    return {
        id: post._id,
        text: post.text,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        likes: post.likes,
        userId: post.user._id,
        userName: post.user.name,
    }
}

// @desc    Get posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate('user', 'name').sort({ createdAt: -1 });
  res.status(200).json(posts.map(formatPost));
});

// @desc    Get user posts
// @route   GET /api/posts/user/:userId
// @access  Public
const getPostsByUser = asyncHandler(async (req, res) => {
    const posts = await Post.find({ user: req.params.userId }).populate('user', 'name').sort({ createdAt: -1 });
    res.status(200).json(posts.map(formatPost));
});

// @desc    Create post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error('Please add a text field');
  }

  const postData = {
    text: text,
    user: req.user.id,
  };

  if (req.file) {
    postData.imageUrl = `/uploads/${req.file.filename}`;
  }

  const post = await Post.create(postData);
  const populatedPost = await Post.findById(post._id).populate('user', 'name');

  res.status(201).json(formatPost(populatedPost));
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(400);
    throw new Error('Post not found');
  }

  if (post.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }
  
  post.text = req.body.text || post.text;
  
  await post.save();
  const populatedPost = await Post.findById(post._id).populate('user', 'name');

  res.status(200).json(formatPost(populatedPost));
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(400);
    throw new Error('Post not found');
  }

  if (post.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await post.deleteOne();

  res.status(200).json({ id: req.params.id });
});

// @desc    Like/Unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLike = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
  
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
  
    const userId = req.user._id;
    const isLiked = post.likes.some(likeId => likeId.equals(userId));
  
    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(likeId => !likeId.equals(userId));
    } else {
      // Like
      post.likes.push(userId);
    }
  
    await post.save();
    const populatedPost = await Post.findById(post._id).populate('user', 'name');
  
    res.status(200).json(formatPost(populatedPost));
});

module.exports = {
  getPosts,
  getPostsByUser,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
};
