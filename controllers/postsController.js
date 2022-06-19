///////////////////////////////////////////////////////
// IMPORTS
// Models
const Post = require('../models/Post');
const Comment = require('../models/Comment');
// to id util
const toId = require('../utils/toId');
///////////////////////////////////////////////////////

// EXPORTS
// GET Exports
// Retorna todos os posts
exports.getAllPosts = async (req, res) => {
  const page = req.query.p || 0;
  const postPerPage = 3;

  try {
    const posts = await Post.find()
      .populate({
        path: 'user',
        select: 'name avatar',
      })
      .skip(page * postPerPage)
      .limit(postPerPage);
    res.status(200).json({
      success: true,
      results: posts.length,
      page: page,
      data: posts,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Retorna post ordenados por data de criação mais recente
exports.getLatestPosts = async (req, res) => {
  const page = parseInt(req.query.p, 10) || 0;
  const postPerPage = 3;
  try {
    const totalPosts = await Post.estimatedDocumentCount();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar')
      .skip(page * postPerPage)
      .limit(postPerPage);
    res.status(200).json({
      success: true,
      results: posts.length,
      totalResults: totalPosts,
      totalPages: Math.ceil(totalPosts / postPerPage),
      page: page,
      nextPage: page + 1,
      data: posts,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Retorna os posts com mais comentários criados recentemente
exports.getTrendingPosts = async (req, res) => {
  const page = parseInt(req.query.p, 10) || 0;
  const postPerPage = 3;
  try {
    const totalPosts = await Post.estimatedDocumentCount();
    const posts = await Post.find()
      .sort({ comments: -1 })
      .sort({ updatedAt: -1 })
      .populate('user', 'name avatar')
      .skip(page * postPerPage)
      .limit(postPerPage);
    res.status(200).json({
      success: true,
      results: posts.length,
      totalResults: totalPosts,
      totalPages: Math.ceil(totalPosts / postPerPage),
      page: page,
      nextPage: page + 1,
      data: posts,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// get all posts that where description matches search term
exports.searchPosts = async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.p, 10) || 0;
  const postPerPage = 3;
  try {
    const totalPosts = await Post.find({
      $or: [
        { description: { $regex: q, $options: 'i' } },
        { streetName: { $regex: q, $options: 'i' } },
      ],
    });
    const posts = await Post.find({
      $or: [
        { description: { $regex: q, $options: 'i' } },
        { streetName: { $regex: q, $options: 'i' } },
      ],
    })
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar')
      .skip(page * postPerPage)
      .limit(postPerPage);
    res.status(200).json({
      success: true,
      results: posts.length,
      totalResults: totalPosts.length,
      totalPages: Math.ceil(totalPosts.length / postPerPage),
      page: page,
      nextPage: page + 1,
      data: posts,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Retorna um post especifico
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name avatar',
      })
      .populate({
        path: 'comments',
        select: 'user body',
        populate: { path: 'user', select: 'name avatar' },
      });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Retorna comentarios de um post
exports.getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .select('user body createdAt')
      .populate({ path: 'user', select: 'name avatar' })
      .where('postId')
      .equals(req.params.id);
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Retorna todos os comentários
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate({
      path: 'user',
      select: 'name avatar',
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Retorna comentário especifico
exports.getComment = async (req, res) => {
  try {
    const comments = await Comment.findById(req.params.id).populate({
      path: 'user',
      select: 'name avatar',
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST Exports
// Cria um novo post
exports.createPost = async (req, res) => {
  const post = new Post({
    user: req.body.user,
    postType: req.body.postType,
    description: req.body.description,
    photo: req.body.photo,
    newPhoto: req.body.newPhoto,
    streetName: req.body.streetName,
    coordinates: req.body.coordinates,
    contentDate: req.body.contentDate,
  });

  try {
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Adiciona comentário a um post
exports.addComment = async (req, res) => {
  const post = await Post.findById(req.params.id);
  const newComment = new Comment({
    postId: req.params.id,
    user: req.body.user,
    body: req.body.body,
  });

  try {
    const savedComment = await newComment.save();
    await post.comments.push(savedComment._id);
    await post.save();
    res.status(201).json({ success: true, message: 'Comment added' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE Exports
// Apaga um post especifico juntamente com todos os comentários
exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ postId: req.params.id });
    res
      .status(200)
      .json({ success: true, message: 'Post & Comments deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Apaga comentário
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    post.comments.pull(req.params.id);
    await post.save();
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Comment Deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//PUT REQUESTS
// Atualiza um Post especifico
exports.updatePost = async (req, res) => {
  const update = req.body;
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    res
      .status(200)
      .json({ success: true, message: 'Post Updated', content: updatedPost });
  } catch (erro) {
    res.status(400).json({ success: false, message: erro.message });
  }
};

// Atualiza um Comentário especifico
exports.updateComment = async (req, res) => {
  const update = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      update,
      {
        new: true,
      },
    );
    res.status(200).json({
      success: true,
      message: 'Comment Updated',
      content: updatedComment,
    });
  } catch (erro) {
    res.status(400).json({ success: false, message: erro.message });
  }
};
