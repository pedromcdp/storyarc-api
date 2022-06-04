///////////////////////////////////////////////////////
// IMPORTS
const toId = require('../utils/toId');
// Models
const User = require('../models/User');
const Post = require('../models/Post');
///////////////////////////////////////////////////////

// EXPORTS
// GET Exports
// Retorna todos os users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Retorna user especifico
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'savedPosts',
      populate: {
        path: 'user',
        select: 'name avatar',
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Retorna todos os posts de um utilizador
exports.getUserPosts = async (req, res) => {
  try {
    const userPosts = await Post.find()
      .where('user')
      .equals(req.params.id)
      .populate('user');
    res.status(200).json(userPosts);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Retorna Posts guardados do utilizador
exports.getUserSavedPosts = async (req, res) => {
  try {
    const userSavedPosts = await User.findById(req.params.id)
      .select('savedPosts')
      .populate({
        path: 'savedPosts',
        populate: { path: 'user', select: 'name avatar' },
      });
    res.status(200).json(userSavedPosts);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST Exports
// Adiciona um novo utilizador
exports.createUser = async (req, res) => {
  const user = new User({
    _id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    avatar: req.body.avatar,
  });

  try {
    const createUser = await user.save();
    res
      .status(201)
      .json({ success: true, message: 'User created', data: createUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Adiciona post aos savedPosts do user
exports.addPostToSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.savedPosts.push(req.body.postId);
    await user.save();
    res
      .status(200)
      .json({ success: true, message: 'Post added to savedPosts' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// like a post
exports.likePost = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const post = await Post.findById(req.body.postId);
    user.likedPosts.push(req.body.postId);
    post.likes.push(req.params.id);
    await user.save();
    await post.save();
    res.status(200).json({ success: true, message: 'Post liked' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// dislike a post
exports.dislikePost = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const post = await Post.findById(req.body.postId);
    user.likedPosts.pull(req.body.postId);
    post.likes.pull(req.params.id);
    await user.save();
    await post.save();
    res.status(200).json({ success: true, message: 'Post disliked' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE REQUESTS
// Apaga um utilizador
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//PUT REQUESTS
//Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ success: true, message: 'User Updated', data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Create or update user
exports.createOrUpdateUser = async (req, res) => {
  const userId = req.body.id;
  try {
    const user = await User.findById(userId);
    if (user) {
      await User.findByIdAndUpdate(userId, req.body, { new: true });
      res.status(200).json({ success: true, message: 'User updated' });
    } else {
      const user = new User({
        _id: userId,
        name: req.body.name,
        email: req.body.email,
        avatar: req.body.avatar,
      });
      const createUser = await user.save();
      res
        .status(201)
        .json({ success: true, message: 'User created', data: createUser });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};